import { supabase } from './supabase';

export async function createEvent(event: {
  title: string;
  description?: string;
  date: Date;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}