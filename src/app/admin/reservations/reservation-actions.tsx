"use client";

import { useRouter } from "next/navigation";
import { cancelReservation, completeReservation } from "@/lib/actions/reservations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";

export function ReservationActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleComplete() {
    await completeReservation(id);
    router.refresh();
  }

  async function handleCancel() {
    await cancelReservation(id);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-accent/10 px-3 text-xs font-semibold text-accent transition-colors hover:bg-accent/20">
          Vendido
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmar venda</AlertDialogTitle>
          <AlertDialogDescription>
            Marcar como vendido para <strong>{name}</strong>? O item será removido do catálogo.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogClose className="cursor-pointer rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary">
              Cancelar
            </AlertDialogClose>
            <AlertDialogClose
              className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
              onClick={handleComplete}
            >
              Confirmar venda
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-muted px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          Remover
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Remover interesse</AlertDialogTitle>
          <AlertDialogDescription>
            Remover o interesse de <strong>{name}</strong>? Essa pessoa será retirada da fila.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogClose className="cursor-pointer rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary">
              Voltar
            </AlertDialogClose>
            <AlertDialogClose
              className="cursor-pointer rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
              onClick={handleCancel}
            >
              Remover
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
