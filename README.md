# ZenVA

ZenVA is a customizable AI voice assistant platform. Users can register, sign in, personalize their assistant's name and image, and interact with the assistant using voice commands.

## Project Structure

```
ZenVA/
├── client/                        # Frontend React app (Vite, TailwindCSS, etc.)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Backend Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── models/
│   │   │   └── user.model.js
│   │   ├── routers/
│   │   │   ├── auth.route.js
│   │   │   └── user.route.js
│   │   └── utils/
│   │       └── cloudinary.js
│   ├── uploads/                   # Local uploads (if any)
│   ├── gemini.js                  # Gemini API integration
│   ├── index.js                   # Main server entry point
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── README.md                      # Project documentation
└──

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Gemini API key (for AI responses)

### Setup

1. **Clone the repository**
2. **Install dependencies**

   - For server:
     ```sh
     cd server
     npm install
     ```
   - For client:
     ```sh
     cd client
     npm install
     ```

3. **Configure environment variables**

   Create a `.env` file in the `server/` directory:

   ```
   PORT=8080
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the server**

   ```sh
   cd server
   npm start
   ```

5. **Run the client**

   ```sh
   cd client
   npm run dev
   ```

---

## API Endpoints

### Auth Routes (`/api/auth`)

- **POST `/signup`**  
  Register a new user.  
  **Body:**  
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
  **Response:**  
  ```json
  {
    "message": "User created successfully!",
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "..."
  }
  ```

- **POST `/signin`**  
  Login with email and password.  
  **Body:**  
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
  **Response:**  
  ```json
  {
    "message": "Login successful!",
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "..."
  }
  ```

---

### User Routes (`/api/user`)

> All `/user` routes require an `Authorization: Bearer <token>` header.

- **GET `/current`**  
  Get the current authenticated user's data.  
  **Response:**  
  ```json
  {
    "_id": "...",
    "name": "...",
    "email": "...",
    "assistantImage": "...",
    "assistantName": "...",
    ...
  }
  ```

- **POST `/update-assistant`**  
  Update assistant's name and image.  
  **Form Data:**  
  - `assistantName`: string (required)
  - `assistantImage`: file (optional, image upload)
  - `imageURL`: string (optional, for preset images)

  **Response:**  
  ```json
  {
    "_id": "...",
    "name": "...",
    "email": "...",
    "assistantImage": "...",
    "assistantName": "...",
    ...
  }
  ```

- **POST `/ask-to-assistant`**  
  Send a command to the assistant and get a response.  
  **Body:**  
  ```json
  {
    "command": "What is the weather today?"
  }
  ```
  **Response:**  
  ```json
  {
    "type": "weather_show",
    "command": "...",
    "response": "Here's the weather for today..."
  }
  ```

---

## File Uploads

Uploaded assistant images are stored in the `/uploads` directory and uploaded to Cloudinary.

---

## Technologies Used

- Node.js, Express, MongoDB, Mongoose
- React, Vite, TailwindCSS
- Cloudinary (image hosting)
- Gemini API (AI assistant)
- JWT (authentication)
- Multer (file uploads)

---

## License

MIT

---

## Author

ZenVA Team
