import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getPhotos } from './photos';
import { getMemories } from './memories';
import { getEvents } from './events';

export async function exportData() {
  const zip = new JSZip();

  // Export photos
  const photos = await getPhotos();
  zip.file('photos.json', JSON.stringify(photos, null, 2));

  // Export memories
  const memories = await getMemories();
  zip.file('memories.json', JSON.stringify(memories, null, 2));

  // Export events
  const events = await getEvents();
  zip.file('events.json', JSON.stringify(events, null, 2));

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'family-memories-export.zip');
}