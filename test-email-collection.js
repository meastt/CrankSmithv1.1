// Test script for email collection API
// Run with: node test-email-collection.js

const testEmail = 'test@example.com';

async function testEmailCollection() {
  console.log('Testing email collection API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Email collection test PASSED');
    } else {
      console.log('❌ Email collection test FAILED');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testEmailCollection();
}

module.exports = { testEmailCollection }; 