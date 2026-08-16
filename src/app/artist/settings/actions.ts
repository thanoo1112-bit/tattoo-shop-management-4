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
  const profileImageFile = formData.get('profile_image_file') as File | null

  // Ensure this user actually owns this artist record
  const { data: artistCheck } = await supabase
    .from('artists')
    .select('id')
    .eq('id', artistId)
    .eq('profile_id', user.id)
    .single()

  if (!artistCheck) return { error: "Permission denied" }

  let qr_code_url = formData.get('existing_qr_url') as string
  let profile_image_url = formData.get('existing_profile_url') as string

  // If a new QR code file is uploaded
  if (qrCodeFile && qrCodeFile.size > 0) {
    const fileExt = qrCodeFile.name.split('.').pop()
    const fileName = `${artistId}_${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('payment-slips')
      .upload(`qrcodes/${fileName}`, qrCodeFile, { upsert: true })
      
    if (uploadError) return { error: "Failed to upload QR Code" }

    const { data: publicUrlData } = supabase.storage.from('payment-slips').getPublicUrl(`qrcodes/${fileName}`)
    qr_code_url = publicUrlData.publicUrl
  }

  // If a new profile image is uploaded
  if (profileImageFile && profileImageFile.size > 0) {
    const fileExt = profileImageFile.name.split('.').pop()
    const fileName = `${artistId}_profile_${Date.now()}.${fileExt}`
    
    // Use portfolio-images bucket for profile pictures as it's public and meant for images
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('portfolio-images')
      .upload(`profiles/${fileName}`, profileImageFile, { upsert: true })
      
    if (uploadError) return { error: "Failed to upload Profile Image" }

    const { data: publicUrlData } = supabase.storage.from('portfolio-images').getPublicUrl(`profiles/${fileName}`)
    profile_image_url = publicUrlData.publicUrl
  }

  const { error } = await supabase
    .from('artists')
    .update({
      promptpay_number,
      bank_account_name,
      bank_name,
      qr_code_url,
      profile_image_url
    })
    .eq('id', artistId)

  if (error) {
    console.error("Update error:", error)
    return { error: error.message }
  }

  revalidatePath('/artist/settings')
  return { success: true }
}
