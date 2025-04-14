# bitrock-center

Modularized platform for Bitrock internal use.

## Setup

- `corepack enable`
- `yarn`
- `yarn build`
- `yarn dev`:
  - frontend on `localhost:3001`
  - backend on `localhost:3000`

## Development Workflow

We are going to use [`github flow`](https://docs.github.com/en/get-started/using-github/github-flow) as branching strategy.

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

- Conventional Commit: check commit message format with [standard format](https://www.conventionalcommits.org/en/v1.0.0/)
- Pre-commit checks with [husky](https://www.npmjs.com/package/husky): check linting & commit message format

### Branch protection

We cannot merge directly in `main` and we will require the pipelines to pass.
