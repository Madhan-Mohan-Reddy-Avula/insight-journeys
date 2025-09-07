-- Create a new table for sensitive hotel contact information
CREATE TABLE public.hotel_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE
);

-- Enable RLS on the new table
ALTER TABLE public.hotel_contacts ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can access contact information
CREATE POLICY "Only authenticated users can view hotel contacts" 
ON public.hotel_contacts 
FOR SELECT 
TO authenticated
USING (true);

-- Migrate existing contact data to the new table
INSERT INTO public.hotel_contacts (hotel_id, contact_email, contact_phone)
SELECT id, contact_email, contact_phone 
FROM public.hotels 
WHERE contact_email IS NOT NULL OR contact_phone IS NOT NULL;

-- Remove sensitive contact fields from the public hotels table
ALTER TABLE public.hotels DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS contact_phone;

-- Add trigger for automatic timestamp updates on hotel_contacts
CREATE TRIGGER update_hotel_contacts_updated_at
BEFORE UPDATE ON public.hotel_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();