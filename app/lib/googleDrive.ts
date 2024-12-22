import { google } from 'googleapis';

interface FileMetadata {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  location?: string;
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export const uploadFileToDrive = async (
  file: Express.Multer.File | File,
  metadata: FileMetadata,
  folderId: string = process.env.GOOGLE_DRIVE_FOLDER_ID!
) => {
  const fileMetadata = {
    name: 'originalname' in file ? file.originalname : file.name,
    parents: [folderId],
    description: JSON.stringify(metadata), // Store metadata in description field
  };

  const media = {
    mimeType: 'mimetype' in file ? file.mimetype : file.type,
    body: 'stream' in file ? file.stream : file,
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, description, webViewLink, webContentLink, mimeType, createdTime',
    });

    return {
      ...response.data,
      metadata: metadata,
    };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

export const listFilesInFolder = async (
  folderId: string = process.env.GOOGLE_DRIVE_FOLDER_ID!,
  fileType?: 'image' | 'video'
) => {
  try {
    let query = `'${folderId}' in parents and trashed=false`;
    if (fileType === 'image') {
      query += " and mimeType contains 'image/'";
    } else if (fileType === 'video') {
      query += " and mimeType contains 'video/'";
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, description, webViewLink, webContentLink, mimeType, createdTime)',
      orderBy: 'createdTime desc',
    });

    return response.data.files?.map(file => ({
      ...file,
      metadata: file.description ? JSON.parse(file.description) : {},
    }));
  } catch (error) {
    console.error('Error listing files in Google Drive:', error);
    throw error;
  }
};

export const searchFiles = async (
  query: string,
  folderId: string = process.env.GOOGLE_DRIVE_FOLDER_ID!
) => {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (fullText contains '${query}' or name contains '${query}') and trashed=false`,
      fields: 'files(id, name, description, webViewLink, webContentLink, mimeType, createdTime)',
    });

    return response.data.files?.map(file => ({
      ...file,
      metadata: file.description ? JSON.parse(file.description) : {},
    }));
  } catch (error) {
    console.error('Error searching files in Google Drive:', error);
    throw error;
  }
};

export const updateFileMetadata = async (
  fileId: string,
  metadata: FileMetadata
) => {
  try {
    const response = await drive.files.update({
      fileId,
      requestBody: {
        description: JSON.stringify(metadata),
      },
      fields: 'id, name, description, webViewLink, webContentLink, mimeType, createdTime',
    });

    return {
      ...response.data,
      metadata: metadata,
    };
  } catch (error) {
    console.error('Error updating file metadata:', error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const getPublicDownloadLink = async (fileId: string) => {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const response = await drive.files.get({
      fileId,
      fields: 'webContentLink',
    });

    return response.data.webContentLink;
  } catch (error) {
    console.error('Error generating public link:', error);
    throw error;
  }
};
