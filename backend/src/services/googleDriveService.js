const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Google Drive Service for uploading deliverables
// Uses Service Account authentication

class GoogleDriveService {
  constructor() {
    this.driveClient = null;
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // Folder ID where files will be uploaded
  }

  async initialize() {
    if (this.driveClient) return this.driveClient;

    try {
      // Check for service account credentials
      const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || 
        path.join(__dirname, '../../credentials/google-service-account.json');
      
      if (fs.existsSync(credentialsPath)) {
        const auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/drive.file']
        });
        this.driveClient = google.drive({ version: 'v3', auth });
      } else {
        // Fallback: Use API key or individual credentials from env
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
          },
          scopes: ['https://www.googleapis.com/auth/drive.file']
        });
        this.driveClient = google.drive({ version: 'v3', auth });
      }
      
      console.log('Google Drive service initialized successfully');
      return this.driveClient;
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error.message);
      throw error;
    }
  }

  async uploadFile(filePath, fileName, mimeType) {
    const drive = await this.initialize();
    
    const fileMetadata = {
      name: fileName,
      parents: this.folderId ? [this.folderId] : []
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath)
    };

    try {
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink'
      });

      // Make the file accessible to anyone with the link
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      // Get updated file info with sharing link
      const file = await drive.files.get({
        fileId: response.data.id,
        fields: 'id, name, webViewLink, webContentLink'
      });

      return {
        fileId: file.data.id,
        fileName: file.data.name,
        viewUrl: file.data.webViewLink,
        downloadUrl: file.data.webContentLink
      };
    } catch (error) {
      console.error('Google Drive upload error:', error.message);
      throw new Error('Failed to upload file to Google Drive: ' + error.message);
    }
  }

  async deleteFile(fileId) {
    const drive = await this.initialize();
    
    try {
      await drive.files.delete({ fileId });
      return true;
    } catch (error) {
      console.error('Google Drive delete error:', error.message);
      return false;
    }
  }
}

module.exports = new GoogleDriveService();
