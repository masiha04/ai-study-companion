# AI Study Companion

AI Study Companion is an AI-powered learning and growth workspace that helps students learn from their own study materials, interact with an AI tutor, take adaptive quizzes, track concept mastery, analyze learning progress, and receive personalized learning recommendations.

The project combines a React frontend, Node.js/Express backend, MongoDB, Retrieval-Augmented Generation (RAG), local embeddings, and an LLM-powered learning workflow.

---

## 🚀 Overview

The application follows a continuous learning workflow:

**Create Space → Create Project → Add Learning Material → Process Material → Learn with AI Tutor → Take Quiz → Evaluate Understanding → Track Mastery → Analyze Growth → Get Recommendations**

The system uses Retrieval-Augmented Generation (RAG) to ground AI responses in learning material uploaded to a specific project.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-level data isolation

### 📚 Learning Spaces & Projects

- Create learning spaces
- Create projects inside spaces
- Add project descriptions
- Define learning goals
- Project-level data isolation

### 📄 Learning Materials

- Upload PDF learning materials
- Background PDF processing
- PDF text extraction
- OCR fallback for scanned documents
- Page-aware document chunking
- Local embedding generation
- Material processing status tracking

### 🤖 AI Tutor

- Ask questions about uploaded learning material
- Retrieval-Augmented Generation (RAG)
- Semantic similarity-based retrieval
- Project-specific context retrieval
- Grounded AI responses
- Source information returned with responses
- Refusal when sufficient relevant information cannot be found

### 📝 Adaptive Quiz

- AI-generated quizzes based on project learning material
- 4 multiple-choice questions
- 1 open-ended question
- Concept information
- Difficulty information
- Structured AI-generated quiz output

### 📊 Assessment & Mastery

- Automatic MCQ evaluation
- AI evaluation of open-ended answers
- Score calculation
- Concept-level mastery tracking
- Attempt tracking
- Correct-answer tracking
- Last-score tracking

Mastery status is categorized as:

- **Attention**
- **Improving**
- **Stable**

### 💡 Learning Recommendations

- Identifies weaker concepts
- Generates a recommended next learning action
- Provides reasoning
- Provides recommendation priority
- Connects recommendations to project mastery data

### 📈 Analytics

The analytics system tracks:

- Average mastery
- Average quiz score
- Total activities
- Total assessments
- Total concepts
- Concepts requiring attention
- Improving concepts
- Recent assessments
- Recent learning activities

---

## 🧠 RAG Pipeline

The AI Tutor uses a Retrieval-Augmented Generation pipeline to ground responses in uploaded learning material.

```text
PDF Upload
    ↓
PDF Text Extraction
    ↓
Page-Aware Chunking
    ↓
Local Embedding Generation
    ↓
Vector Representation
    ↓
User Question
    ↓
Question Embedding
    ↓
Cosine Similarity Search
    ↓
Top Relevant Chunks
    ↓
Project-Specific Context
    ↓
Groq LLM
    ↓
Grounded AI Response
```

### Retrieval Process

When a user asks the AI Tutor a question:

1. The question is converted into an embedding.
2. Stored document chunks for the current project are retrieved.
3. Cosine similarity is used to compare the question with stored chunks.
4. The most relevant chunks are selected.
5. The retrieved context is provided to the LLM.
6. The LLM generates a response grounded in the retrieved material.
7. Source information is returned with the response.

Retrieval is restricted using:

```text
Authenticated User
        +
Project ID
```

This prevents the Tutor from retrieving learning material from another user's project.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

### AI / RAG

- Groq
- `openai/gpt-oss-20b`
- `Xenova/all-MiniLM-L6-v2`
- `@huggingface/transformers`
- Cosine similarity
- Retrieval-Augmented Generation

### Document Processing

