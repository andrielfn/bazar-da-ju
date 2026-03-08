"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createItem(formData: FormData) {
  const supabase = await createServiceClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const isDonation = formData.get("is_donation") === "true";
  const photos = formData.getAll("photos") as string[];

  const { error } = await supabase.from("items").insert({
    title,
    description,
    price: isDonation ? 0 : price,
    category,
    condition,
    is_donation: isDonation,
    photos,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createServiceClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const isDonation = formData.get("is_donation") === "true";
  const photos = formData.getAll("photos") as string[];

  const { error } = await supabase
    .from("items")
    .update({
      title,
      description,
      price: isDonation ? 0 : price,
      category,
      condition,
      is_donation: isDonation,
      photos,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function deleteItem(id: string) {
  const supabase = await createServiceClient();

  // Delete photos from storage
  const { data: item } = await supabase
    .from("items")
    .select("photos")
    .eq("id", id)
    .single();

  if (item?.photos?.length) {
    const paths = item.photos.map((url: string) => {
      const parts = url.split("/photos/");
      return parts[parts.length - 1];
    });
    await supabase.storage.from("photos").remove(paths);
  }

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function updateItemStatus(id: string, status: string) {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("items")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("items")
    .update({ published })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function uploadPhoto(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createServiceClient();

  const file = formData.get("file") as File;
  if (!file) return { error: "Nenhum arquivo enviado" };

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("photos")
    .getPublicUrl(fileName);

  return { url: publicUrl };
}
