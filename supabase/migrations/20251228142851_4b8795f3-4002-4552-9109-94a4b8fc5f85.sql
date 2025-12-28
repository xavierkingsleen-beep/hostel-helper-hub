-- Add roll_number column to leave_applications table
ALTER TABLE public.leave_applications 
ADD COLUMN roll_number text;

-- Add roll_number to profiles table for storing student roll numbers
ALTER TABLE public.profiles 
ADD COLUMN roll_number text;