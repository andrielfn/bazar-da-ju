"use client";

import { useRouter } from "next/navigation";
import { deleteItem, togglePublished } from "@/lib/actions/items";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";

export function ItemActions({
  id,
  title,
  published,
}: {
  id: string;
  title: string;
  published: boolean;
}) {
  const router = useRouter();

  async function handleDelete() {
    await deleteItem(id);
    router.refresh();
  }

  async function handleTogglePublished() {
    await togglePublished(id, !published);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        onClick={handleTogglePublished}
        className={`inline-flex h-8 cursor-pointer items-center rounded-lg px-3 text-xs font-semibold transition-colors ${
          published
            ? "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
            : "bg-accent/10 text-accent hover:bg-accent/20"
        }`}
      >
        {published ? "Ocultar" : "Publicar"}
      </button>

      <button
        onClick={() => router.push(`/admin/dashboard/${id}/edit`)}
        className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-muted px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        Editar
      </button>

      <AlertDialog>
        <AlertDialogTrigger className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-muted px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10">
          Excluir
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Excluir item</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>&quot;{title}&quot;</strong>? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogClose className="cursor-pointer rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary">
              Cancelar
            </AlertDialogClose>
            <AlertDialogClose
              className="cursor-pointer rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
