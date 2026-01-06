-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  room_number TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Students can create their own complaints
CREATE POLICY "Students can create their own complaints" 
ON public.complaints 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Students can view their own complaints
CREATE POLICY "Students can view their own complaints" 
ON public.complaints 
FOR SELECT 
USING (auth.uid() = student_id);

-- Admins can view all complaints
CREATE POLICY "Admins can view all complaints" 
ON public.complaints 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all complaints
CREATE POLICY "Admins can update all complaints" 
ON public.complaints 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();