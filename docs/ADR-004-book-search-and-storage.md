# ADR-002: Book Search and Persistent Shelf Storage

## Status
Accepted (2026-10-27)

## Context

The BookMarks application allows authenticated users to create personal bookshelves and organise books within them.

Users need a way to search for existing books without manually entering titles, authors and cover images. The application must also store selected books persistently so they remain available across sessions and deployments.

A solution is required that provides book metadata, supports user-specific data storage and integrates with the existing Astro application.

## Decision

We will use **Open Library Search API** to retrieve book metadata and **Supabase PostgreSQL** to store users' shelves and selected books.

The implementation will follow these decisions:

1. **Book search:** The Astro frontend will query Open Library to retrieve book titles, authors, identifiers and cover images.
2. **Persistent storage:** Supabase PostgreSQL will store shelves and saved books in separate, related tables.
3. **Data relationships:** Each book record will reference its parent shelf using `shelf_id`. Deleting a shelf will also delete its associated book records.
4. **Access control:** Supabase Authentication and PostgreSQL Row Level Security (RLS) will restrict access to data belonging to the authenticated user.
5. **Dynamic content:** The application will retrieve saved books and shelf information from Supabase rather than hardcoding them into the frontend.
6. **Book counters:** Dashboard book counts will be calculated using the book records associated with each shelf.

## Consequences

### Positive

- Users can search for books without manually entering all their details.
- Book metadata is available through a public external API.
- Shelves and books persist across browser sessions and application deployments.
- PostgreSQL relationships maintain the association between books and shelves.
- Row Level Security supports user-specific data isolation.
- Dashboard counters can reflect actual saved book records.

### Negative

- Book searches depend on the availability and performance of the Open Library API.
- Search results may contain incomplete or inaccurate metadata.
- External book cover images may be unavailable.
- Supabase introduces an external service dependency.
- Database schemas, migrations and RLS policies require ongoing maintenance.
- Client-side book counting may require a more scalable database-side approach as the number of saved books grows.

## Alternatives Considered

### Manual book entry

Users could enter titles, authors and covers themselves.

**Not selected:** This would require more user effort and would not provide automatic book discovery.

### Google Books API

Google Books was initially considered for retrieving book metadata.

**Not selected:** API rate limiting was encountered during development, so Open Library was adopted for the current implementation.

### Local browser storage

Book and shelf data could be saved in browser storage.

**Not selected:** Browser-local storage would not provide the required persistent, authenticated, cross-device database experience.

## Related Components

- `src/pages/book-search.astro`
- `src/pages/homepage.astro`
- `src/pages/shelves/[id].astro`
- `src/lib/supabase.ts`
- `supabase/migrations/202610270001_create_shelves.sql`
- `supabase/migrations/202610270002_create_books.sql`
