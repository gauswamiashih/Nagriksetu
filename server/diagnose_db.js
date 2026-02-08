const { Client } = require('pg');

async function testConnection(password) {
   const client = new Client({
      user: 'nagriksetu_admin',
      host: 'localhost',
      database: 'nagriksetu',
      password: password,
      port: 5432,
   });

   try {
      console.log(`Testing password: ${password}`);
      await client.connect();
      console.log('Connection successful!');
      await client.end();
   } catch (err) {
      console.log('Connection failed:', err.message);
   }
}

async function run() {
   await testConnection('9664592745');
   await testConnection('nagriksetu_secure_pass');
}

run();
