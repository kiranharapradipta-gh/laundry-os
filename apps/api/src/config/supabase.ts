import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "apps/api/.env"),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL belum diset");
}

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY belum diset");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);