"use client";

import { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Camera01Icon, Cancel01Icon, Loading01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { uploadPhoto } from "@/lib/actions/items";
import { MAX_PHOTOS } from "@/lib/constants";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/webp" }));
          } else {
            resolve(file);
          }
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);

    const newUrls: string[] = [];
    for (const file of toUpload) {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.set("file", compressed);

      const result = await uploadPhoto(formData);
      if (result.url) {
        newUrls.push(result.url);
      }
    }

    onChange([...photos, ...newUrls]);
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {photos.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl bg-secondary"
          >
            <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                Capa
              </span>
            )}
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            {uploading ? (
              <HugeiconsIcon icon={Loading01Icon} size={20} className="animate-spin text-muted-foreground" />
            ) : (
              <>
                <HugeiconsIcon icon={Camera01Icon} size={20} className="text-muted-foreground/40" />
                <span className="mt-1 text-[10px] text-muted-foreground">Adicionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {photos.length}/{MAX_PHOTOS} fotos. A primeira foto sera a capa.
      </p>
    </div>
  );
}
