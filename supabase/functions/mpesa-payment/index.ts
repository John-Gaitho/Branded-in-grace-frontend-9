import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const mpesaConsumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
const mpesaConsumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
const mpesaShortcode = Deno.env.get('MPESA_SHORTCODE') || '174379';
const mpesaPasskey = Deno.env.get('MPESA_PASSKEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate M-Pesa access token
async function generateAccessToken(): Promise<string> {
  const auth = btoa(`${mpesaConsumerKey}:${mpesaConsumerSecret}`);
  
  const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Generate password for STK push
function generatePassword(): string {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = btoa(`${mpesaShortcode}${mpesaPasskey}${timestamp}`);
  return password;
}

// Get current timestamp
function getTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

// Initiate STK Push
async function initiateSTKPush(accessToken: string, phoneNumber: string, amount: number, accountReference: string) {
  const timestamp = getTimestamp();
  const password = generatePassword();

  const stkPushPayload = {
    BusinessShortCode: mpesaShortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: mpesaShortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: `${supabaseUrl}/functions/v1/mpesa-callback`,
    AccountReference: accountReference,
    TransactionDesc: `Payment for ${accountReference}`
  };

  const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stkPushPayload),
  });

  if (!response.ok) {
    throw new Error(`STK Push failed: ${response.statusText}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('M-Pesa payment function called');

    if (!mpesaConsumerKey || !mpesaConsumerSecret || !mpesaPasskey) {
      throw new Error('M-Pesa credentials not configured');
    }

    const { phoneNumber, amount, accountReference } = await req.json();

    if (!phoneNumber || !amount) {
      throw new Error('Phone number and amount are required');
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/^\+/, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log(`Initiating payment for ${formattedPhone}, amount: ${amount}`);

    // Generate access token
    const accessToken = await generateAccessToken();
    console.log('Access token generated successfully');

    // Initiate STK push
    const stkResponse = await initiateSTKPush(
      accessToken,
      formattedPhone,
      amount,
      accountReference || 'Order Payment'
    );

    console.log('STK Push response:', stkResponse);

    // Store transaction in database for tracking
    if (stkResponse.CheckoutRequestID) {
      const { error: dbError } = await supabase
        .from('mpesa_transactions')
        .insert({
          checkout_request_id: stkResponse.CheckoutRequestID,
          phone_number: formattedPhone,
          amount: amount,
          account_reference: accountReference,
          status: 'pending'
        });

      if (dbError) {
        console.error('Error storing transaction:', dbError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'STK push sent successfully',
      data: stkResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in M-Pesa payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});