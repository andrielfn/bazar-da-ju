"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MAX_RESERVATIONS_PER_PHONE } from "@/lib/constants";

export async function createReservation(formData: FormData) {
  const supabase = await createServiceClient();

  const itemId = formData.get("item_id") as string;
  const name = formData.get("name") as string;
  const whatsapp = (formData.get("whatsapp") as string).replace(/\D/g, "");

  // Check if item exists and is not sold
  const { data: item } = await supabase
    .from("items")
    .select("status")
    .eq("id", itemId)
    .single();

  if (!item || item.status === "vendido") {
    return { error: "Este item não está mais disponível" };
  }

  // Check reservation limit per phone
  const { count } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("whatsapp", whatsapp)
    .eq("status", "ativa");

  if (count && count >= MAX_RESERVATIONS_PER_PHONE) {
    return { error: `Você já demonstrou interesse em ${MAX_RESERVATIONS_PER_PHONE} itens. Aguarde ou cancele um para continuar.` };
  }

  // Create interest record
  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({ item_id: itemId, name, whatsapp })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/item/${itemId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/reservations");

  return { success: true, reservation };
}

export async function cancelReservation(reservationId: string) {
  const supabase = await createServiceClient();

  const { data: reservation } = await supabase
    .from("reservations")
    .select("item_id")
    .eq("id", reservationId)
    .single();

  if (!reservation) {
    return { error: "Reserva não encontrada" };
  }

  await supabase
    .from("reservations")
    .update({ status: "cancelada" })
    .eq("id", reservationId);

  // If no active interests remain, reset item to available
  const { count } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("item_id", reservation.item_id)
    .eq("status", "ativa");

  if (!count || count === 0) {
    await supabase
      .from("items")
      .update({ status: "disponivel" })
      .eq("id", reservation.item_id)
      .neq("status", "vendido");
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/reservations");
}

export async function completeReservation(reservationId: string) {
  const supabase = await createServiceClient();

  const { data: reservation } = await supabase
    .from("reservations")
    .select("item_id")
    .eq("id", reservationId)
    .single();

  if (!reservation) {
    return { error: "Reserva não encontrada" };
  }

  await supabase
    .from("reservations")
    .update({ status: "concluida" })
    .eq("id", reservationId);

  await supabase
    .from("items")
    .update({ status: "vendido" })
    .eq("id", reservation.item_id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/reservations");
}
