require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_IMAGES;