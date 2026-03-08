export const dynamic = "force-dynamic";

import { HugeiconsIcon } from "@hugeicons/react";
import { ClipboardIcon, Chatting01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin-shell";
import { RESERVATION_STATUS } from "@/lib/constants";
import { formatPhone, formatPrice, whatsappUrl } from "@/lib/utils";
import { ReservationActions } from "./reservation-actions";
import { cn } from "@/lib/utils";

export default async function ReservationsPage() {
  const supabase = await createServiceClient();

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*, items:item_id(id, title, price, is_donation)")
    .order("reserved_at", { ascending: true });

  const active = reservations?.filter((r) => r.status === "ativa") || [];
  const completed = reservations?.filter((r) => r.status === "concluida") || [];
  const cancelled = reservations?.filter((r) => r.status === "cancelada") || [];

  // Group active interests by item
  const activeByItem = new Map<string, typeof active>();
  for (const r of active) {
    const itemId = r.items?.id || r.item_id;
    if (!activeByItem.has(itemId)) activeByItem.set(itemId, []);
    activeByItem.get(itemId)!.push(r);
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">Interesses</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {active.length} pendente{active.length !== 1 && "s"} em {activeByItem.size} ite{activeByItem.size !== 1 ? "ns" : "m"}
        </p>
      </div>

      {!reservations?.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-card py-20 shadow-sm ring-1 ring-border/50">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <HugeiconsIcon icon={ClipboardIcon} size={24} className="text-muted-foreground/40" />
          </div>
          <p className="text-base font-semibold text-foreground">
            Nenhum interesse ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os interesses aparecerão aqui quando visitantes clicarem &quot;Tenho interesse&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Active interests grouped by item */}
          {activeByItem.size > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <StatusDot status="ativa" />
                {RESERVATION_STATUS.ativa}
                <span className="font-medium text-muted-foreground/50">({active.length})</span>
              </h2>

              <div className="space-y-5">
                {Array.from(activeByItem.entries()).map(([itemId, interests]) => (
                  <div key={itemId} className="rounded-2xl bg-card shadow-sm ring-1 ring-border/50">
                    {/* Item header */}
                    <div className="border-b border-border/50 px-5 py-3.5">
                      <p className="text-sm font-bold text-foreground">
                        {interests[0].items?.title || "Item removido"}
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {interests[0].items?.is_donation
                          ? "Doação"
                          : formatPrice(interests[0].items?.price || 0)}
                      </p>
                    </div>

                    {/* Interest queue */}
                    <div className="divide-y divide-border/30">
                      {interests.map((reservation, i) => (
                        <div
                          key={reservation.id}
                          className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                        >
                          {/* Position badge */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              i === 0
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}>
                              {i + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-foreground">
                                {reservation.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatPhone(reservation.whatsapp)}
                                {" · "}
                                {new Date(reservation.reserved_at).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 pl-10 sm:pl-0">
                            <a
                              href={whatsappUrl(
                                reservation.whatsapp,
                                `Olá ${reservation.name}! Sobre o item "${reservation.items?.title}" no Bazar da Jú`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-2 rounded-lg bg-muted px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                            >
                              <HugeiconsIcon icon={Chatting01Icon} size={14} />
                              WhatsApp
                            </a>
                            <ReservationActions id={reservation.id} name={reservation.name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <StatusDot status="concluida" />
                {RESERVATION_STATUS.concluida}
                <span className="font-medium text-muted-foreground/50">({completed.length})</span>
              </h2>
              <div className="space-y-2">
                {completed.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/50 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {reservation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPhone(reservation.whatsapp)}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Item:{" "}
                        <span className="font-semibold text-foreground">
                          {reservation.items?.title || "Item removido"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <StatusDot status="cancelada" />
                {RESERVATION_STATUS.cancelada}
                <span className="font-medium text-muted-foreground/50">({cancelled.length})</span>
              </h2>
              <div className="space-y-2">
                {cancelled.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/50 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {reservation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPhone(reservation.whatsapp)}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Item:{" "}
                        <span className="font-semibold text-foreground">
                          {reservation.items?.title || "Item removido"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ativa: "bg-accent",
    concluida: "bg-primary",
    cancelada: "bg-destructive/60",
  };

  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        colors[status] || colors.ativa
      )}
    />
  );
}
