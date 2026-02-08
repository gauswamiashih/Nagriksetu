# setup_db.ps1
# This script sets up the local PostgreSQL database for NagrikSetu

Write-Host "Setting up NagrikSetu Database..." -ForegroundColor Cyan

# 1. Create Database
Write-Host "Creating database 'nagriksetu'..."
psql -U postgres -c "CREATE DATABASE nagriksetu;"
if ($LASTEXITCODE -ne 0) {
   Write-Host "Database might already exist or permission denied." -ForegroundColor Yellow
}

# 2. Create User
Write-Host "Creating user 'nagriksetu_admin'..."
psql -U postgres -c "CREATE USER nagriksetu_admin WITH PASSWORD '9664592745';"
if ($LASTEXITCODE -ne 0) {
   Write-Host "User might already exist." -ForegroundColor Yellow
}

# 3. Grant Privileges
Write-Host "Granting privileges..."
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE nagriksetu TO nagriksetu_admin;"
psql -U postgres -d nagriksetu -c "GRANT ALL ON SCHEMA public TO nagriksetu_admin;"

# 4. Apply Schema
Write-Host "Applying schema..."
psql -U postgres -d nagriksetu -f "database/schema.sql"

if ($LASTEXITCODE -eq 0) {
   Write-Host "Schema applied successfully!" -ForegroundColor Green
}
else {
   Write-Host "Failed to apply schema." -ForegroundColor Red
}

Write-Host "Setup complete."
