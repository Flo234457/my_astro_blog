-- Create the shelves table
CREATE TABLE public.shelves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    name TEXT NOT NULL
        CHECK (char_length(trim(name)) BETWEEN 1 AND 100),

    cover_image TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Improve performance when loading a user's shelves
CREATE INDEX shelves_user_id_idx
ON public.shelves(user_id);

-- Enable Row Level Security
ALTER TABLE public.shelves ENABLE ROW LEVEL SECURITY;

-- Users can view their own shelves
CREATE POLICY "Users can view their own shelves"
ON public.shelves
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Users can create their own shelves
CREATE POLICY "Users can create their own shelves"
ON public.shelves
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update their own shelves
CREATE POLICY "Users can update their own shelves"
ON public.shelves
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can delete their own shelves
CREATE POLICY "Users can delete their own shelves"
ON public.shelves
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);