# Build stage for client
FROM node:22 as client_build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Production stage
FROM python:3.12.3

WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install gunicorn whitenoise
RUN pip install -r requirements.txt

# Copy the server code
COPY backend /app

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/templates

# Copy the built client files
COPY --from=client_build /app/frontend/dist /app/static
COPY --from=client_build /app/frontend/dist/index.html /app/templates/

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Collect static files
RUN python manage.py collectstatic --noinput --clear

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]