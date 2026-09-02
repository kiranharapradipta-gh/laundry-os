import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";
async function main() {
    const business = await prisma.business.create({
        data: {
            name: "LaundryOS Demo",
            phone: "08123456789",
            address: "Medan",
        },
    });
    const passwordHash = await bcrypt.hash("password", 10);
    const owner = await prisma.user.create({
        data: {
            businessId: business.id,
            name: "Ran",
            phone: "08123456789",
            password: passwordHash,
            role: "OWNER",
        },
    });
    console.log("✅ Business berhasil dibuat");
    console.log("Business ID:", business.id);
    console.log("\n✅ Owner berhasil dibuat");
    console.log("Owner ID:", owner.id);
    console.log("Phone:", owner.phone);
    console.log("Password: password");
}
main()
    .catch((error) => {
    console.error("❌ Gagal membuat owner:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-owner.js.map