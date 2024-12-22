import { google } from 'googleapis';
import { drive, ROOT_FOLDER_ID, MIME_TYPES } from './googleDriveConfig';

interface FileMetadata {
  [key: string]: any;
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Upload a file to Google Drive
 */
export async function uploadFileToDrive(file: File, metadata: FileMetadata) {
  try {
    const buffer = await file.arrayBuffer();
    const media = {
      mimeType: file.type || 'application/octet-stream',
      body: Buffer.from(buffer),
    };

    const fileMetadata = {
      name: file.name,
      parents: [ROOT_FOLDER_ID],
      description: JSON.stringify(metadata),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webContentLink, webViewLink, description',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Refresh the file to get the updated links
    const file = await drive.files.get({
      fileId: response.data.id!,
      fields: 'id, name, webContentLink, webViewLink, description',
    });

    return file.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * List files in a specific folder
 */
export async function listFilesInFolder(folderId = ROOT_FOLDER_ID) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, webContentLink, webViewLink, description)',
      pageSize: 1000,
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(fileId: string, metadata: FileMetadata) {
  try {
    const response = await drive.files.update({
      fileId,
      requestBody: {
        description: JSON.stringify(metadata),
      },
      fields: 'id, name, webContentLink, webViewLink, description',
    });

    return response.data;
  } catch (error) {
    console.error('Error updating file metadata:', error);
    throw error;
  }
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string) {
  try {
    await drive.files.delete({
      fileId,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Search files by query
 */
export async function searchFiles(query: string) {
  try {
    const response = await drive.files.list({
      q: `fullText contains '${query}' and '${ROOT_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, webContentLink, webViewLink, description)',
      pageSize: 1000,
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
}

/**
 * Get file by ID
 */
export async function getFile(fileId: string) {
  try {
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webContentLink, webViewLink, description',
    });

    return response.data;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}
