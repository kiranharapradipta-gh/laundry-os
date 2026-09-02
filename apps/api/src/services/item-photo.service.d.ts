interface CreateItemPhotoInput {
    file: Buffer;
    contentType: string;
    originalName: string;
}
export declare function createItemPhoto(businessId: string, orderId: string, orderItemId: string, input: CreateItemPhotoInput): Promise<{
    url: string;
    id: string;
    createdAt: Date;
    orderItemId: string;
    storageKey: string | null;
    caption: string | null;
}>;
export declare function getItemPhotos(businessId: string, orderId: string, orderItemId: string): Promise<{
    url: string;
    id: string;
    createdAt: Date;
    orderItemId: string;
    storageKey: string | null;
    caption: string | null;
}[]>;
export declare function deleteItemPhoto(businessId: string, orderId: string, orderItemId: string, photoId: string): Promise<{
    url: string;
    id: string;
    createdAt: Date;
    orderItemId: string;
    storageKey: string | null;
    caption: string | null;
}>;
export {};
//# sourceMappingURL=item-photo.service.d.ts.map