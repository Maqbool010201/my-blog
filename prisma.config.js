// prisma.config.js
require('dotenv').config(); // Load environment variables

module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // Connection URL defined here
  },
};