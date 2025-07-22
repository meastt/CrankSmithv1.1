// test-email-collection.js - Test script to verify Supabase email collection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Testing Supabase Email Collection Configuration');
console.log('================================================');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);
console.log('Service Key starts with:', supabaseServiceKey?.substring(0, 20) + '...');

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSupabaseConnection() {
  try {
    console.log('\n📡 Testing Supabase Connection...');
    
    // Test 1: Check if we can connect and query tables
    console.log('1. Checking available tables...');
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Error querying users table:', tablesError.message);
      
      // Check if table exists
      if (tablesError.code === '42P01') {
        console.log('📋 Users table does not exist. Let\'s check what tables are available...');
        
        // Try to get schema information
        const { data: schemaData, error: schemaError } = await supabaseAdmin
          .rpc('get_schema_tables');
        
        if (schemaError) {
          console.log('Cannot get schema info, but this might be normal due to permissions');
        } else {
          console.log('Available tables:', schemaData);
        }
      }
      
      return false;
    }
    
    console.log('✅ Successfully connected to users table');
    console.log('   Current records count:', tables ? tables.length : 0);
    
    // Test 2: Try to insert a test email
    console.log('\n2. Testing email insertion...');
    const testEmail = `test-${Date.now()}@cranksmith-test.com`;
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{
        email: testEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_subscribed: true,
        email_subscribed_at: new Date().toISOString(),
        subscription_source: 'test',
        status: 'active'
      }])
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test email:', insertError.message);
      
      if (insertError.code === '42703') {
        console.log('📋 Column does not exist. Let\'s check the table structure...');
        
        // Try a simpler insert
        const { data: simpleInsert, error: simpleError } = await supabaseAdmin
          .from('users')
          .insert([{ email: testEmail }])
          .select();
        
        if (simpleError) {
          console.error('❌ Even simple insert failed:', simpleError.message);
          return false;
        } else {
          console.log('✅ Simple insert worked. Table might have different columns.');
          
          // Clean up
          await supabaseAdmin
            .from('users')
            .delete()
            .eq('email', testEmail);
        }
      }
      
      return false;
    }
    
    console.log('✅ Successfully inserted test email');
    console.log('   Inserted record:', insertData[0]);
    
    // Test 3: Try to query the inserted email
    console.log('\n3. Testing email query...');
    const { data: queryData, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (queryError) {
      console.error('❌ Error querying test email:', queryError.message);
    } else {
      console.log('✅ Successfully queried test email');
      console.log('   Found record:', queryData);
    }
    
    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', testEmail);
    
    if (deleteError) {
      console.error('❌ Error deleting test email:', deleteError.message);
    } else {
      console.log('✅ Successfully cleaned up test data');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function testEmailCollectionAPIs() {
  console.log('\n📧 Testing Email Collection APIs...');
  
  // Test the subscribe endpoint
  try {
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `api-test-${Date.now()}@cranksmith-test.com`
      }),
    });
    
    const data = await response.json();
    console.log('Subscribe API Response:', data);
    
  } catch (error) {
    console.error('❌ Error testing subscribe API:', error.message);
    console.log('💡 Make sure your Next.js development server is running (npm run dev)');
  }
}

async function showTableStructure() {
  console.log('\n📋 Checking Users Table Structure...');
  
  try {
    // Get first record to see structure
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error getting table structure:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Table structure (based on first record):');
      console.log('   Columns:', Object.keys(data[0]));
      console.log('   Sample record:', data[0]);
    } else {
      console.log('📋 Table exists but is empty');
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive email collection tests...\n');
  
  const connectionOk = await testSupabaseConnection();
  await showTableStructure();
  
  if (connectionOk) {
    console.log('\n✅ All Supabase tests passed!');
    console.log('📧 You can now test the email collection in your app');
  } else {
    console.log('\n❌ Some tests failed. Please check the configuration');
  }
}

// Run the tests
runAllTests().catch(console.error); 