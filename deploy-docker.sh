#!/bin/bash

# Recovera Docker Deployment Script
# Quick deployment helper for Docker setup

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Recovera Docker Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Creating from template...${NC}"
    cp .env.docker.example .env
    echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
    echo -e "${YELLOW}Required: DB_PASSWORD, JWT_SECRET, MPESA credentials${NC}"
    read -p "Press enter to continue after editing .env..."
fi

# Function to check if a port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
BACKEND_PORT=$(grep BACKEND_PORT .env | cut -d '=' -f2 | tr -d ' ' || echo "3000")
ADMIN_PORT=$(grep ADMIN_PORT .env | cut -d '=' -f2 | tr -d ' ' || echo "8080")

echo -e "${YELLOW}Checking port availability...${NC}"
if ! check_port $BACKEND_PORT; then
    echo -e "${RED}Error: Port $BACKEND_PORT is already in use${NC}"
    exit 1
fi

if ! check_port $ADMIN_PORT; then
    echo -e "${RED}Error: Port $ADMIN_PORT is already in use${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ports available${NC}"
echo ""

# Ask user what to do
echo "What would you like to do?"
echo "1) Fresh deployment (build and start)"
echo "2) Start existing deployment"
echo "3) Stop deployment"
echo "4) Rebuild images"
echo "5) View logs"
echo "6) Backup database"
echo "7) Clean up (remove all containers and volumes)"
read -p "Select option (1-7): " option

case $option in
    1)
        echo -e "${YELLOW}Building and starting services...${NC}"
        docker-compose build
        docker-compose up -d
        echo -e "${GREEN}✓ Deployment started${NC}"
        echo ""
        echo "Services are starting up. Please wait 30-60 seconds for initialization."
        echo ""
        echo "Access:"
        echo "  Backend API: http://localhost:$BACKEND_PORT"
        echo "  Admin Portal: http://localhost:$ADMIN_PORT"
        echo ""
        echo "To view logs: docker-compose logs -f"
        ;;
    2)
        echo -e "${YELLOW}Starting services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✓ Services started${NC}"
        ;;
    3)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose stop
        echo -e "${GREEN}✓ Services stopped${NC}"
        ;;
    4)
        echo -e "${YELLOW}Rebuilding images...${NC}"
        docker-compose build --no-cache
        docker-compose up -d
        echo -e "${GREEN}✓ Images rebuilt and services restarted${NC}"
        ;;
    5)
        echo -e "${YELLOW}Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    6)
        echo -e "${YELLOW}Creating database backup...${NC}"
        mkdir -p backups
        DATE=$(date +%Y%m%d_%H%M%S)
        docker-compose exec -T postgres pg_dump -U recoverauser recovera | gzip > backups/db_$DATE.sql.gz
        echo -e "${GREEN}✓ Backup created: backups/db_$DATE.sql.gz${NC}"
        ;;
    7)
        echo -e "${RED}⚠️  WARNING: This will remove all containers and data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Cleaning up...${NC}"
            docker-compose down -v
            echo -e "${GREEN}✓ Cleanup complete${NC}"
        else
            echo "Cancelled"
        fi
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Done!${NC}"
echo -e "${GREEN}========================================${NC}"
