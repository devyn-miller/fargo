import { supabase } from './supabase';

export async function uploadPhoto(file: File, username: string, albumId?: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('photos')
    .upload(filePath, file);

  if (error) throw error;

  const { data: photo } = await supabase.from('photos').insert({
    url: data.path,
    created_by: username,
    album_id: albumId,
  }).select().single();

  return photo;
}

export async function getPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPhotosByAlbum(albumId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}