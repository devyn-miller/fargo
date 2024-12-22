import { supabase } from './supabase';

export async function createMemory(content: string, username: string) {
  const { data, error } = await supabase
    .from('memories')
    .insert({ content, created_by: username })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMemories() {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}