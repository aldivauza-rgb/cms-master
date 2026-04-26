import { supabase } from './supabase'

// ─── AUTH ────────────────────────────────────────────────────
export const authApi = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase
      .from('cms_profiles').select('*').eq('id', user.id).single()
    if (error) return null
    return { ...data, email: user.email }
  },
  async updateProfile({ name, foto_url }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const payload = {}
    if (name     !== undefined) payload.name     = name
    if (foto_url !== undefined) payload.foto_url = foto_url
    const { data, error } = await supabase
      .from('cms_profiles').update(payload).eq('id', user.id).select().single()
    if (error) throw error
    return data
  },
  async uploadAvatar(file) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`
    const { error } = await supabase.storage.from('profil').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('profil').getPublicUrl(path)
    return data.publicUrl
  },
}

// ─── STORAGE HELPER ─────────────────────────────────────────
export async function uploadFile(bucket, file, path) {
  const ext = file.name.split('.').pop()
  const filePath = path || `${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export async function deleteFile(bucket, url) {
  const path = url.split(`/storage/v1/object/public/${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}

// ─── SLIDES ─────────────────────────────────────────────────
export const slidesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('slides').select('*').order('order')
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase
      .from('slides').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase
      .from('slides').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('slides').delete().eq('id', id)
    if (error) throw error
  },
  async reorder(ids) {
    const updates = ids.map((id, i) => supabase.from('slides').update({ order: i }).eq('id', id))
    await Promise.all(updates)
  },
}

// ─── BERITA ─────────────────────────────────────────────────
export const beritaApi = {
  async getAll({ search = '', kategori = '', status = '' } = {}) {
    let q = supabase.from('berita').select('*, berita_kategori(name)').order('created_at', { ascending: false })
    if (search)   q = q.ilike('title', `%${search}%`)
    if (kategori) q = q.eq('kategori_id', kategori)
    if (status)   q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase
      .from('berita').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase
      .from('berita').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('berita').delete().eq('id', id)
    if (error) throw error
  },
}

export const beritaKategoriApi = {
  async getAll() {
    const { data, error } = await supabase.from('berita_kategori').select('*').order('name')
    if (error) throw error
    return data
  },
  async create(name) {
    const { data, error } = await supabase.from('berita_kategori').insert({ name }).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('berita_kategori').delete().eq('id', id)
    if (error) throw error
  },
}

// ─── AGENDA ─────────────────────────────────────────────────
export const agendaApi = {
  async getAll({ search = '', status = '' } = {}) {
    let q = supabase.from('agenda').select('*').order('tanggal', { ascending: false })
    if (search) q = q.ilike('title', `%${search}%`)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('agenda').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('agenda').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('agenda').delete().eq('id', id)
    if (error) throw error
  },
}

// ─── DOKUMEN ─────────────────────────────────────────────────
export const dokumenApi = {
  async getAll({ search = '', status = '' } = {}) {
    let q = supabase.from('dokumen').select('*').order('created_at', { ascending: false })
    if (search) q = q.ilike('title', `%${search}%`)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('dokumen').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('dokumen').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('dokumen').delete().eq('id', id)
    if (error) throw error
  },
}

// ─── MAJALAH ────────────────────────────────────────────────
export const majalahApi = {
  async getAll({ search = '', status = '' } = {}) {
    let q = supabase.from('majalah').select('*').order('created_at', { ascending: false })
    if (search) q = q.ilike('title', `%${search}%`)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('majalah').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('majalah').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('majalah').delete().eq('id', id)
    if (error) throw error
  },
}

// ─── FASILITAS ───────────────────────────────────────────────
export const fasilitasApi = {
  async getAll({ search = '', status = '' } = {}) {
    let q = supabase
      .from('fasilitas')
      .select('*, fasilitas_gallery(*)')
      .order('created_at', { ascending: false })
    if (search) q = q.ilike('title', `%${search}%`)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('fasilitas').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('fasilitas').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('fasilitas').delete().eq('id', id)
    if (error) throw error
  },
  async setGallery(fasilitasId, images) {
    // images: [{ image_url, order, is_cover }]
    await supabase.from('fasilitas_gallery').delete().eq('fasilitas_id', fasilitasId)
    if (images.length === 0) return []
    const rows = images.map((img, i) => ({ ...img, fasilitas_id: fasilitasId, order: i }))
    const { data, error } = await supabase.from('fasilitas_gallery').insert(rows).select()
    if (error) throw error
    return data
  },
}

// ─── PROFIL PAGES ────────────────────────────────────────────
export const profilApi = {
  async get(pageKey) {
    const { data, error } = await supabase
      .from('profil_pages').select('*').eq('page_key', pageKey).single()
    if (error) throw error
    return data
  },
  async save(pageKey, blocks) {
    const { data, error } = await supabase
      .from('profil_pages')
      .update({ blocks, updated_at: new Date().toISOString() })
      .eq('page_key', pageKey)
      .select().single()
    if (error) throw error
    return data
  },
}

// ─── GURU & STAFF ────────────────────────────────────────────
export const guruStafApi = {
  async getAll({ search = '', status = '' } = {}) {
    let q = supabase.from('guru_staf').select('*').order('created_at', { ascending: false })
    if (search) q = q.ilike('nama', `%${search}%`)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('guru_staf').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('guru_staf').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('guru_staf').delete().eq('id', id)
    if (error) throw error
  },
}

// ─── AKUN ────────────────────────────────────────────────────
export const akunApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('akun').select('id,name,username,password,role,is_active,created_at').order('created_at')
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from('akun').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, payload) {
    const { data, error } = await supabase.from('akun').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('akun').delete().eq('id', id)
    if (error) throw error
  },
  async findByUsername(username) {
    const { data, error } = await supabase
      .from('akun').select('*').eq('username', username).single()
    if (error) return null
    return data
  },
}
