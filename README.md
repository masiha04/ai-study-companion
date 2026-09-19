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
