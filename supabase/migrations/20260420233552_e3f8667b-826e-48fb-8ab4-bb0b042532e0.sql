-- Add is_admin column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create a security definer function to check if a user is admin
-- This avoids RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = _user_id),
    false
  )
$$;

-- Add RLS policy so admins can view all profiles
CREATE POLICY "Admins podem ver todos os perfis"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add RLS policy so admins can update all profiles
CREATE POLICY "Admins podem atualizar todos os perfis"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));