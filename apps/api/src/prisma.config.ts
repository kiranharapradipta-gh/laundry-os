import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({
  path: "./apps/api/.env",
});

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});

// import dotenv from "dotenv";
// import { defineConfig, env } from "prisma/config";

// dotenv.config({
//   path: "./apps/api/.env",
// });

// export default defineConfig({
//   schema: "apps/api/src/prisma/schema.prisma",

//   migrations: {
//     path: "apps/api/src/prisma/migrations",
//   },

//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });