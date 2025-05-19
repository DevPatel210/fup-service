# File Upload Processor (FUP) Service

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-%3E%3D4.17.0-blue.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/sequelize-%3E%3D6.0.0-brightgreen.svg)](https://sequelize.org/)
[![BullMQ](https://img.shields.io/badge/bullmq-%3E%3D2.0.0-orange.svg)](https://docs.bullmq.io/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%3E%3D14.0-blueviolet.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%3E%3D6.0-red.svg)](https://redis.io/)

**File Upload Processor (FUP) service** is a robust and secure backend microservice built with Node.js, Express, Sequelize (for PostgreSQL), and BullMQ (for background job processing). It provides functionalities for securely uploading files, storing them, and processing them asynchronously using a queue-based system.

## Features

* **Secure File Upload:** Handles file uploads with configurable size limits (currently 1B) and allows specific file types (currently text only, stay tuned for pdf and csv).
* **Metadata Storage:** Stores file metadata in a PostgreSQL database using Sequelize ORM, including original filename, storage path, title, description, upload status, and extracted data.
* **User Association:** Files can be associated with specific users.
* **Asynchronous Job Processing:** Leverages BullMQ to queue and process file-related jobs (e.g., metadata extraction, virus scanning, format conversion) in the background, ensuring the main API remains responsive.
* **Job Tracking:** Tracks the status of processing jobs (queued, processing, completed, failed) and stores any error messages.
* **Authentication:** Implements user authentication using JWT for secure access to file upload and management endpoints.
* **Password Security:** Stores user passwords securely using bcrypt hashing.
* **Input Validation:** Validates file uploads and user inputs (yet to be implemented).
* **Scalable Architecture:** The use of BullMQ for background tasks makes the service more scalable for handling a large number of file uploads and processing jobs.
* **Dockerized Setup:** Includes `docker-compose` for easy local setup of PostgreSQL and Redis dependencies.
* **API Documentation:** Provides comprehensive API documentation using Swagger/OpenAPI for easy integration and testing.

**Note:** Here inorder to mock the file processing, worker has 2 setTimouts added where the design is first timeout is to mock fetching large file contents and second timeout after fetching the file content is for time taken for analyzing the fetched data. 

## Local Setup (Development)

This guide assumes you have Docker and Docker Compose installed on your system.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/DevPatel210/fup-service
    cd fup-service
    ```

2.  **Set up Environment Variables:**

    Create a `.env` file in the root of the project based on the `.env.template` file and configure the necessary environment variables:

    ```env
    DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_database
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your_super_secret_key
    ```

    **Note:** The default `docker-compose.yml` sets up PostgreSQL and Redis on `localhost` with standard ports. Adjust the `DATABASE_URL` and `REDIS_URL` in your `.env` if you modify the Docker Compose configuration.

3.  **Start PostgreSQL and Redis using Docker Compose:**

    ```bash
    docker-compose up -d
    ```

    This command will start the PostgreSQL and Redis containers in the background.

4.  **Install Node.js Dependencies:**

    ```bash
    npm install
    ```

5.  **Configure Sequelize:**

    Ensure your `config/database.js` file is correctly configured to connect to the PostgreSQL instance running in Docker. The default configuration should work if you haven't changed the Docker Compose setup.

6.  **Automatic Syncing of Sequelize Models:**

    `app.js` includes `sequelize.sync()` which automatically create the tables:

    ```javascript
    // In app.js
    sequelize
      .authenticate()
      .then(() => {
        console.log('Database connection has been established successfully.');
        return sequelize.sync();
      })
      .then(() => {
        console.log('Database synced.');
        app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
    ```

7.  **Start the Backend Service:**

    ```bash
    npm run dev
    ```

    This will start your Node.js backend service.

8.  **Start the BullMQ Worker (in a separate terminal):**

    ```bash
    npm run worker
    ```

    This will start the worker process that listens to the BullMQ queue and processes background jobs.

9.  **Access API Documentation:**

    Once the service is running, you can access the Swagger API documentation at:

    ```
    http://localhost:3000/api-docs
    ```