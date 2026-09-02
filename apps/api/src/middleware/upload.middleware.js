import multer from "multer";
const storage = multer.memoryStorage();
export const uploadItemPhoto = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        console.log("📸 Upload file:");
        console.log("Name:", file.originalname);
        console.log("Mimetype:", file.mimetype);
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/octet-stream",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new Error(`Format foto tidak didukung. MIME: ${file.mimetype}`));
        }
        callback(null, true);
    },
});
// import multer from "multer";
// const storage = multer.memoryStorage();
// export const uploadItemPhoto = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
//   fileFilter: (_req, file, callback) => {
//     console.log("📸 Upload file:");
//     console.log("Name:", file.originalname);
//     console.log("Mimetype:", file.mimetype);
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return callback(
//         new Error(
//           `Format foto tidak didukung. MIME: ${file.mimetype}`
//         )
//       );
//     }
//     callback(null, true);
//   },
// });
// import multer from "multer";
// const storage = multer.memoryStorage();
// export const uploadItemPhoto = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5 MB
//   },
//   fileFilter: (_req, file, callback) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return callback(
//         new Error(
//           "Format foto tidak didukung. Gunakan JPG, PNG, atau WEBP."
//         )
//       );
//     }
//     callback(null, true);
//   },
// });
//# sourceMappingURL=upload.middleware.js.map