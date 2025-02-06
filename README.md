# Ai-Agent-Todo

## Overview
This AI Agent is built using the Gemini API, enabling users to perform CRUD operations on a To-Do list through natural language prompts. The AI understands user input and executes the corresponding Create, Read, Update, and Delete operations seamlessly.

## Features
- 🚀 **AI-Powered To-Do Management**: Uses Gemini API to interpret and process CRUD operations based on user input.
- ✅ **CRUD Functionality**: Create, Read, Update, and Delete tasks in a MongoDB database.
- ⚡ **Express Backend**: Handles API requests and integrates with the AI agent.
- 🛢 **Mongoose Integration**: Manages database interactions with MongoDB.
- 🏗 **TypeScript Support**: Ensures type safety and better code maintainability.

## Tech Stack
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **AI API**: Gemini API
- **Language**: TypeScript

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/)

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/VinaySingh1045/Ai-Agent-Todo.git
   cd Ai-Agent-Todo
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   GEMINI_API_KEY=your_api_key_here
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
   Also Provided the `.env.sample` file for easy access

4. **Start the development server:**
   ```sh
   npm run dev
   ```

## Usage
- Send a prompt like **"Add a task to buy groceries"** to the AI, and it will automatically create a new To-Do.
- Use similar prompts to **read, update, or delete** tasks.

## Contributing
🙌 Contributions are welcome! Feel free to fork this repository and submit pull requests for improvements.

## License
📜 This project is licensed under the **MIT License**.

---

👨‍💻 **Author:** Vinay Singh

