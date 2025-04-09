# Booking Engine Application

A full-stack booking engine application built with React, Spring Boot, and GraphQL, containerized with Docker for easy deployment and development.

## Architecture Overview

This application consists of four main components:

1. **React Frontend**: A modern UI built with React and Vite
2. **Spring Boot Backend**: A Java-based REST API server
3. **GraphQL Server**: A Node.js GraphQL API for complex data queries
4. **PostgreSQL Databases**: Separate databases for the Backend and GraphQL services

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│   React     │ ───────▶│  Spring     │◀────────│  GraphQL    │
│  Frontend   │         │  Backend    │         │  Server     │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
       ▲                       ▲                       ▲
       │                       │                       │
       │                       │                       │
       │                 ┌─────┴─────┐           ┌─────┴─────┐
       │                 │           │           │           │
       └────────────────▶│ Backend   │           │ GraphQL   │
                         │ Database  │           │ Database  │
                         │           │           │           │
                         └───────────┘           └───────────┘
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/booking-engine.git
   cd booking-engine
   ```

2. Create a `.env` file in the root directory with your environment variables (use the provided template).

3. Start the application:
   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - GraphQL Playground: http://localhost:4000/graphql

## Environment Configuration

All configuration is centralized in a single `.env` file. Key variables include:

```
# Database configurations
BACKEND_DB=backend_db
POSTGRES_BACKEND_USER=postgres
POSTGRES_BACKEND_PASSWORD=your_secure_password

GRAPHQL_DB=bookingengine
POSTGRES_GRAPHQL_USER=postgres
POSTGRES_GRAPHQL_PASSWORD=your_secure_password

# Port configurations
BACKEND_PORT=8080
GRAPHQL_PORT=4000
FRONTEND_PORT=3000
```

## Project Structure

```
booking-engine/
├── .env                    # Environment variables
├── docker-compose.yml      # Docker Compose configuration
├── Frontend/               # React application
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── nginx.conf          # Nginx configuration for production
│   └── ...                 # React/Vite code
├── Backend/                # Spring Boot application
│   ├── Dockerfile          # Backend Docker configuration
│   ├── pom.xml             # Maven dependencies
│   ├── database/           # Database initialization scripts
│   │   └── init/           # SQL scripts run on startup
│   └── src/                # Spring Boot source code
├── GraphQL/                # GraphQL server
│   ├── Dockerfile          # GraphQL Docker configuration
│   ├── package.json        # Node.js dependencies
│   ├── initial-data-setup/ # GraphQL database setup scripts
│   └── src/                # GraphQL server source code
└── scripts/                # Initialization scripts
    ├── backend-init.sh     # Backend database initialization
    └── graphql-init.sh     # GraphQL database initialization
```

## Docker Configuration

### Docker Compose

The `docker-compose.yml` file orchestrates the entire application environment. Key features include:

#### Services

1. **postgres_backend**: PostgreSQL database for the Spring Boot backend
   - Uses PostgreSQL 15 Alpine image for minimal footprint
   - Stores data in a persistent volume
   - Runs initialization scripts from `Backend/database/init/`
   - Exposes port 5432 (configurable via .env)

2. **postgres_graphql**: PostgreSQL database for the GraphQL server
   - Similar configuration to postgres_backend
   - Exposes port 5433 (configurable via .env)

3. **backend**: Spring Boot API server
   - Built from multi-stage Dockerfile
   - Depends on postgres_backend being healthy
   - Connects to postgres_backend using environment variables
   - Exposes port 8080 (configurable via .env)

4. **graphql**: GraphQL API server
   - Built from custom Dockerfile
   - Depends on postgres_graphql being healthy
   - Runs initialization scripts on startup
   - Exposes port 4000 (configurable via .env)

5. **frontend**: React application
   - Built from multi-stage Dockerfile
   - Served via Nginx in production
   - Proxies API requests to backend and graphql
   - Exposes port 3000 (configurable via .env)

#### Networks

- **app_network**: Bridge network for all services to communicate

#### Volumes

- **postgres_backend_data**: Persistent storage for backend database
- **postgres_graphql_data**: Persistent storage for GraphQL database
- **backend_maven_repo**: Maven repository cache for backend builds

### Dockerfiles

#### Backend Dockerfile

```dockerfile
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

This multi-stage build:
1. Uses Maven to build the Spring Boot application
2. Creates a minimal runtime image with only the compiled JAR
3. Runs the JAR file when the container starts

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

