import { supabase } from './supabase'

export async function getFormOptions(type, includeInactive = false) {
  let query = supabase
    .from('form_options')
    .select('*')
    .eq('type', type)
    .order('order_index', { ascending: true })

  if (!includeInactive) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data || []
}

export async function createFormOption(option) {
  const { data, error } = await supabase
    .from('form_options')
    .insert([option])
    .select()

  if (error) {
    throw error
  }

  return data?.[0]
}

export async function updateFormOption(id, option) {
  const { data, error } = await supabase
    .from('form_options')
    .update(option)
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  return data?.[0]
}

export async function deleteFormOption(id) {
  const { error } = await supabase
    .from('form_options')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return { success: true }
}
