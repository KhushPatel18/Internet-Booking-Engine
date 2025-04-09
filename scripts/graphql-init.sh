#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for GraphQL database to be ready..."
until pg_isready -h postgres_graphql -U "$POSTGRES_USER"; do
  echo "Database not ready yet. Waiting..."
  sleep 2
done
echo "GraphQL database is ready!"

# Execute the SQL scripts to initialize the database
echo "Initializing GraphQL database with schema and seed data..."

# Create the tables and relations
echo "Creating tables and relations..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/create-tables-relations.sql

# Load seed data
echo "Loading seed data..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/seed-data-for-tables.sql

# Load room rates data
echo "Loading room rates data..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/room_rates_data.sql

# Load rooms in properties data
echo "Loading rooms in properties data..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/rooms_in_properties.sql

# Load room rate room type mapping
echo "Loading room rate room type mapping..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/room_rate_room_type_mapping.sql

# Load room availability data
echo "Loading room availability data..."
psql -v ON_ERROR_STOP=1 -h postgres_graphql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/initial-data-setup/room-availability-data.sql

echo "Database initialization complete!"

# Start the GraphQL server
echo "Starting GraphQL server..."
exec "$@"