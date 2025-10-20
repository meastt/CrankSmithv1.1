// test-email-collection.js - Test script to verify Supabase email collection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSupabaseConnection() {
  try {
    
    // Test 1: Check if we can connect and query tables
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Error querying users table:', tablesError.message);
      
      // Check if table exists
      if (tablesError.code === '42P01') {
        
        // Try to get schema information
        const { data: schemaData, error: schemaError } = await supabaseAdmin
          .rpc('get_schema_tables');
        
        if (schemaError) {
        } else {
        }
      }
      
      return false;
    }
    
    
    // Test 2: Try to insert a test email
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
        
        // Try a simpler insert
        const { data: simpleInsert, error: simpleError } = await supabaseAdmin
          .from('users')
          .insert([{ email: testEmail }])
          .select();
        
        if (simpleError) {
          console.error('❌ Even simple insert failed:', simpleError.message);
          return false;
        } else {
          
          // Clean up
          await supabaseAdmin
            .from('users')
            .delete()
            .eq('email', testEmail);
        }
      }
      
      return false;
    }
    
    
    // Test 3: Try to query the inserted email
    const { data: queryData, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (queryError) {
      console.error('❌ Error querying test email:', queryError.message);
    } else {
    }
    
    // Test 4: Clean up test data
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', testEmail);
    
    if (deleteError) {
      console.error('❌ Error deleting test email:', deleteError.message);
    } else {
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function testEmailCollectionAPIs() {
  
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
    
  } catch (error) {
    console.error('❌ Error testing subscribe API:', error.message);
  }
}

async function showTableStructure() {
  
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
    } else {
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

// Run all tests
async function runAllTests() {
  
  const connectionOk = await testSupabaseConnection();
  await showTableStructure();
  
  if (connectionOk) {
  } else {
  }
}

// Run the tests
runAllTests().catch(console.error); 