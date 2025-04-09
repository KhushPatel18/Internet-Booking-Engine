#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for Backend database to be ready..."
until pg_isready -h postgres_backend -U "$SPRING_DATASOURCE_USERNAME"; do
  echo "Database not ready yet. Waiting..."
  sleep 2
done
echo "Backend database is ready!"

# Check if we need to run any initialization scripts
if [ -d "/docker-entrypoint-initdb.d" ] && [ -n "$(ls -A /docker-entrypoint-initdb.d)" ]; then
  echo "Initializing Backend database with schema and seed data..."
  
  for f in /docker-entrypoint-initdb.d/*.sql; do
    echo "Running script $f"
    psql -v ON_ERROR_STOP=1 -h postgres_backend -U "$SPRING_DATASOURCE_USERNAME" -d "$SPRING_DATASOURCE_DATABASE" -f "$f"
  done
  
  for f in /docker-entrypoint-initdb.d/*.sh; do
    if [ -x "$f" ]; then
      echo "Running script $f"
      "$f"
    fi
  done
  
  echo "Database initialization complete!"
fi

# Start the Spring Boot application
echo "Starting Spring Boot application..."
exec java -jar app.jar