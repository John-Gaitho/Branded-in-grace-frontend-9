import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('M-Pesa callback received');
    
    const callbackData = await req.json();
    console.log('Callback data:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      console.log('Invalid callback format');
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    let transactionStatus = 'failed';
    let mpesaReceiptNumber = null;
    let transactionDate = null;
    let phoneNumber = null;
    let amount = null;

    if (ResultCode === 0) {
      // Payment successful
      transactionStatus = 'completed';
      
      if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
        const items = stkCallback.CallbackMetadata.Item;
        
        for (const item of items) {
          switch (item.Name) {
            case 'MpesaReceiptNumber':
              mpesaReceiptNumber = item.Value;
              break;
            case 'TransactionDate':
              transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              phoneNumber = item.Value;
              break;
            case 'Amount':
              amount = item.Value;
              break;
          }
        }
      }
    } else {
      // Payment failed
      transactionStatus = 'failed';
    }

    // Update transaction in database
    const { error } = await supabase
      .from('mpesa_transactions')
      .update({
        status: transactionStatus,
        result_code: ResultCode,
        result_desc: ResultDesc,
        mpesa_receipt_number: mpesaReceiptNumber,
        transaction_date: transactionDate,
        updated_at: new Date().toISOString()
      })
      .eq('checkout_request_id', CheckoutRequestID);

    if (error) {
      console.error('Error updating transaction:', error);
    } else {
      console.log(`Transaction ${CheckoutRequestID} updated with status: ${transactionStatus}`);
    }

    // Return success response to Safaricom
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Success"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in M-Pesa callback:', error);
    
    // Still return success to avoid retries from Safaricom
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Success"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});