import { supabase } from '../server/supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL?.substring(0, 20) + '...');  // Show partial URL for logging
  
  try {
    // Test a basic query against Supabase
    const { data, error, status } = await supabase.from('non_existent_table').select('*').limit(1);
    
    console.log('Response status:', status);
    console.log('Response error:', error);
    
    // If we got here with a 404 specifically about the table not existing, that's good!
    // It means we can connect to Supabase, but the table doesn't exist yet
    if (error && error.code === '42P01') {
      console.log('✅ Supabase connection successful, table does not exist as expected');
    } else if (error) {
      console.log('❌ Supabase connection error:', error.message || error);
    } else {
      console.log('✅ Supabase connection successful');
    }
    
    // Try to create a test table
    console.log('Attempting to create a test table...');
    const { data: createData, error: createError } = await supabase
      .from('test_table')
      .insert([{ name: 'Test Item' }]);
    
    if (createError) {
      console.log('Error creating test table:', createError);
    } else {
      console.log('Successfully created test entry:', createData);
    }
    
    // Try to query for existing tables
    console.log('Checking if any tables exist...');
    const tables = ['properties', 'amenities', 'locations', 'property_images', 'property_amenities'];
    
    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.log(`Table ${table}:`, tableError.message);
      } else {
        console.log(`Table ${table}: exists`, tableData);
      }
    }
    
  } catch (err) {
    console.error('Unexpected error during Supabase test:', err);
  }
}

testSupabaseConnection();