// Cloudinary utility for image uploads and management.
// Replaces Firebase Storage (free tier: 25 GB, no credit card).
// See PRD Section 5.3 and Phase 4.

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  uploadUrl: `https://api.cloudinary.com/v1_2/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

/**
 * Upload an image file to Cloudinary.
 * Works in both client-side and server-side contexts.
 */
export async function uploadImage(
  file: File | Buffer,
  options?: {
    folder?: string;
    transformation?: string;
    tags?: string[];
  }
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary env vars missing. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();

  if (file instanceof File) {
    formData.append("file", file);
  } else {
    // Buffer → Blob for server-side uploads
    const uint8Array = new Uint8Array(file);
    const blob = new Blob([uint8Array]);
    formData.append("file", blob, "image.png");
  }

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  if (options?.tags) {
    formData.append("tags", options.tags.join(","));
  }

  const response = await fetch(cloudinaryConfig.uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Cloudinary upload failed: ${response.status} - ${error.error?.message || "Unknown error"}`
    );
  }

  return response.json() as Promise<CloudinaryUploadResult>;
}

/**
 * Generate a Cloudinary image URL with optional transformations.
 * Example: getImageUrl("my-image", { width: 800, quality: "auto" })
 */
export function getImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
  }
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return "";
  }

  const parts = [
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  ];

  if (options?.width || options?.height || options?.quality || options?.format) {
    const transforms: string[] = [];
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    parts.push(transforms.join(","));
  }

  parts.push(publicId);

  return parts.join("/");
}
