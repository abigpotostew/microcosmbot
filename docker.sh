#!/bin/bash

# Microcosms Docker Quick Start Script
# This script helps you quickly build and deploy the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Microcosms Docker Deployment Script${NC}"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    if [ -f env.example ]; then
        echo -e "Creating .env from env.example..."
        cp env.example .env
        echo -e "${YELLOW}Please edit .env file with your configuration before proceeding${NC}"
        echo "Run this script again after configuring .env"
        exit 1
    else
        echo -e "${RED}Error: env.example not found${NC}"
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Parse command line arguments
COMMAND=${1:-build}

case $COMMAND in
    build)
        echo -e "${GREEN}Building Docker image...${NC}"
        docker build -t microcosms:latest .
        echo -e "${GREEN}Build complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "  Run: ./docker.sh run"
        echo "  Or with compose: docker compose up -d"
        ;;
    
    run)
        echo -e "${GREEN}Starting container...${NC}"
        
        # Stop and remove existing container if it exists
        if docker ps -a | grep -q microcosms; then
            echo "Stopping existing container..."
            docker stop microcosms || true
            docker rm microcosms || true
        fi
        
        # Run new container
        docker run -d \
            --name microcosms \
            -p 3000:3000 \
            --env-file .env \
            --restart unless-stopped \
            microcosms:latest
        
        echo -e "${GREEN}Container started successfully!${NC}"
        echo ""
        echo "Application is running at: http://localhost:3000"
        echo ""
        echo "Useful commands:"
        echo "  View logs: docker logs -f microcosms"
        echo "  Stop: docker stop microcosms"
        echo "  Restart: docker restart microcosms"
        ;;
    
    logs)
        echo -e "${GREEN}Showing container logs...${NC}"
        docker logs -f microcosms
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping container...${NC}"
        docker stop microcosms
        echo -e "${GREEN}Container stopped${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}Restarting container...${NC}"
        docker restart microcosms
        echo -e "${GREEN}Container restarted${NC}"
        ;;
    
    clean)
        echo -e "${YELLOW}Cleaning up...${NC}"
        docker stop microcosms || true
        docker rm microcosms || true
        docker rmi microcosms:latest || true
        echo -e "${GREEN}Cleanup complete${NC}"
        ;;
    
    compose-up)
        echo -e "${GREEN}Starting with Docker Compose...${NC}"
        docker compose up -d
        echo -e "${GREEN}Services started!${NC}"
        echo "View logs: docker compose logs -f"
        ;;
    
    compose-down)
        echo -e "${YELLOW}Stopping Docker Compose services...${NC}"
        docker compose down
        echo -e "${GREEN}Services stopped${NC}"
        ;;
    
    *)
        echo "Usage: ./docker.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build         - Build the Docker image"
        echo "  run           - Run the container"
        echo "  logs          - Show container logs"
        echo "  stop          - Stop the container"
        echo "  restart       - Restart the container"
        echo "  clean         - Remove container and image"
        echo "  compose-up    - Start with docker compose"
        echo "  compose-down  - Stop docker compose services"
        echo ""
        echo "Example: ./docker.sh build"
        exit 1
        ;;
esac

