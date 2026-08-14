'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAppointmentStatus(appointmentId: string, newStatus: string) {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role || "artist";

  if (role === "artist") {
    // Manually verify ownership instead of relying purely on RLS
    const { data: artistRecord } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!artistRecord) return { error: "Artist profile not linked" }

    // Fetch the appointment to check ownership
    const { data: appt } = await supabase
      .from("appointments")
      .select("artist_id")
      .eq("id", appointmentId)
      .single()

    if (!appt || appt.artist_id !== artistRecord.id) {
      return { error: "Forbidden: You do not own this appointment" }
    }
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status: newStatus })
    .eq('id', appointmentId)

  if (error) {
    console.error("Failed to update status", error)
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/artist/dashboard')
  revalidatePath('/admin/appointments')
  revalidatePath('/artist/appointments')
  return { success: true }
}
