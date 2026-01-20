# PostgreSQL Installation Guide for Windows

## Method 1: PostgreSQL Installer (Recommended for Local Development)

### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (PostgreSQL 16+)

### Step 2: Install PostgreSQL
1. Run the installer
2. Click "Next" through the wizard
3. **Important**: Remember the password you set for the `postgres` user
4. Default port: 5432 (keep this)
5. Finish installation

### Step 3: Create Database
Open Command Prompt or PowerShell:

```bash
# Login to PostgreSQL (enter password when prompted)
psql -U postgres

# Create database
CREATE DATABASE rideshare;

# Exit
\q
```

### Step 4: Update .env file
Replace in `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/rideshare
```

---

## Method 2: Docker (If you have Docker Desktop)

```bash
# Start PostgreSQL container
docker run --name rideshare-db -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=rideshare -p 5432:5432 -d postgres:16

# Update .env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/rideshare
```

---

## Method 3: Free Cloud Database (No Installation)

### Neon (Recommended - Easiest)
1. Visit: https://neon.tech/
2. Sign up (free)
3. Create a project
4. Copy connection string
5. Paste in `.env` file

### Supabase
1. Visit: https://supabase.com/
2. Create account
3. Create new project
4. Go to Settings → Database
5. Copy connection string (URI format)
6. Paste in `.env` file

---

## After Database Setup

Run these commands to setup tables:

```bash
# Push database schema
npm run db:push

# Start server
npm run dev
```

## Verify Database Connection

Your server should start and show:
```
[INIT] Default admin created (username: admin, password: admin123)
[INIT] 5 sample approved drivers created
[INIT] 8 sample vehicles created with West Bengal routes
[express] serving on port 5000
```

## Troubleshooting

### Error: "DATABASE_URL must be set"
- Make sure `.env` file exists
- Verify DATABASE_URL is set correctly
- Restart the terminal

### Error: "Connection refused"
- PostgreSQL service not running
- Check port 5432 is not blocked
- Verify host/password are correct

### Error: "Database does not exist"
- Create database: `CREATE DATABASE rideshare;`
- Or let `npm run db:push` create it automatically
