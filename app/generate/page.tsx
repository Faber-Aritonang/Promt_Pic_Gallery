"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { ImageGenerator } from "@/components/customize/ImageGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function GeneratePage() {
  const t = useTranslations();
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToServer = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error || "Upload failed");
    }

    return json.data.url as string;
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const url = await uploadToServer(file);
      setReferenceImage(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [uploadToServer]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const removeReferenceImage = useCallback(() => {
    setReferenceImage(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <ShellLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("imageGen.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("imageGen.subtitle")}
          </p>
        </div>

        {/* Prompt input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">
              {t("template.prompt")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("chat.inputPlaceholder")}
              rows={4}
              className="w-full rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t("imageGen.noPrompt")}
            </p>
          </CardContent>
        </Card>

        {/* Reference Image Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Reference Image (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!referenceImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">
                      Drop an image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP up to 10MB — Use as style reference for generation
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg border">
                  <div className="relative aspect-[16/9] w-full bg-muted">
                    <Image
                      src={referenceImage}
                      alt="Reference image"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeReferenceImage}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reference image uploaded — the model will use this as visual guidance
                </p>
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-xs text-destructive">{uploadError}</p>
            )}
          </CardContent>
        </Card>

        {/* Image Generator */}
        <ImageGenerator
          prompt={prompt}
          referenceImageUrl={referenceImage ?? undefined}
        />

        {/* Quick link to Chat */}
        <Card className="mt-6">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{t("nav.chat")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("chat.subtitle")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/chat">
                {t("home.startChat")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ShellLayout>
  );
}
