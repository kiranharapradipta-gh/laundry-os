import dotenv from "dotenv";

dotenv.config({
  path: "apps/api/.env",
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "ADA" : "TIDAK ADA"
);