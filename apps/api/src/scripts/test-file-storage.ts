import {
  uploadFile,
  deleteFile,
} from "../services/file-storage.service.js";

async function main() {
  const storageKey =
    "test/laundryos-test.txt";

  const content = Buffer.from(
    "Hello from LaundryOS!"
  );

  const result = await uploadFile(
    content,
    storageKey,
    "text/plain"
  );

  console.log("✅ Upload berhasil");
  console.log(result);

  await deleteFile(storageKey);

  console.log("✅ Delete berhasil");
}

main().catch((error) => {
  console.error(
    "❌ Storage test gagal:",
    error
  );

  process.exit(1);
});