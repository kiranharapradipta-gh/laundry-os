import "dotenv/config";
import { supabase } from "../config/supabase.js";
async function main() {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    if (!bucket) {
        throw new Error("SUPABASE_STORAGE_BUCKET belum diset");
    }
    const { data, error } = await supabase.storage
        .from(bucket)
        .list("", {
        limit: 10,
    });
    if (error) {
        throw error;
    }
    console.log("✅ Supabase Storage berhasil terhubung");
    console.log("Bucket:", bucket);
    console.log("Files:", data);
}
main().catch((error) => {
    console.error("❌ Supabase test gagal:", error);
    process.exit(1);
});
//# sourceMappingURL=test-supabase.js.map