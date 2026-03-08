export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin-shell";
import { ItemForm } from "@/components/item-form";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) {
    notFound();
  }

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
          Editar item
        </h1>
      </div>
      <div className="max-w-2xl">
        <ItemForm item={item} />
      </div>
    </AdminShell>
  );
}
