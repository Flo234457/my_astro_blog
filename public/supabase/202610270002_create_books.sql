
CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shelf_id UUID NOT NULL
        REFERENCES public.shelves(id)
        ON DELETE CASCADE,
    open_library_id TEXT,
    title TEXT NOT NULL,
    author TEXT,
    cover_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX books_shelf_id_idx
ON public.books(shelf_id);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view books in their shelves"
ON public.books FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.shelves
        WHERE shelves.id = books.shelf_id
        AND shelves.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can add books to their shelves"
ON public.books FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shelves
        WHERE shelves.id = books.shelf_id
        AND shelves.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can update books in their shelves"
ON public.books FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.shelves
        WHERE shelves.id = books.shelf_id
        AND shelves.user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shelves
        WHERE shelves.id = books.shelf_id
        AND shelves.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can remove books from their shelves"
ON public.books FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.shelves
        WHERE shelves.id = books.shelf_id
        AND shelves.user_id = (SELECT auth.uid())
    )
);
