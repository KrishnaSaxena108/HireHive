// Test File Upload Feature
// This script tests the file upload endpoints (profile picture and portfolio)

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

let testUserId = null;
let testToken = null;

const baseURL = 'http://localhost:4000';

// First, register a test user
async function registerTestUser() {
  console.log('📝 Registering test user...\n');
  
  const query = `
    mutation {
      register(username: "fileuploadtest", email: "fileupload@test.com", password: "password123", role: "FREELANCER") {
        token
        user {
          id
          username
          email
        }
      }
    }
  `;

  try {
    const response = await fetch(`${baseURL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      // User might already exist, try logging in
      console.log('User may exist, attempting login...\n');
      
      const loginQuery = `
        mutation {
          login(email: "fileupload@test.com", password: "password123") {
            token
            user {
              id
              username
              email
            }
          }
        }
      `;

      const loginResponse = await fetch(`${baseURL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: loginQuery })
      });

      const loginResult = await loginResponse.json();
      
      if (loginResult.data && loginResult.data.login) {
        testToken = loginResult.data.login.token;
        testUserId = loginResult.data.login.user.id;
        console.log(`✅ Logged in as: ${loginResult.data.login.user.username} (ID: ${testUserId})\n`);
        return true;
      } else {
        console.log('❌ Login failed\n');
        return false;
      }
    } else {
      testToken = result.data.register.token;
      testUserId = result.data.register.user.id;
      console.log(`✅ Registered: ${result.data.register.user.username}\n`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    return false;
  }
}

// Test profile picture upload
async function testProfilePictureUpload() {
  console.log('📸 Testing Profile Picture Upload...\n');

  try {
    // Create a dummy image file (1x1 pixel PNG)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x08, 0x74, 0x49, 0x4D, 0x45, 0x07, 0xE6, 0x03, 0x09, 0x10, 0x2A, 0x08,
      0x2C, 0x5B, 0x94, 0xAC, 0x9C, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD9, 0x63, 0xF8, 0xFF, 0xFF, 0xFF, 0x3F, 0x00, 0x05, 0xFE,
      0x02, 0xFF, 0xFF, 0x26, 0x05, 0x73, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const form = new FormData();
    form.append('file', Buffer.from(pngBuffer), 'profile.png');

    const response = await fetch(`${baseURL}/api/upload/profile-picture`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${testToken}`
      },
      body: form
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ Profile picture uploaded successfully`);
      console.log(`   File URL: ${data.fileUrl}`);
      console.log(`   Message: ${data.message}\n`);
      return true;
    } else {
      console.log(`❌ Upload failed: ${data.error}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    return false;
  }
}

// Test portfolio upload
async function testPortfolioUpload() {
  console.log('📄 Testing Portfolio Upload...\n');

  try {
    // Create a dummy PDF file
    const pdfBuffer = Buffer.from([
      0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A, 0x31, 0x20, 0x30,
      0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65,
      0x20, 0x2F, 0x43, 0x61, 0x74, 0x61, 0x6C, 0x6F, 0x67, 0x20, 0x2F, 0x50,
      0x61, 0x67, 0x65, 0x73, 0x20, 0x32, 0x20, 0x30, 0x20, 0x52, 0x3E, 0x3E,
      0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A, 0x32, 0x20, 0x30, 0x20,
      0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65, 0x20,
      0x2F, 0x50, 0x61, 0x67, 0x65, 0x73, 0x20, 0x2F, 0x4B, 0x69, 0x64, 0x73,
      0x20, 0x5B, 0x33, 0x20, 0x30, 0x20, 0x52, 0x5D, 0x20, 0x2F, 0x43, 0x6F,
      0x75, 0x6E, 0x74, 0x20, 0x31, 0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F,
      0x62, 0x6A, 0x0A, 0x78, 0x72, 0x65, 0x66, 0x0A, 0x30, 0x20, 0x33, 0x0A,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x36,
      0x35, 0x35, 0x33, 0x35, 0x20, 0x66, 0x0A, 0x74, 0x72, 0x61, 0x69, 0x6C,
      0x65, 0x72, 0x0A, 0x3C, 0x3C, 0x2F, 0x53, 0x69, 0x7A, 0x65, 0x20, 0x33,
      0x20, 0x2F, 0x52, 0x6F, 0x6F, 0x74, 0x20, 0x31, 0x20, 0x30, 0x20, 0x52,
      0x3E, 0x3E, 0x0A, 0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66,
      0x0A, 0x31, 0x38, 0x39, 0x0A, 0x25, 0x45, 0x4F, 0x46
    ]);

    const form = new FormData();
    form.append('file', Buffer.from(pdfBuffer), 'portfolio.pdf');

    const response = await fetch(`${baseURL}/api/upload/portfolio`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${testToken}`
      },
      body: form
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ Portfolio uploaded successfully`);
      console.log(`   File URL: ${data.fileUrl}`);
      console.log(`   Message: ${data.message}\n`);
      return true;
    } else {
      console.log(`❌ Upload failed: ${data.error}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    return false;
  }
}

// Test invalid file upload
async function testInvalidFileUpload() {
  console.log('❌ Testing Invalid File Upload...\n');

  try {
    // Try uploading invalid file type
    const invalidBuffer = Buffer.from('Not an image or document');

    const form = new FormData();
    form.append('file', Buffer.from(invalidBuffer), 'invalid.txt');

    const response = await fetch(`${baseURL}/api/upload/profile-picture`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${testToken}`
      },
      body: form
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`✅ Invalid file correctly rejected`);
      console.log(`   Error: ${data.error}\n`);
      return true;
    } else {
      console.log(`❌ Invalid file should have been rejected\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    return false;
  }
}

// Test unauthorized upload
async function testUnauthorizedUpload() {
  console.log('🔒 Testing Unauthorized Upload...\n');

  try {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);

    const form = new FormData();
    form.append('file', Buffer.from(pngBuffer), 'test.png');

    const response = await fetch(`${baseURL}/api/upload/profile-picture`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer invalid_token'
      },
      body: form
    });

    const data = await response.json();

    if (response.status === 401 || data.error === 'Unauthorized') {
      console.log(`✅ Unauthorized request correctly rejected\n`);
      return true;
    } else {
      console.log(`❌ Should have rejected unauthorized request\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Testing File Upload Feature\n');
  console.log('='.repeat(50) + '\n');

  let passed = 0;
  let failed = 0;

  // Register user
  if (await registerTestUser()) {
    passed++;
  } else {
    console.log('❌ Failed to register user, stopping tests\n');
    return;
  }

  // Test valid uploads
  if (await testProfilePictureUpload()) passed++; else failed++;
  if (await testPortfolioUpload()) passed++; else failed++;

  // Test invalid uploads
  if (await testInvalidFileUpload()) passed++; else failed++;
  if (await testUnauthorizedUpload()) passed++; else failed++;

  console.log('='.repeat(50) + '\n');
  console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests\n`);

  if (failed === 0) {
    console.log('✨ All file upload tests passed!');
  } else {
    console.log('⚠️ Some tests failed.');
  }
}

// Check if form-data and node-fetch are available
if (!require.cache[require.resolve('form-data')] && !global.FormData) {
  console.log('Installing required packages...');
  require('child_process').execSync('npm install form-data node-fetch@2', { stdio: 'inherit' });
}

runTests();
