# bitrock/db

This package defines a prisma client and exports also type definitions from prisma schema.

## Setup

- Setup local `.env` with `DATABASE_URL`
- run `npx prisma db pull` to update prisma schema with current local database
- run `npx prisma generate` to update type definition with current prisma schema
