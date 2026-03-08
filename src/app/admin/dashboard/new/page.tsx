import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { AdminShell } from "@/components/admin-shell";
import { ItemForm } from "@/components/item-form";

export default function NewItemPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          Voltar
        </Link>
        <h1 className="mt-2 text-lg font-bold tracking-tight text-foreground">
          Novo item
        </h1>
      </div>
      <div className="max-w-2xl">
        <ItemForm />
      </div>
    </AdminShell>
  );
}
