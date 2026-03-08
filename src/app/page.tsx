export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  InformationCircleIcon,
  MapPinIcon,
  CreditCardIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { createServiceClient } from "@/lib/supabase/server";
import { CatalogClient } from "@/components/catalog-client";


interface SearchParams {
  category?: string;
  type?: string;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createServiceClient();

  // Build query (only published items)
  let query = supabase.from("items").select("*").eq("published", true);

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.type === "venda") {
    query = query.eq("is_donation", false);
  } else if (params.type === "doacao") {
    query = query.eq("is_donation", true);
  }

  query = query.order("created_at", { ascending: false });

  const { data: items } = await query;

  // Count active interests per item
  const { data: activeInterests } = await supabase
    .from("reservations")
    .select("item_id")
    .eq("status", "ativa");

  const interestCounts: Record<string, number> = {};
  for (const r of activeInterests || []) {
    interestCounts[r.item_id] = (interestCounts[r.item_id] || 0) + 1;
  }

  // Available first, then reserved, then sold
  const available = items?.filter((i) => i.status === "disponivel") || [];
  const reserved = items?.filter((i) => i.status === "reservado") || [];
  const sold = items?.filter((i) => i.status === "vendido") || [];
  const orderedItems = [...available, ...reserved, ...sold];

  const whatsappAdmin = process.env.WHATSAPP_ADMIN || "";

  return (
    <div className="min-h-svh bg-background">
      {/* Compact sticky header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md ring-1 ring-border/40">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Bazar da <span className="text-primary">Jú</span>
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Desapegando antes da mudança
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sobre"
              className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:text-foreground"
            >
              <HugeiconsIcon icon={InformationCircleIcon} size={14} />
              Sobre
            </Link>
          </div>
        </div>
      </header>

      {/* Client-side catalog with filters + items */}
      <Suspense>
        <CatalogClient
          items={orderedItems}
          interestCounts={interestCounts}
          whatsappAdmin={whatsappAdmin}
        />
      </Suspense>

      {/* Informative footer */}
      <footer className="mt-16 border-t border-border bg-card/50 px-4 pt-10 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <HugeiconsIcon icon={MapPinIcon} size={16} className="text-primary" />
                Retirada
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Não fazemos entrega. Todos os itens devem ser retirados no <strong>Campeche</strong>.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <HugeiconsIcon icon={CreditCardIcon} size={16} className="text-primary" />
                Pagamento
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pagamentos via <strong>Pix</strong> no momento da retirada.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center">
            <p className="text-xs font-medium tracking-wide text-muted-foreground/50 uppercase">
              Bazar da Jú
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
