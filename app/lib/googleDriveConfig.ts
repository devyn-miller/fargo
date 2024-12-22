import { google } from 'googleapis';

// Initialize the Google Drive API client
const auth = new google.auth.GoogleAuth({
  credentials: {
    // Your service account credentials will be loaded from environment variables
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
  ],
});

// Create a Google Drive client
export const drive = google.drive({ version: 'v3', auth });

// Root folder ID where all content will be stored
export const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Mime types for different file categories
export const MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  MP4: 'video/mp4',
  TEXT: 'text/plain',
} as const;

// File extensions we support
export const SUPPORTED_EXTENSIONS = {
  IMAGES: ['.jpg', '.jpeg', '.png'],
  VIDEOS: ['.mp4', '.mov'],
  DOCUMENTS: ['.txt', '.md'],
} as const;
