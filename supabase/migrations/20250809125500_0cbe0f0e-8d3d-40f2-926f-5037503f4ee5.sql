-- Add delete policy for contact messages
CREATE POLICY "Admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (is_admin_or_owner(auth.uid()));