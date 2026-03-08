"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArrowLeft01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { createReservation, cancelReservation } from "@/lib/actions/reservations";
import { formatPrice } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";

interface ReservationDrawerProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  isDonation: boolean;
}

type Step = "form" | "confirmation";

export function ReservationDrawer({
  open,
  onClose,
  itemId,
  itemTitle,
  itemPrice,
  isDonation,
}: ReservationDrawerProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);

  const storageKey = `reservation:${itemId}`;
  const alreadyReserved = typeof window !== "undefined" && localStorage.getItem(storageKey) === "true";

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("item_id", itemId);
    formData.set("name", name);
    formData.set("whatsapp", whatsapp);

    const result = await createReservation(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setReservation(result.reservation);
    localStorage.setItem(storageKey, "true");
    setStep("confirmation");
    setLoading(false);
  }

  async function handleCancel() {
    if (!reservation) return;
    await cancelReservation(reservation.id);
    localStorage.removeItem(storageKey);
    handleClose();
  }

  function handleClose() {
    setStep("form");
    setName("");
    setWhatsapp("");
    setError(null);
    setReservation(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && step === "form") handleClose();
      }}
    >
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" />

      <div className="animate-gentle-scale relative w-full max-w-md rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl">
        {alreadyReserved && step === "form" ? (
          <>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                Interesse já registrado
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Você já demonstrou interesse neste item. Entraremos em contato pelo WhatsApp.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Voltar ao catálogo
            </button>
          </>
        ) : step === "form" ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                Tenho interesse
              </h3>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/8 to-primary/4 p-4 ring-1 ring-primary/10">
              <p className="text-sm font-semibold text-foreground">{itemTitle}</p>
              <p className="mt-0.5 text-base font-extrabold text-primary">
                {isDonation ? "Doação" : formatPrice(itemPrice)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reserve-name">Seu nome</Label>
                <Input
                  id="reserve-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como quer ser chamado(a)"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserve-whatsapp">WhatsApp</Label>
                <PhoneInput
                  id="reserve-whatsapp"
                  value={whatsapp}
                  onChange={setWhatsapp}
                />
                <p className="text-xs text-muted-foreground">
                  Para entrarmos em contato com você.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 cursor-pointer rounded-xl bg-muted py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || whatsapp.replace(/\D/g, "").length < 10}
                  className="flex-1 cursor-pointer rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>

              <p className="pt-1 text-center text-[11px] text-muted-foreground/50">
                Entraremos em contato pelo WhatsApp.
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                Interesse registrado
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Entraremos em contato pelo WhatsApp.
              </p>
            </div>

            <div className="mt-6 divide-y divide-border rounded-2xl bg-muted p-1">
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Item</span>
                <span className="text-sm font-semibold text-foreground">{itemTitle}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Valor</span>
                <span className="text-sm font-bold text-primary">
                  {isDonation ? "Doação" : formatPrice(itemPrice)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Nome</span>
                <span className="text-sm font-semibold text-foreground">{name}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleClose}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Voltar ao catálogo
              </button>
              <button
                onClick={handleCancel}
                className="w-full cursor-pointer py-2 text-center text-xs text-muted-foreground/50 underline transition-colors hover:text-destructive"
              >
                Cancelar interesse
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
