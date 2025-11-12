
const { Pool } = require('pg');

async function checkAndCreateTables() {
  const DATABASE_URL = process.env.EXTERNAL_DB_URL || process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('1.55.212.135') ? false : undefined,
  });

  try {
    console.log('🔍 Checking and creating missing tables...\n');

    // Check which tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name NOT IN ('sys_user')
      ORDER BY table_name;
    `;
    
    const result = await pool.query(tablesQuery);
    const existingTables = result.rows.map(row => row.table_name);
    
    console.log('📊 Existing tables:');
    existingTables.forEach(table => console.log(`  ✓ ${table}`));
    console.log('');

    // Required tables from schema
    const requiredTables = [
      'price_lists',
      'price_list_items', 
      'order_change_history',
      'purchase_orders',
      'general_settings',
      'store_settings',
      'products',
      'categories',
      'orders',
      'order_items',
      'customers',
      'suppliers',
      'employees',
      'tables',
      'invoices',
      'invoice_items',
      'purchase_receipts',
      'purchase_receipt_items',
      'purchase_receipt_documents',
      'einvoice_connections',
      'invoice_templates',
      'printer_configs',
      'payment_methods',
      'transactions',
      'transaction_items',
      'attendance_records',
      'point_transactions',
      'inventory_transactions',
      'income_vouchers',
      'expense_vouchers'
    ];

    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:');
      missingTables.forEach(table => console.log(`  ✗ ${table}`));
      console.log('');
    } else {
      console.log('✅ All required tables exist!\n');
    }

    // Run create_missing_tables.sql
    console.log('🔄 Running create_missing_tables.sql migration...');
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(__dirname, 'create_missing_tables.sql');
    
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
      
      // Split and execute statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.log(`⚠️  Statement error: ${error.message}`);
          }
        }
      }
      
      console.log('✅ Migration completed successfully\n');
    }

    // Check tables again after migration
    const finalResult = await pool.query(tablesQuery);
    const finalTables = finalResult.rows.map(row => row.table_name);
    
    const stillMissing = requiredTables.filter(table => !finalTables.includes(table));
    
    if (stillMissing.length > 0) {
      console.log('⚠️  Still missing after migration:');
      stillMissing.forEach(table => console.log(`  ✗ ${table}`));
    } else {
      console.log('✅ All tables verified successfully!');
    }

    // Check store_settings for price_list_id column
    console.log('\n🔍 Checking store_settings columns...');
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'store_settings' 
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await pool.query(columnsQuery);
    const hasPriceListId = columnsResult.rows.some(row => row.column_name === 'price_list_id');
    
    if (hasPriceListId) {
      console.log('✅ price_list_id column exists in store_settings');
    } else {
      console.log('⚠️  price_list_id column missing in store_settings');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkAndCreateTables();
