<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Powered Viva Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        h1, h2 {
            color: #333;
        }
        h2 {
            border-bottom: 2px solid #333;
            padding-bottom: 0.5em;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin: 0.5em 0;
        }
        code {
            background-color: #e8e8e8;
            padding: 0.2em;
            border-radius: 3px;
        }
        pre {
            background-color: #e8e8e8;
            padding: 1em;
            border-radius: 3px;
            overflow-x: auto;
        }
        .highlight {
            background-color: #d4edda;
            border-left: 5px solid #28a745;
            padding: 1em;
            margin: 1em 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI-Powered Viva Platform</h1>
        <p>This project is an AI-powered viva platform designed to ask questions, record answers, and generate ratings for those answers. It ensures that a single participant is present using face detection and sends email notifications on multiple tab switches.</p>

        <h2>Features</h2>
        <ul>
            <li><strong>Viva Q&A Functionality:</strong> Users can participate in viva sessions with recorded answers and automatic rating generation.</li>
            <li><strong>Face Detection:</strong> Uses the Face API to ensure a single participant is present during the viva.</li>
            <li><strong>Email Notifications:</strong> Sends notifications if multiple tab switches are detected.</li>
            <li><strong>Visually Appealing Interface:</strong> A user-friendly and engaging UI for the viva platform.</li>
        </ul>

        <h2>Installation Steps</h2>
        <p>Follow these steps to set up the project locally:</p>
        
        <h3>Backend Setup</h3>
        <ol>
            <li>Navigate to the backend directory:
                <pre><code>cd backend</code></pre>
            </li>
            <li>Create a virtual environment and activate it:
                <pre><code>python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`</code></pre>
            </li>
            <li>Install the required packages:
                <pre><code>pip install -r requirements.txt</code></pre>
            </li>
            <li>Set up your environment variables (see Environment Variables section).</li>
            <li>Run migrations:
                <pre><code>python manage.py migrate</code></pre>
            </li>
            <li>Start the development server:
                <pre><code>python manage.py runserver</code></pre>
            </li>
        </ol>

        <h3>Frontend Setup</h3>
        <ol>
            <li>Navigate to the frontend directory:
                <pre><code>cd frontend</code></pre>
            </li>
            <li>Install dependencies:
                <pre><code>npm install</code></pre>
            </li>
            <li>Start the development server:
                <pre><code>npm run dev</code></pre>
            </li>
        </ol>

        <h2>Environment Variables</h2>
        <p>Create a <code>.env</code> file in the backend directory with the following variables:</p>
        <pre><code>DEBUG=True
SECRET_KEY=your_secret_key
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password</code></pre>

        <h2>Docker Setup (Optional)</h2>
        <p>For Docker users, you can build and run the project using Docker:</p>

        <h3>Building the Docker Image</h3>
        <pre><code>docker build -t ai-powered-viva-platform .</code></pre>

        <h3>Running the Container</h3>
        <pre><code>docker run -p 8000:8000 ai-powered-viva-platform</code></pre>
        <p>This will start the server and make it accessible on <code>http://localhost:8000</code>.</p>

        <h3>Docker Compose (Optional)</h3>
        <p>Create a <code>docker-compose.yml</code> file in your project root:</p>
        <pre><code>version: '3.8'
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
  postgres_data:</code></pre>
    </div>
</body>
</html>
