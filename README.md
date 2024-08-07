AI-Powered Viva Platform
This project is an AI-powered viva platform designed to ask questions, record answers, and generate ratings. It includes face detection to ensure a single participant and sends email notifications on multiple tab switches.

Features
User Sign Up and Sign In (dummy data)
Question and Answer functionality with recording
Automatic rating generation
Face detection to ensure a single participant
Email notifications on multiple tab switches
Visually appealing chatbot UI
Prerequisites
Python 3.8+
Node.js 14+
PostgreSQL
Docker (optional)
Getting Started
Backend Setup
Navigate to the backend directory:

bash
Copy code
cd backend
Create a virtual environment and activate it:

bash
Copy code
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
Install the required packages:

bash
Copy code
pip install -r requirements.txt
Set up your environment variables (see Environment Variables section)

Run migrations:

bash
Copy code
python manage.py migrate
Start the development server:

bash
Copy code
python manage.py runserver
Frontend Setup
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
Environment Variables
Create a .env file in the backend directory with the following variables:

makefile
Copy code
DEBUG=True
SECRET_KEY=your_secret_key
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Docker Setup for AI-Powered Viva Platform
This README provides information on how to use Docker to build and run the AI-Powered Viva Platform.

Prerequisites
Docker
Docker Compose (optional, but recommended)
Dockerfile Overview
Our Dockerfile uses a multi-stage build process:

It builds the React frontend.
It sets up the Django backend with all necessary dependencies.
It copies the built static files from the frontend to the backend.
Building the Docker Image
To build the Docker image, run the following command in the directory containing the Dockerfile:

bash
Copy code
docker build -t ai-powered-viva-platform .
Running the Container
To run the container:

bash
Copy code
docker run -p 8000:8000 ai-powered-viva-platform
This will start the server and make it accessible on http://localhost:8000.

Environment Variables
The Dockerfile sets up the following environment variables:

makefile
Copy code
POSTGRES_DB=viva
POSTGRES_USER=postgres
POSTGRES_PASSWORD=*******
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
Ensure these match your PostgreSQL setup. For production, it's recommended to use Docker secrets or environment files instead of hardcoding these values.

Volumes
If you need to persist data or make live changes, consider setting up volumes. This can be done when running the container:

bash
Copy code
docker run -v /path/on/host:/code -p 8000:8000 ai-powered-viva-platform
Docker Compose (Optional)
For easier management, especially when dealing with multiple services (e.g., Django and PostgreSQL), consider using Docker Compose. Create a docker-compose.yml file in your project root:

yaml
Copy code
version: '3.8'
services:
  web:
    build: .
    command: python backend/manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    env_file:
      - backend/.env
    depends_on:
      - db
  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      POSTGRES_DB: yourdatabase
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
volumes:
  postgres_data:
