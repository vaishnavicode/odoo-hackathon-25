#!/bin/bash

# StackIt Development Setup Script

echo "🚀 Setting up StackIt Development Environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ All prerequisites are installed."

# Setup Backend
echo ""
echo "🔧 Setting up Django Backend..."
cd backend/backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo ""
echo "🔐 Would you like to create a Django superuser? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

cd ../..

# Setup Frontend
echo ""
echo "🔧 Setting up React Frontend..."
cd frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To start the development servers:"
echo ""
echo "Backend (Django):"
echo "  cd backend/backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Frontend (React):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "🌐 Access the application:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:8000/api"
echo "  - Django Admin: http://localhost:8000/admin"
