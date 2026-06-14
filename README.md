# User Management Backend

Backend API for the User Management System built with Express, TypeScript, Prisma, and PostgreSQL.

## Live Demo

- Frontend: https://itransition-auth.vercel.app/
- Backend: https://itransition-auth-backend.vercel.app/

## Features

- User registration
- User authentication using JWT
- Email verification
- Password hashing
- User blocking and unblocking
- User deletion
- Bulk operations on selected users
- Protected routes
- Request validation using Zod
- Database-level email uniqueness enforcement
- Automatic authentication checks for blocked or deleted users

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- Nodemailer

## Installation

Clone the repository:

```bash
git clone https://github.com/ShohjahonAhmad/itransition-auth-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=<postgresql-connection-string>
JWT_SECRET=<jwt-secret>
PORT=<port>
EMAIL_USER=<email-account>
EMAIL_PASSWORD=<email-password>
BASE_URL=<backend-url>
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply database schema:

```bash
npx prisma migrate deploy
```

## Build

Generate Prisma Client and compile TypeScript:

```bash
npm run build
```

This command executes:

```bash
npx prisma generate
tsc
```

## Run

Start the compiled application:

```bash
node dist/src/app.js
```

For local development:

```bash
npm run start
```

## Database

The application uses PostgreSQL and Prisma ORM.

Email uniqueness is enforced through a database unique index, ensuring that duplicate accounts cannot be created even under concurrent requests.

## Authentication

Authentication is handled using JWT tokens.

Protected endpoints verify that:

- the token is valid;
- the user still exists;
- the user is not blocked.

If a user becomes blocked or deleted, all subsequent authenticated requests are rejected.

## Email Verification

After registration, users are immediately created in the database with the status:

```text
Unverified
```

A verification email is sent asynchronously.

After clicking the verification link, the account status changes to:

```text
Active
```

Blocked accounts remain blocked even after verification.

## API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/verify/:token
```

### Users

```http
GET    /users
PATCH  /users/block
DELETE /users
DELETE /users/unverified
```

## User Statuses

- Active
- Unverified
- Blocked

## Deployment

The backend is deployed on Vercel.
