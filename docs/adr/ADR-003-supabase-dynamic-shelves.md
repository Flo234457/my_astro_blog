# ADR-002: Use Supabase PostgreSQL for Dynamic User Shelves

## Status
Accepted (2026-10-27)

## Context
The BookMarks application requires users to create and manage personalised book shelves.

Previously, the homepage displayed static content. To support dynamic shelves, the application needs persistent storage that associates each shelf with its owner.

The application already uses Supabase for user authentication.

## Decision
We will use Supabase PostgreSQL to store user-created shelves.

Each shelf will contain:
- A unique shelf ID (UUID).
- The authenticated user's ID.
- A shelf name.
- A selected cover image path.
- A creation timestamp.

The database will use a foreign key referencing `auth.users` to associate shelves with authenticated users.

Row Level Security (RLS) will be enabled, with policies restricting SELECT, INSERT, UPDATE and DELETE operations to the shelf owner.

Database schema changes will be stored in version-controlled SQL migration files.

Astro will provide dynamic shelf routes using `/shelves/[id]`, while the Supabase JavaScript client will retrieve shelf data in the browser.

## Consequences

### Positive
- Shelves persist between sessions.
- Each user can access their own shelves.
- Supabase integrates with the existing authentication system.
- Database schema changes can be reviewed through Git.
- Dynamic shelf pages can be added without creating a separate database server.

### Negative
- The application depends on Supabase availability.
- Database schema changes require migration management.
- Client-side data loading introduces additional browser requests.
- Server-side authentication and data fetching would require further implementation.

## Alternatives Considered
- **Static JSON files:** Unsuitable for persistent, user-specific data.
- **AWS RDS PostgreSQL:** Would provide an AWS-hosted database but introduce additional infrastructure and operational responsibilities.

## Implementation
- Create the `public.shelves` table in Supabase.
- Enable RLS and ownership policies.
- Store the SQL schema in `supabase/migrations/`.
- Implement shelf creation and retrieval.
- Display shelves dynamically on `/homepage`.
- Implement individual shelf pages using `/shelves/[id]`.

## Future Considerations
- Implement shelf editing and deletion in the user interface.
- Add books to shelves.
- Introduce server-side authentication and data fetching.
- Automate database migration execution in the deployment pipeline.