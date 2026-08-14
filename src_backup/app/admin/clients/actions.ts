"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getClients() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }

  return clients;
}

export async function getClientAppointments(email: string) {
  const supabase = await createClient();
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*, artists(name)")
    .eq("guest_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }

  return appointments;
}

export async function updateClientMedicalInfo(id: string, medicalHistory: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({ medical_history: medicalHistory, notes: notes })
    .eq("id", id);

  if (error) {
    console.error("Error updating client info:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}
