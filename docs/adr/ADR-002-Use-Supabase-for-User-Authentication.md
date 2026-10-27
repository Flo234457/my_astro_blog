# ADR-002: Use Supabase for User Authentication

## Status
Accepted (20-10-26)

## Context

The BookMarks application requires user authentication to allow users to create accounts, log in, and eventually access personalised dashboards and saved book collections.

Building a custom authentication system would require implementing secure password storage, session management, and account verification.

The project needs a reliable authentication solution that integrates with the existing Astro SSR application.

## Decision

We will use Supabase Auth as the authentication provider for BookMarks.

Supabase will manage user registration, login, password security, email verification, and authentication sessions.

The Astro application will communicate with Supabase using the official Supabase JavaScript client.

## Consequences

### Positive
- Reduces the complexity of implementing authentication.
- Provides secure password management without building a custom system.
- Supports email verification and session management.
- Integrates with the existing Astro application.
- Allows future integration with Supabase PostgreSQL for user-specific book collections.

### Negative
- Introduces a dependency on an external service.
- Requires managing environment variables and API credentials.
- Authentication availability depends on Supabase.
- May introduce additional costs as the application grows.
- Requires careful implementation of server-side session validation and access controls.

## Alternatives Considered

**Custom Authentication:** Rejected because implementing secure password storage and session management would increase development complexity and security risks.

**AWS Cognito:** Considered as an AWS-native authentication solution, but Supabase was selected for its straightforward integration and simpler initial setup.

