'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateArtistSettings(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const artistId = formData.get('artist_id') as string
  const promptpay_number = formData.get('promptpay_number') as string
  const bank_account_name = formData.get('bank_account_name') as string
  const bank_name = formData.get('bank_name') as string
  const qrCodeFile = formData.get('qr_code_file') as File | null

  // Ensure this user actually owns this artist record
  const { data: artistCheck } = await supabase
    .from('artists')
    .select('id')
    .eq('id', artistId)
    .eq('profile_id', user.id)
    .single()

  if (!artistCheck) return { error: "Permission denied" }

  let qr_code_url = formData.get('existing_qr_url') as string

  // If a new file is uploaded
  if (qrCodeFile && qrCodeFile.size > 0) {
    const fileExt = qrCodeFile.name.split('.').pop()
    const fileName = `${artistId}_${Date.now()}.${fileExt}`
    
    // We'll reuse payment-slips bucket or a generic bucket for now
    // In a real app, you might have an 'artist-qrcodes' bucket.
    // Using payment-slips to avoid needing a new bucket setup.
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('payment-slips')
      .upload(`qrcodes/${fileName}`, qrCodeFile, { upsert: true })
      
    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { error: "Failed to upload QR Code" }
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('payment-slips')
      .getPublicUrl(`qrcodes/${fileName}`)
      
    qr_code_url = publicUrlData.publicUrl
  }

  const { error } = await supabase
    .from('artists')
    .update({
      promptpay_number,
      bank_account_name,
      bank_name,
      qr_code_url
    })
    .eq('id', artistId)

  if (error) {
    console.error("Update error:", error)
    return { error: error.message }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}
