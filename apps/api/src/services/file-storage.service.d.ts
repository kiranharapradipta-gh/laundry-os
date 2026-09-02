export declare function uploadFile(file: Buffer, storageKey: string, contentType: string): Promise<{
    id: string;
    path: string;
    fullPath: string;
}>;
export declare function deleteFile(storageKey: string): Promise<import("@supabase/storage-js").FileObject[]>;
export declare function createSignedUrl(storageKey: string, expiresIn?: number): Promise<string>;
//# sourceMappingURL=file-storage.service.d.ts.map