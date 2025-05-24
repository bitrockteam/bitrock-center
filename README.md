# bitrock-center

Modularized platform for Bitrock internal use.

- [GitHub Repository](https://github.com/bitrockteam/bitrock-center)
- [Board](https://github.com/orgs/bitrockteam/projects/42/views/1)
- [Wiki](https://github.com/bitrockteam/bitrock-center/wiki)
- [Supabase Dashboard](https://supabase.com/dashboard/project/srefiqyvwyenjzzcqivd)
- [env variables on Notion](https://www.notion.so/Bitrock-Center-1cb75833085d80e3b914dbc329e4170c) (ask Davide Ghiotto
  for access)

## Getting Started

### Clone the repository

```bash
git clone git@github.com:bitrockteam/bitrock-center.git
```

### Set env variables

- See env variables on https://www.notion.so/Bitrock-Center-1cb75833085d80e3b914dbc329e4170c (ask Davide Ghiotto for
  access)
- Copy `apps/backend/.env_example` to `apps/backend/.env` file and update the values accordingly.
- Copy `apps/frontend/.env_example` to `apps/frontend/.env` file and update the values accordingly.

### Setup local instance Supabase

- install the [supabase cli](https://supabase.com/docs/guides/local-development/cli/getting-started#updating-the-supabase-cli) (optional): if not installed a prefix `npx` is required to run the supabase via command line
- run `supabase login` to access the hosted supabase instance
- run `supabase link` to link the local instance to the remote one (for database diff, migrations and other stuff)
- run `supabase start` will start a docker container for your local supabase instance

If everything run correctly you should see something like this on your terminal:

```bash
Started supabase local development setup.
         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

Access the studio at [http://localhost:54323](http://localhost:54323).

To stop the container just run `supabase stop`.

#### Updating local from remote

- `supabase db pull` to download locally the remote configuration along with the schema
- `supabase db dump -f supabase/seed.sql --data-only` to download only the data available in the remote instance
  > Warning: do not commit `supabase/seed.sql` file since it contains data from the authentication of the users. First we need to exclude this data from the local dump
- `supabase migration up` to apply the new migrations
- `supabase db reset` to reset the local instance and restarting it applying the new schema and seed data from the remote updates

This procedure will automatically apply the migrations.

#### Update remote from local

- create a migration with `supabase db diff -f <your-migration-name>`
- locally test that running `supabase db reset` will manage correctly the migration
- when all checks are done (and maybe after releasing in develop/main branch) run the `supabase db push` command to push your local changes to the remote instance

The `push` command will not reset the data on the remote instance.

### Install dependencies

- `nvm install` (or `nvm use` if you have already installed the version written in `.nvmrc` file)
- `corepack enable`
- `yarn`
- `yarn build`
- `yarn dev`:
  - frontend on `localhost:3001`
  - backend on `localhost:3000`

## Development Workflow

We are going to use [`github flow`](https://docs.github.com/en/get-started/using-github/github-flow) as branching
strategy.

### Branch naming convention

- feature branch: `feat/<issue-number>-branch-summary-here` -> e.g. (5-users-management)
- bug branch: `bug/<issue-number>-branch-summary-here`

### Issue Flow

Issue states:

- to do
- in progress
- pull requested
- dev released
- done

### Commit Convention & Checks

- Conventional Commit: check commit message format
  with [standard format](https://www.conventionalcommits.org/en/v1.0.0/)
- Pre-commit checks with [husky](https://www.npmjs.com/package/husky): check linting & commit message format

### Branch protection

We cannot merge directly in `main` and we will require the pipelines to pass.

## Technologies

- [Turborepo](https://turborepo.com/docs)
- [Docker](https://www.docker.com/)
- [yarn](https://yarnpkg.com)
- [TypeScript](https://www.typescriptlang.org)
- [Node.js](https://nodejs.org/en/) v22.15.0
- [Vercel](https://vercel.com/) for `frontend` deployment (?)
- [Render](https://render.com/) for `backend` deployment (?)
- [eslint](https://eslint.org/) for code linting
- [prettier](https://prettier.io/) for code formatting (?)
- [husky](https://typicode.github.io/husky) for pre-commit hooks

### Frontend

- [Next.js](https://nextjs.org)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide React](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Backend

- [Express](https://expressjs.com)
- [Prisma](https://www.prisma.io)
- [Supabase](https://supabase.com)
- [PostgreSQL](https://www.postgresql.org)
