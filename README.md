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