- `pdf-parse`
- Poppler
- Tesseract OCR

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │    React Client     │
                         │      Vite + React   │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │   Express Server    │
                         │      Node.js        │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐   ┌────────────────┐   ┌──────────────┐
        │   MongoDB    │   │  RAG Pipeline  │   │   Groq LLM   │
        │              │   │                │   │              │
        │ Users        │   │ PDF Processing │   │ AI Tutor     │
        │ Spaces       │   │ Chunking       │   │ Quiz         │
        │ Projects     │   │ Embeddings     │   │ Assessment   │
        │ Materials    │   │ Retrieval      │   │ Recommend.   │
        │ Quizzes      │   │ Similarity     │   │              │
        │ Assessments  │   │                │   │              │
        │ Mastery      │   └────────────────┘   └──────────────┘
        │ Activities   │
        │ Recommend.   │
        └──────────────┘
```

---

## 🔄 Complete Learning Workflow

```text
Create Space
      ↓
Create Project
      ↓
Upload Learning Material
      ↓
Process PDF
      ↓
Generate Chunks + Embeddings
      ↓
Ask AI Tutor
      ↓
Retrieve Relevant Context
      ↓
Generate Grounded Answer
      ↓
Generate Quiz
      ↓
Submit Quiz
      ↓
Evaluate Answers
      ↓
Update Concept Mastery
      ↓
Analyze Learning Progress
      ↓
Generate Recommendation
      ↓
Continue Learning
```

---

## 📁 Project Structure

```text
ai-study-companion/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Mastery.jsx
│   │   │   ├── Materials.jsx
│   │   │   ├── ProjectDashboard.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── Recommendation.jsx
│   │   │   ├── Spaces.jsx
│   │   │   └── Tutor.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Space.js
│   │   ├── Project.js
│   │   ├── Material.js
│   │   ├── Chunk.js
│   │   ├── Quiz.js
│   │   ├── Assessment.js
│   │   ├── Mastery.js
│   │   ├── Activity.js
│   │   └── Recommendation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── spaceRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── retrievalRoutes.js
│   │   ├── tutorRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── masteryRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── analyticsRoutes.js
│   ├── services/
│   │   ├── embeddingService.js
│   │   ├── groqService.js
│   │   └── retrievalService.js
│   ├── scripts/
│   │   └── embedExistingChunks.js
│   ├── utils/
│   │   ├── chunker.js
│   │   ├── cosineSimilarity.js
│   │   └── pdfExtractor.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> `server/uploads/` is excluded from Git using `.gitignore`.

---

## ⚙️ Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git
- Poppler
- Tesseract OCR

### 1. Clone the Repository

```bash
git clone https://github.com/masiha04/ai-study-companion.git
cd ai-study-companion
```

### 2. Backend Setup

Navigate to the server:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
npm start
```

The backend normally runs at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

## 🗄️ Database

The application uses MongoDB for persistent data storage.

The main collections include:

```text
users
spaces
projects
materials
chunks
quizzes
assessments
masteries
activities
recommendations
```

MongoDB is accessed through Mongoose.

---

## 🔑 Environment Variables

The backend uses environment variables for sensitive configuration.

Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### Important

Never commit real API keys, passwords, JWT secrets, or database credentials to GitHub.

Environment files are excluded using `.gitignore`.

---

## 🔐 Security

The application includes several access-control mechanisms.

### Authentication

Protected API routes require a JWT:

```text
Authorization: Bearer <JWT>
```

### Password Security

Passwords are hashed using:

```text
bcryptjs
```

### User Isolation

Database operations use the authenticated user's ID.

### Project Isolation

RAG retrieval is restricted by:

```text
userId + projectId
```

Therefore, the AI Tutor only retrieves chunks belonging to the authenticated user's current project.

### Space Ownership

Projects can only be created inside spaces owned by the authenticated user.

---

## 📚 API Modules

| Endpoint | Purpose |
|---|---|
| `/api/auth` | Registration and login |
| `/api/spaces` | Learning spaces |
| `/api/projects` | Projects |
| `/api/materials` | PDF learning materials |
| `/api/retrieval` | Retrieval operations |
| `/api/tutor` | AI Tutor |
| `/api/quizzes` | Quiz generation and retrieval |
| `/api/assessments` | Quiz assessment |
| `/api/mastery` | Concept mastery |
| `/api/recommendations` | Learning recommendations |
| `/api/analytics` | Learning analytics |

---

## 📝 Quiz & Assessment Flow

```text
Project Learning Material
        ↓
