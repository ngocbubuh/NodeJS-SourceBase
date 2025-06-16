# Node.js TypeScript Starter

This is a simple Node.js + TypeScript project using Prisma ORM.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up the Database

```bash
npx prisma db push
```

### 3. Seed the Database

```bash
npx prisma db seed
```

After seeding, a default account will be created:
- Email: master@master.com
- Password: Abc@12345

## Scripts
Start the development server
```bash
npm run dev 
```

Open Prisma Studio to explore the database
```bash
npx prisma studio
```
## Note
Please change .env.example to .env and fill in your own secrets.
