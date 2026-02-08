-- Create the user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'nagriksetu_admin') THEN

      CREATE ROLE nagriksetu_admin LOGIN PASSWORD '9664592745';
      RAISE NOTICE 'User nagriksetu_admin created';
   ELSE
      RAISE NOTICE 'User nagriksetu_admin already exists';
      ALTER USER nagriksetu_admin WITH PASSWORD '9664592745';
   END IF;
END
$do$;

-- Grant privileges
ALTER USER nagriksetu_admin WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE nagriksetu TO nagriksetu_admin;
GRANT ALL ON SCHEMA public TO nagriksetu_admin;