Retrieve Relevant Chunks
        ↓
AI Quiz Generation
        ↓
4 MCQs + 1 Open Question
        ↓
Student Submission
        ↓
MCQ Evaluation
        +
Open-Ended Answer Evaluation
        ↓
Score Calculation
        ↓
Concept Mastery Update
        ↓
Analytics Update
```

---

## 📊 Concept Mastery

Assessment results update concept-level mastery.

The system tracks:

- Concept
- Mastery score
- Attempts
- Correct answers
- Last score
- Current status

Mastery status is determined from the score:

```text
Below 50  → Attention
50–74     → Improving
75+       → Stable
```

Existing concept mastery is updated using a weighted combination of previous mastery and the latest assessment score.

---

## 💡 Recommendation Flow

The recommendation system uses concept mastery data to identify concepts requiring additional attention.

```text
Mastery Data
     ↓
Identify Weakest Concept
     ↓
Generate Recommendation
     ↓
Title
Reason
Action
Priority
```

This provides the learner with a concrete next learning action.

---

## 📈 Analytics Flow

The analytics system combines:

```text
Activities
Assessments
Mastery
```

to provide project-level learning insights.

The dashboard can display:

- Average mastery
- Average quiz score
- Total activities
- Total assessments
- Total concepts
- Attention areas
- Improving concepts
- Recent assessments
- Recent activities

---

## 🧪 Error Handling

The application includes error handling across major frontend and backend workflows.

Examples include:

- Invalid authentication
- Missing PDF files
- Unsupported file types
- Invalid projects
- Unauthorized project access
- Missing learning materials
- Invalid quiz structures
- Invalid assessment submissions
- AI generation errors
- Material processing failures
- API loading errors

Material processing also tracks:

```text
queued
   ↓
processing
   ↓
ready

or

failed
```

---

## 🚀 Future Improvements

Potential future improvements include:

- Production-grade background job queues
- Dedicated vector database
- More advanced semantic retrieval
- Persistent AI Tutor conversation history
- More advanced adaptive quiz generation
- Improved personalization
- More detailed learning analytics
- Admin dashboard
- Automated unit and integration testing
- Cloud deployment
- Support for additional document formats
- Improved OCR processing
- Streaming AI responses
- Advanced learning paths
- Notification system

---

## 🎯 Project Objective

The objective of AI Study Companion is to demonstrate how AI can be integrated into a complete learning workflow rather than functioning only as a standalone chatbot.

The system connects:

```text
Learning Material
       ↓
AI Understanding
       ↓
Practice
       ↓
Assessment
       ↓
Mastery
       ↓
Analytics
       ↓
Recommendation
       ↓
Continued Learning
```

This creates a continuous learning and growth loop.

---

## 📌 Project Status

**Prototype completed for an AI Full Stack Engineer assessment challenge.**

The current implementation demonstrates:

- Authentication
- Learning spaces
- Projects
- PDF learning materials
- Background document processing
- OCR fallback
- Page-aware chunking
- Local embeddings
- RAG-based retrieval
- Grounded AI Tutor
- AI-generated quizzes
- Assessment and scoring
- Concept mastery
- Learning recommendations
- Project analytics
- User and project data isolation

---

## 👩‍💻 Author

### Masiha Tabassum

CSE Undergraduate  
RGUKT–IIIT Ongole

GitHub:

https://github.com/masiha04

---

## ⭐ Project Repository

GitHub Repository:

https://github.com/masiha04/ai-study-companion
