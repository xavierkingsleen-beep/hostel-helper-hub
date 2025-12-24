-- Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  room_number TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Create leave_applications table
CREATE TABLE public.leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  room_number TEXT,
  phone TEXT,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  parent_contact TEXT,
  address_during_leave TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mess_menu table
CREATE TABLE public.mess_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL UNIQUE,
  breakfast TEXT NOT NULL DEFAULT '',
  lunch TEXT NOT NULL DEFAULT '',
  dinner TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hostel_rules table
CREATE TABLE public.hostel_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quick_links table
CREATE TABLE public.quick_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Link',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Leave applications policies
CREATE POLICY "Students can view their own applications"
ON public.leave_applications FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own applications"
ON public.leave_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all applications"
ON public.leave_applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all applications"
ON public.leave_applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Module tables policies (everyone can read, admins can write)
CREATE POLICY "Anyone can view mess menu"
ON public.mess_menu FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage mess menu"
ON public.mess_menu FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view emergency contacts"
ON public.emergency_contacts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage emergency contacts"
ON public.emergency_contacts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view hostel rules"
ON public.hostel_rules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage hostel rules"
ON public.hostel_rules FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view quick links"
ON public.quick_links FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage quick links"
ON public.quick_links FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_leave_applications_updated_at
  BEFORE UPDATE ON public.leave_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_mess_menu_updated_at
  BEFORE UPDATE ON public.mess_menu
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert default mess menu data
INSERT INTO public.mess_menu (day, breakfast, lunch, dinner) VALUES
('Monday', 'Poha, Tea, Banana', 'Rice, Dal, Sabzi, Roti', 'Chapati, Paneer, Rice'),
('Tuesday', 'Idli, Sambar, Coffee', 'Rice, Rajma, Salad', 'Rice, Dal Fry, Roti'),
('Wednesday', 'Paratha, Curd, Tea', 'Rice, Chole, Raita', 'Chapati, Mix Veg, Rice'),
('Thursday', 'Upma, Chutney, Coffee', 'Rice, Dal Tadka, Sabzi', 'Rice, Kadhi, Roti'),
('Friday', 'Bread, Butter, Eggs, Tea', 'Biryani, Raita, Salad', 'Chapati, Dal, Sabzi'),
('Saturday', 'Dosa, Sambar, Coffee', 'Rice, Sambar, Papad', 'Puri, Aloo Sabzi, Rice'),
('Sunday', 'Chole Bhature, Lassi', 'Special Thali', 'Chapati, Paneer Butter Masala');

-- Insert default emergency contacts
INSERT INTO public.emergency_contacts (name, role, phone, sort_order) VALUES
('Hostel Warden', 'Chief Warden', '+91 98765 43210', 1),
('Security Office', 'Security Head', '+91 98765 43211', 2),
('Medical Center', 'Doctor on Call', '+91 98765 43212', 3),
('Maintenance', 'Facility Manager', '+91 98765 43213', 4);

-- Insert default hostel rules
INSERT INTO public.hostel_rules (rule, sort_order) VALUES
('Maintain silence in corridors after 10 PM', 1),
('No visitors allowed after 8 PM without prior permission', 2),
('Keep your room clean and tidy at all times', 3),
('Report any maintenance issues immediately to the warden', 4),
('Ragging in any form is strictly prohibited', 5);

-- Insert default quick links
INSERT INTO public.quick_links (title, url, icon, sort_order) VALUES
('University Portal', 'https://university.edu', 'GraduationCap', 1),
('Library', 'https://library.university.edu', 'BookOpen', 2),
('Fee Payment', 'https://fees.university.edu', 'CreditCard', 3),
('Exam Results', 'https://results.university.edu', 'FileText', 4);

-- Insert default events
INSERT INTO public.events (title, event_date, event_time, location) VALUES
('Hostel Day Celebration', CURRENT_DATE + INTERVAL '7 days', '6:00 PM', 'Main Auditorium'),
('Sports Meet', CURRENT_DATE + INTERVAL '14 days', '9:00 AM', 'Sports Ground'),
('Cultural Night', CURRENT_DATE + INTERVAL '21 days', '7:00 PM', 'Open Air Theater');