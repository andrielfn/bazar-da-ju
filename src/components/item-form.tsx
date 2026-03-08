"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createItem, updateItem } from "@/lib/actions/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { PhotoUpload } from "@/components/photo-upload";

interface ItemFormProps {
  item?: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    is_donation: boolean;
    photos: string[];
  };
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>(item?.photos || []);
  const [isDonation, setIsDonation] = useState(item?.is_donation || false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    // Append photos as individual form values
    photos.forEach((url) => formData.append("photos", url));
    formData.set("is_donation", isDonation ? "true" : "false");

    const result = item
      ? await updateItem(item.id, formData)
      : await createItem(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/50 sm:p-8">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* Photos */}
      <div className="space-y-2">
        <Label>Fotos</Label>
        <PhotoUpload photos={photos} onChange={setPhotos} />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={item?.title}
          placeholder="Ex: Mesa de jantar 6 lugares"
          className="h-10"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={item?.description}
          placeholder="Descreva o item: dimensões, estado, detalhes relevantes..."
          rows={3}
        />
      </div>

      {/* Category + Condition row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select name="category" defaultValue={item?.category || "outros"}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Condição</Label>
          <Select name="condition" defaultValue={item?.condition || "bom_estado"}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONDITIONS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Donation toggle + Price */}
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isDonation}
            onChange={(e) => setIsDonation(e.target.checked)}
            className="h-4 w-4 rounded accent-amber-600"
          />
          <span className="text-sm font-medium">Este item é uma doação</span>
        </label>

        {!isDonation && (
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required={!isDonation}
              defaultValue={item?.price || ""}
              placeholder="0,00"
              className="h-10"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-xl px-6 font-bold shadow-sm"
          size="lg"
        >
          {loading ? "Salvando..." : item ? "Salvar alterações" : "Cadastrar item"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer"
          onClick={() => router.push("/admin/dashboard")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
