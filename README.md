
<body>
    <div class="container">
        <h1>AI-Powered Viva Platform</h1>
        <p>This project is an AI-powered viva platform designed to ask questions, record answers, and generate ratings. It includes face detection to ensure a single participant and sends email notifications on multiple tab switches.</p>
<h2>Features</h2>
        <ul>
            <li><strong>User Sign Up and Sign In:</strong> Dummy data for user authentication.</li>
            <li><strong>Question and Answer Functionality:</strong> With recording and automatic rating generation.</li>
            <li><strong>Face Detection:</strong> Ensures a single participant using the Face API.</li>
            <li><strong>Email Notifications:</strong> Alerts on multiple tab switches.</li>
            <li><strong>Visually Appealing UI:</strong> Engaging and user-friendly interface.</li>
        </ul>

<h2>Prerequisites</h2>
        <ul>
            <li>Python 3.8+</li>
            <li>Node.js 14+</li>
            <li>PostgreSQL</li>
            <li>Docker (optional)</li>
        </ul>

<h2>Getting Started</h2>

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

<h2>Docker Setup for AI-Powered Viva Platform</h2>
        <p>This section provides information on how to use Docker to build and run the AI-Powered Viva Platform.</p>

<h3>Prerequisites</h3>
        <ul>
            <li>Docker</li>
            <li>Docker Compose (optional, but recommended)</li>
        </ul>

 <h3>Dockerfile Overview</h3>
        <p>Our Dockerfile uses a multi-stage build process:</p>
        <ul>
            <li>Builds the React frontend.</li>
            <li>Sets up the Django backend with all necessary dependencies.</li>
            <li>Copies the built static files from the frontend to the backend.</li>
        </ul>

<h3>Building the Docker Image</h3>
        <pre><code>docker build -t ai-powered-viva-platform .</code></pre>

<h3>Running the Container</h3>
        <pre><code>docker run -p 8000:8000 ai-powered-viva-platform</code></pre>
        <p>This will start the server and make it accessible on <code>http://localhost:8000</code>.</p>

 <h3>Environment Variables</h3>
        <p>The Dockerfile sets up the following environment variables:</p>
        <pre><code>POSTGRES_DB=viva
POSTGRES_USER=postgres
POSTGRES_PASSWORD=*******
POSTGRES_HOST=localhost
POSTGRES_PORT=5432</code></pre>
        <p>Ensure these match your PostgreSQL setup. For production, it's recommended to use Docker secrets or environment files instead of hardcoding these values.</p>

<h3>Volumes</h3>
        <p>If you need to persist data or make live changes, consider setting up volumes. This can be done when running the container:</p>
        <pre><code>docker run -v /path/on/host:/code -p 8000:8000 ai-powered-viva-platform</code></pre>

<h3>Docker Compose (Optional)</h3>
        <p>For easier management, especially when dealing with multiple services (e.g., Django and PostgreSQL), consider using Docker Compose. Create a <code>docker-compose.yml</code> file in your project root:</p>
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
