"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Image as ImageIcon, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Check } from "lucide-react";

interface TemplateUploadProps {
  onUploadSuccess?: () => void;
  prefillPrompt?: string;
  prefillTitle?: string;
  prefillDescription?: string;
  prefillGeneratedWith?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Lanjutan" },
] as const;

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function TemplateUpload({
  onUploadSuccess,
  prefillPrompt,
  prefillTitle,
  prefillDescription,
  prefillGeneratedWith,
  isOpen,
  onOpenChange,
}: TemplateUploadProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);
  // Initialize formData with prefill values
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    original_prompt: string;
    generated_with: string;
    category: string;
    tags: string;
    style_tips: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }>({
    title: prefillTitle || "",
    description: prefillDescription || "",
    original_prompt: prefillPrompt || "",
    generated_with: prefillGeneratedWith || "",
    category: "",
    tags: "",
    style_tips: "",
    difficulty: "intermediate",
  });

  // Use controlled open state if provided, otherwise use internal state
  const isDialogOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setInternalOpen(open);
      }
    },
    [onOpenChange]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<File | null>(null);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Vercel rejects request bodies above ~4.5MB before the route runs, so
    // keep our own limit below that: an oversized file would otherwise fail
    // with an opaque platform error instead of a readable message.
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(
        `Ukuran file maksimal ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB (gambar ini ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB). Kecilkan gambarnya lalu coba lagi.`
      );
      return;
    }

    imageInputRef.current = file;
    setHasImage(true);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    imageInputRef.current = null;
    setHasImage(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  const handleUpload = useCallback(async () => {
    const file = imageInputRef.current;
    if (!file) {
      setError("Pilih gambar terlebih dahulu");
      return;
    }

    if (isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError("Judul template wajib diisi");
        return;
      }
      if (!formData.description.trim()) {
        setError("Deskripsi wajib diisi");
        return;
      }
      if (!formData.original_prompt.trim()) {
        setError("Prompt asli wajib diisi");
        return;
      }
      if (!formData.generated_with.trim()) {
        setError("Field 'Dihasilkan dengan' wajib diisi");
        return;
      }

      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", formData.title.trim());
      fd.append("description", formData.description.trim());
      fd.append("original_prompt", formData.original_prompt.trim());
      fd.append("original_image_generated_with", formData.generated_with.trim());
      fd.append("category", formData.category.trim());
      fd.append("tags", formData.tags.trim());
      fd.append("style_tips", formData.style_tips.trim());
      fd.append("difficulty_level", formData.difficulty || "intermediate");

      const response = await fetch("/api/templates/upload", {
        method: "POST",
        body: fd,
      });

      // A platform-level failure (payload too large, function cut off) answers
      // without a JSON body, so read the text once and report the real status.
      const rawBody = await response.text();

      if (!rawBody) {
        throw new Error(
          `Gagal mengupload template (HTTP ${response.status}${
            response.statusText ? ` ${response.statusText}` : ""
          }) — server tidak mengirim pesan. Kalau ukuran gambarnya besar, ` +
            "coba perkecil dulu lalu upload lagi."
        );
      }

      let json: { success?: boolean; error?: string; data?: { id?: string } };
      try {
        json = JSON.parse(rawBody) as typeof json;
      } catch {
        throw new Error(
          `Gagal mengupload template (HTTP ${response.status}): ${rawBody.slice(0, 200)}`
        );
      }

      if (!response.ok || !json.success) {
        throw new Error(json.error || `Gagal mengupload template (status: ${response.status})`);
      }

      setUploadedId(json.data?.id ?? "");
      handleOpenChange(false);
      onUploadSuccess?.();

      // Reset form
      setFormData({
        title: "",
        description: "",
        original_prompt: "",
        generated_with: "",
        category: "",
        tags: "",
        style_tips: "",
        difficulty: "intermediate" as const,
      });
      handleRemoveImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupload template");
    } finally {
      setIsUploading(false);
    }
    // `formData` must be a dependency: without it this callback keeps the
    // values captured at the last re-render where `handleRemoveImage`
    // changed (i.e. when the image was picked), so everything typed
    // afterwards was silently posted as the stale value.
  }, [formData, isUploading, onUploadSuccess, handleRemoveImage, handleOpenChange]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-purple" />
            Upload Template Baru
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          {/* Image upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="h-4 w-4" />
              Gambar Template
            </Label>

            {previewUrl ? (
              <div className="relative aspect-[4/3] rounded-lg border overflow-hidden bg-muted">
                <Image
                  src={previewUrl!}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs hover:bg-background"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-center hover:bg-muted/80"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Klik untuk memilih gambar
                </p>
                <p className="text-xs text-muted-foreground/70">
                  PNG, JPG atau WebP (max 10MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Form fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Template</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Cyberpunk City Sunset"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang template ini"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_prompt">Prompt Asli</Label>
              <Textarea
                id="original_prompt"
                name="original_prompt"
                value={formData.original_prompt}
                onChange={(e) => setFormData({ ...formData, original_prompt: e.target.value })}
                placeholder="Prompt yang digunakan untuk menghasilkan gambar ini"
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generated_with">Dihasilkan dengan</Label>
              <Input
                id="generated_with"
                name="generated_with"
                value={formData.generated_with}
                onChange={(e) => setFormData({ ...formData, generated_with: e.target.value })}
                placeholder="Contoh: Midjourney v6, DALL-E 3, Stable Diffusion"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Contoh: landscape, portrait, anime"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Pisahkan dengan koma untuk multiple kategori
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as typeof formData.difficulty })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Contoh: cyberpunk, neon, city"
              />
              <p className="text-xs text-muted-foreground">
                Opsional: tambahkan tags untuk memudahkan pencarian
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style_tips">Tips Gaya (Optional)</Label>
              <Textarea
                id="style_tips"
                name="style_tips"
                value={formData.style_tips}
                onChange={(e) => setFormData({ ...formData, style_tips: e.target.value })}
                placeholder="Tips atau anjuran khusus untuk prompt ini"
                rows={2}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Batal
            </Button>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !hasImage}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : uploadedId ? (
                <>
                  <Check className="h-4 w-4" />
                  Selesai
                </>
              ) : (
                <>
                  <HardDrive className="h-4 w-4" />
                  Upload Template
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
