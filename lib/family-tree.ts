import { supabase } from './supabase';

export async function addFamilyMember(member: {
  name: string;
  bio?: string;
  photo_url?: string;
  birth_date?: Date;
  parent_ids?: string[];
}) {
  const { data, error } = await supabase
    .from('family_members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFamilyMembers() {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}