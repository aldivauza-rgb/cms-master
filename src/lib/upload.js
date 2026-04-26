import { supabase } from './supabase'

export async function uploadToStorage(source, bucket, prefix = '') {
  if (!source) return null
  if (typeof source === 'string' && !source.startsWith('blob:') && !source.startsWith('data:')) {
    return source
  }

  let blob
  if (typeof source === 'string' && source.startsWith('blob:')) {
    const res = await fetch(source)
    blob = await res.blob()
  } else if (typeof source === 'string' && source.startsWith('data:')) {
    const [header, data] = source.split(',')
    const mime = header.match(/:(.*?);/)[1]
    const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
    blob = new Blob([bytes], { type: mime })
  } else if (source instanceof File || source instanceof Blob) {
    blob = source
  } else {
    return null
  }

  const ext = blob.type.split('/')[1]?.split('+')[0] || 'jpg'
  const path = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { upsert: true })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
