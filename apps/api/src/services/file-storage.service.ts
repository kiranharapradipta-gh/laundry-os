import { supabase } from "../config/supabase.js";

const storageBucket = process.env.SUPABASE_STORAGE_BUCKET;

if (!storageBucket) {
  throw new Error(
    "SUPABASE_STORAGE_BUCKET belum diset"
  );
}

const bucket: string = storageBucket;

export async function uploadFile(
  file: Buffer,
  storageKey: string,
  contentType: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storageKey, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFile(
  storageKey: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([storageKey]);

  if (error) {
    throw error;
  }

  return data;
}

export async function createSignedUrl(
  storageKey: string,
  expiresIn = 60 * 60
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storageKey, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}