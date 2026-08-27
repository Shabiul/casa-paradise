const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function migrate() {
  const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Connecting to PostgreSQL database at db.adfppjipzcwdxjurqtda.supabase.co ...');
  const client = new Client({
    connectionString: 'postgresql://postgres:nUVPhuzIfMtfvFMa@db.adfppjipzcwdxjurqtda.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');

    console.log('Executing schema.sql ...');
    await client.query(sql);
    console.log('Schema executed successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Created tables in public schema:');
    res.rows.forEach(r => console.log(' - ' + r.table_name));

    // Verify seed data count
    const roomsCount = await client.query('SELECT COUNT(*) FROM public.rooms;');
    const usersCount = await client.query('SELECT COUNT(*) FROM public.crm_users;');
    const settingsCount = await client.query('SELECT COUNT(*) FROM public.hotel_settings;');
    console.log(`Rooms seeded: ${roomsCount.rows[0].count}`);
    console.log(`CRM Users seeded: ${usersCount.rows[0].count}`);
    console.log(`Hotel Settings seeded: ${settingsCount.rows[0].count}`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
