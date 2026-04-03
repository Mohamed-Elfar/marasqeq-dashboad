import { supabase } from './supabase'

// Properties
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('visible', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const getProperty = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createProperty = async (property) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()

  if (error) throw error
  return data[0]
}

export const updateProperty = async (id, property) => {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Categories
export const getCategories = async (type = null, includeHidden = false) => {
  let query = supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (!includeHidden) {
    query = query.eq('visible', true)
  }

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createCategory = async (category) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()

  if (error) throw error
  return data[0]
}

export const updateCategory = async (id, category) => {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// News
export const getNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('visible', true)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) throw error
  return data
}

export const createNews = async (news) => {
  const { data, error } = await supabase
    .from('news')
    .insert([news])
    .select()

  if (error) throw error
  return data[0]
}

export const updateNews = async (id, news) => {
  const { data, error } = await supabase
    .from('news')
    .update(news)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteNews = async (id) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*, categories(name)')
    .eq('visible', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const createService = async (service) => {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()

  if (error) throw error
  return data[0]
}

export const updateService = async (id, service) => {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteService = async (id) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Portfolio
export const getPortfolio = async () => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('visible', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const createPortfolio = async (portfolio) => {
  const { data, error } = await supabase
    .from('portfolio')
    .insert([portfolio])
    .select()

  if (error) throw error
  return data[0]
}

export const updatePortfolio = async (id, portfolio) => {
  const { data, error } = await supabase
    .from('portfolio')
    .update(portfolio)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deletePortfolio = async (id) => {
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Contact Messages
export const getContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createContactMessage = async (message) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([message])
    .select()

  if (error) throw error
  return data[0]
}

export const updateContactMessage = async (id, message) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update(message)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

// Form Options
export const getFormOptions = async (type, includeInactive = false) => {
  let query = supabase
    .from('form_options')
    .select('*')
    .eq('type', type)
    .order('order_index', { ascending: true })

  // Only filter active if not requesting all items
  if (!includeInactive) {
    query = query.eq('active', true)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createFormOption = async (option) => {
  const { data, error } = await supabase
    .from('form_options')
    .insert([option])
    .select()

  if (error) throw error
  return data[0]
}

export const updateFormOption = async (id, option) => {
  const { data, error } = await supabase
    .from('form_options')
    .update(option)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteFormOption = async (id) => {
  const { error } = await supabase
    .from('form_options')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Contact Info
export const getContactInfo = async (type = null) => {
  let query = supabase
    .from('contact_info')
    .select('*')
    .eq('visible', true)
    .order('order_index', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createContactInfo = async (info) => {
  const { data, error } = await supabase
    .from('contact_info')
    .insert([info])
    .select()

  if (error) throw error
  return data[0]
}

export const updateContactInfo = async (id, info) => {
  const { data, error } = await supabase
    .from('contact_info')
    .update(info)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteContactInfo = async (id) => {
  const { error } = await supabase
    .from('contact_info')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Social Links
export const getSocialLinks = async () => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('active', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const createSocialLink = async (link) => {
  const { data, error } = await supabase
    .from('social_links')
    .insert([link])
    .select()

  if (error) throw error
  return data[0]
}

export const updateSocialLink = async (id, link) => {
  const { data, error } = await supabase
    .from('social_links')
    .update(link)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export const deleteSocialLink = async (id) => {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Pages
export const getPages = async () => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('visible', true)
    .order('slug', { ascending: true })

  if (error) throw error
  return data
}

export const getPage = async (slug) => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export const createPage = async (page) => {
  const { data, error } = await supabase
    .from('pages')
    .insert([page])
    .select()

  if (error) throw error
  return data[0]
}

export const updatePage = async (slug, page) => {
  const { data, error } = await supabase
    .from('pages')
    .update(page)
    .eq('slug', slug)
    .select()

  if (error) throw error
  return data[0]
}

// Real-time subscriptions
export const subscribeToTable = (table, callback) => {
  return supabase
    .channel(`table-changes-${table}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe()
}
