export const dynamic = "force-dynamic";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Package01Icon, Camera01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin-shell";
import { CATEGORIES, CONDITIONS, ITEM_STATUS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { ItemActions } from "./item-actions";

export default async function DashboardPage() {
  const supabase = await createServiceClient();
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Itens</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {items?.length || 0} {items?.length === 1 ? "item cadastrado" : "itens cadastrados"}
          </p>
        </div>
        <Link
          href="/admin/dashboard/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Novo item
        </Link>
      </div>

      {!items?.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-card py-20 shadow-sm ring-1 ring-border/50">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <HugeiconsIcon icon={Package01Icon} size={24} className="text-muted-foreground/40" />
          </div>
          <p className="text-base font-semibold text-foreground">
            Nenhum item cadastrado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece adicionando o primeiro item do bazar.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md hover:ring-border"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                {item.photos?.length > 0 ? (
                  <img
                    src={item.photos[0]}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <HugeiconsIcon icon={Camera01Icon} size={20} className="text-muted-foreground/25" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <StatusBadge status={item.status} />
                  {!item.published && (
                    <span className="inline-flex shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground ring-1 ring-border">
                      Rascunho
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{CATEGORIES[item.category as keyof typeof CATEGORIES]}</span>
                  <span className="text-border">·</span>
                  <span>{CONDITIONS[item.condition as keyof typeof CONDITIONS]}</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-sm font-extrabold text-primary">
                  {item.is_donation ? "Doação" : formatPrice(item.price)}
                </span>
              </div>

              <div className="flex w-full items-center justify-end gap-1.5 border-t border-border/50 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <ItemActions id={item.id} title={item.title} published={item.published} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    disponivel: "bg-accent/10 text-accent ring-accent/20",
    reservado: "bg-primary/10 text-primary ring-primary/20",
    vendido: "bg-muted text-muted-foreground ring-border",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${styles[status] || styles.disponivel}`}
    >
      {ITEM_STATUS[status as keyof typeof ITEM_STATUS]}
    </span>
  );
}