This multi-stage build:
1. Uses Node.js to build the React application
2. Creates a minimal Nginx image to serve the built assets
3. Configures Nginx with a custom configuration file
4. Serves the application when the container starts

#### GraphQL Dockerfile

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache postgresql-client bash

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 4000
```

This Dockerfile:
1. Uses Node.js Alpine as the base image
2. Installs PostgreSQL client and Bash for database initialization
3. Installs Node.js dependencies
4. Exposes port 4000 for the GraphQL server

### Initialization Scripts

#### GraphQL Initialization (graphql-init.sh)

This script:
1. Waits for the PostgreSQL database to be ready
2. Runs initialization scripts to create tables and load seed data
3. Starts the GraphQL server

#### Backend Initialization (backend-init.sh)

This script:
1. Waits for the PostgreSQL database to be ready
2. Runs any SQL scripts found in the initialization directory
3. Starts the Spring Boot application

## Development Workflow

### Hot Reloading

The Docker setup includes volume mounts for all three services to enable hot reloading during development:

- Frontend: Changes to React code will trigger automatic reloads
- Backend: Java code changes are mounted into the container
- GraphQL: Code changes will trigger automatic server restarts

### Database Initialization

Both the Backend and GraphQL services have initialization scripts that run when the containers start:

1. **Backend Database**: SQL scripts in `Backend/database/init/` are executed automatically
2. **GraphQL Database**: The `scripts/graphql-init.sh` script runs SQL files from `GraphQL/initial-data-setup/`

### Adding Database Migrations

- **Backend**: Add new SQL files to `Backend/database/init/` directory
- **GraphQL**: Add new SQL files to `GraphQL/initial-data-setup/` and update the `scripts/graphql-init.sh` script

## DevOps Considerations

### Scaling

The application can be scaled in several ways:

1. **Horizontal Scaling**: Add more instances of each service using Docker Swarm or Kubernetes
2. **Vertical Scaling**: Increase resources (CPU, memory) for individual containers
3. **Database Scaling**: Set up PostgreSQL replication for read scaling

### Monitoring

Consider adding:

1. **Health Checks**: Already implemented in the Docker Compose file
2. **Logging**: Use a centralized logging solution like ELK stack or Prometheus
3. **Metrics**: Implement application metrics using tools like Prometheus/Grafana

### CI/CD Pipeline

Implement a CI/CD pipeline using GitHub Actions, GitLab CI, or Jenkins:

1. **Build**: Compile code and run tests
2. **Package**: Build Docker images
3. **Deploy**: Push to Docker registry and deploy to target environment

Example GitHub Actions workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Build Backend
      run: cd Backend && mvn clean package -DskipTests
      
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Build Frontend
      run: cd Frontend && yarn install && yarn build
      
    - name: Build GraphQL
      run: cd GraphQL && yarn install
      
    - name: Build and Push Docker images
      run: docker-compose build
      # Add docker push commands here
```

## Production Deployment

For production deployment:

1. Update the `.env` file with production values
2. Consider using Docker secrets for sensitive information
3. Set `NODE_ENV=production` in the `.env` file
4. Deploy with:
   ```bash
   docker-compose up -d
   ```

## Troubleshooting

### Database Connection Issues

If services can't connect to databases:
- Check if PostgreSQL containers are running: `docker ps`
- Verify healthchecks are passing: `docker ps` should show "(healthy)"
- Check logs: `docker-compose logs postgres_backend` or `docker-compose logs postgres_graphql`

### Frontend Not Loading

- Check nginx configuration in `Frontend/nginx.conf`
- Verify the build process: `docker-compose logs frontend`
- Make sure API endpoints are correctly proxied in nginx config

### Backend API Errors

- Check Spring Boot logs: `docker-compose logs backend`
- Verify database connection settings in `.env`
- Check if database initialization scripts ran successfully

### GraphQL API Issues

- Check GraphQL logs: `docker-compose logs graphql`
- Verify database connection and initialization: `docker-compose logs postgres_graphql`
- Ensure the GraphQL initialization script completed successfully

### Docker-Specific Issues

- **Container not starting**: Check for port conflicts with `docker-compose ps`
- **Volume permission issues**: Check file permissions in volume mounts
- **Network issues**: Verify all services are on the same network with `docker network inspect app_network`

### Common Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs for a specific service
docker-compose logs -f backend

# Rebuild a specific service
docker-compose build frontend

# Stop all services
docker-compose down

# Stop and remove volumes (caution: destroys data)
docker-compose down -v

# View container status
docker-compose ps

# Execute command in a running container
docker-compose exec backend /bin/bash

# View Docker networks
docker network ls
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request