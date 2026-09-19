# Enterprise-Ready Full-Stack Web Application

A secure, performance-optimized full-stack application built with a modern React frontend and a robust Node.js backend. This project showcases advanced security implementation (JWT over HTTP-Only cookies), form validation, and relational database streaming.

## Tech Stack

* **Frontend:** HTML5, CSS3, React.js, React Router, TanStack (React Query)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted via Neon Serverless DB)
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt, HTTP-Only Cookies, Express Validator
* **Version Control:** Git & GitHub

## Key Features & Architectural Highlights

### Advanced Authentication & Security
* **Password Hashing:** Utilizes bcrypt for secure, one-way password hashing before database storage.
* **Secure Token Handling:** Implements JWT-based authentication sent via secure, encrypted HTTP-Only cookies to prevent Cross-Site Scripting (XSS) attacks.
* **Server-Side Validation:** Leverages express-validator middleware to sanitize inputs, enforce strict schemas, and block malicious requests at the API layer.

### Sophisticated Data Routing & State Management
* **Client-Side Routing:** Implements React Router for declarative, fluid page navigation without full-browser reloads.
* **Asynchronous Server State:** Uses TanStack Query to handle efficient data fetching, automated caching, background updates, and stale-time optimization.
* **URL Parameter Filtering:** Features advanced URL filtering mechanisms to sanitize data and validate route strings before processing redirects, safeguarding against Open Redirect vulnerabilities.
* **Form Actions Workflow:** Integrates modern form data manipulation patterns to seamlessly bind user input directly to HTTP methods (GET, POST, PUT, DELETE).

### Database Architecture
* Built on a serverless PostgreSQL cluster managed seamlessly via Neon DB.
* Implements robust relational schemas with isolated backend query architectures powered by environment variable safety.

## How to Run Locally

1. Clone the repository:
   ```bash
   https://github.com/mikemunga/my-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (.env):
   Create a .env file in your server root directory and include:
   ```env
   PORT=5000
   DATABASE_URL=your_neon_postgres_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Start the application:
   ```bash
   npm run dev
   ```
