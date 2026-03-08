"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Camera01Icon,
  Chatting01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { formatPrice, whatsappUrl } from "@/lib/utils";
import { ItemCarousel } from "@/components/item-carousel";
import { ReservationDrawer } from "@/components/reservation-drawer";
import type { Category, Condition } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export function ItemCard({
  item,
  index = 0,
  interestCount = 0,
  whatsappAdmin,
}: {
  item: Item;
  index?: number;
  interestCount?: number;
  whatsappAdmin: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSold = item.status === "vendido";
  const isReserved = item.status === "reservado";
  const isAvailable = item.status === "disponivel";

  return (
    <>
      <div
        className="animate-fade-up overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-all hover:shadow-md hover:ring-border"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Photo */}
        <div className="relative">
          {item.photos?.length > 0 ? (
            <ItemCarousel photos={item.photos} title={item.title} />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
              <HugeiconsIcon icon={Camera01Icon} size={32} className="text-muted-foreground/25" />
            </div>
          )}

          {isSold && (
            <div className="absolute inset-x-0 top-0 aspect-[4/3] flex items-center justify-center rounded-xl bg-foreground/40 backdrop-blur-[2px]">
              <span className="rounded-full bg-background/90 px-3.5 py-1 text-xs font-bold tracking-wide text-foreground uppercase">
                Vendido
              </span>
            </div>
          )}

          {!isSold && interestCount > 0 && (
            <span className="absolute top-2 left-2 z-10 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm backdrop-blur-sm">
              {interestCount} interessado{interestCount !== 1 && "s"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {CATEGORIES[item.category as Category]}
            </span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {CONDITIONS[item.condition as Condition]}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 text-[0.95rem] font-bold leading-snug text-foreground">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}

          <div className="mt-3">
            {item.is_donation ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                <HugeiconsIcon icon={FavouriteIcon} size={12} />
                Doação
              </span>
            ) : (
              <span className="text-base font-extrabold text-primary">
                {formatPrice(item.price)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2.5">
            {!isSold && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
              >
                <HugeiconsIcon icon={FavouriteIcon} size={16} />
                Tenho interesse
              </button>
            )}

            {whatsappAdmin && (
              <a
                href={whatsappUrl(
                  whatsappAdmin,
                  `Olá! Vi o item "${item.title}" no Bazar da Jú e gostaria de saber mais.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80",
                  !isAvailable && "flex-1"
                )}
              >
                <HugeiconsIcon icon={Chatting01Icon} size={16} />
                Perguntar
              </a>
            )}
          </div>

          {/* Status notice */}
          {isSold && (
            <div className="mt-3 rounded-xl bg-muted px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">
              Este item já foi vendido.
            </div>
          )}
        </div>
      </div>

      <ReservationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemId={item.id}
        itemTitle={item.title}
        itemPrice={item.price}
        isDonation={item.is_donation}
      />
    </>
  );
}
