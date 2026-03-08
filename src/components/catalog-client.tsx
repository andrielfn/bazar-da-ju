"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { CATEGORIES } from "@/lib/constants";
import { ItemCard } from "@/components/item-card";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  is_donation: boolean;
  status: string;
  photos: string[];
}

const typeOptions = [
  { value: "all", label: "Tudo" },
  { value: "venda", label: "Venda" },
  { value: "doacao", label: "Doação" },
];

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-border/40"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-[4/3] w-full animate-shimmer" />
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-shimmer rounded-md" />
          <div className="h-5 w-20 animate-shimmer rounded-md" />
        </div>
        <div className="h-5 w-3/4 animate-shimmer rounded-md" />
        <div className="h-4 w-full animate-shimmer rounded-md" />
        <div className="h-6 w-20 animate-shimmer rounded-md" />
        <div className="h-10 w-full animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}

export function CatalogClient({
  items,
  interestCounts,
  whatsappAdmin,
}: {
  items: Item[];
  interestCounts: Record<string, number>;
  whatsappAdmin: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [optimisticCategory, setOptimisticCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [optimisticType, setOptimisticType] = useState(
    searchParams.get("type") || "all"
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      if (key === "category") setOptimisticCategory(value);
      if (key === "type") setOptimisticType(value);

      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-4">
      {/* Filters — single row */}
      <div className="flex items-center justify-between gap-3">
        {/* Type segmented control */}
        <div className="inline-flex rounded-full bg-card p-0.5 shadow-sm ring-1 ring-border">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("type", opt.value)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                optimisticType === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <Select
          value={optimisticCategory}
          onValueChange={(val) => updateFilter("category", val as string)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items */}
      <div className="mt-8">
        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : !items.length ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-card px-8 py-20 text-center shadow-sm ring-1 ring-border/50">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <HugeiconsIcon icon={Search01Icon} size={24} className="text-muted-foreground/50" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Nenhum item encontrado
            </p>
            <p className="mt-1 max-w-[240px] text-sm text-muted-foreground">
              Tente mudar os filtros ou volte mais tarde.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={i}
                  interestCount={interestCounts[item.id] || 0}
                  whatsappAdmin={whatsappAdmin}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
