// Load environment variables from .env for Prisma CLI
// This ensures Prisma picks up DATABASE_URL when running `npx prisma ...`
require('dotenv').config();

// Export an empty config; loading dotenv is enough to provide env vars.
module.exports = {};
