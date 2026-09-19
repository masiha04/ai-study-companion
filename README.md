# AI Study Companion

AI Study Companion is an AI-powered learning and growth workspace that helps students learn from their own study materials, interact with an AI tutor, take adaptive quizzes, track concept mastery, and receive personalized learning recommendations.

## 🚀 Overview

The application follows a continuous learning workflow:

**Create Space → Create Project → Add Learning Material → Process Material → Learn with AI Tutor → Take Quiz → Evaluate Understanding → Track Mastery → Analyze Growth → Get Recommendations**

The system uses Retrieval-Augmented Generation (RAG) to ground AI responses in the learning material uploaded to a project.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes

### 📚 Learning Spaces & Projects
- Create learning spaces
- Create projects inside spaces
- Add project descriptions and learning goals
- Project-level data isolation

### 📄 Learning Materials
- Upload PDF learning materials
- Background PDF processing
- Text extraction
- Page-aware document chunking
- Local embedding generation
- Material processing status tracking

### 🤖 AI Tutor
- Ask questions about uploaded learning material
- Retrieval-Augmented Generation (RAG)
- Relevant document chunks retrieved using semantic similarity
- AI responses grounded in project material
- Source information returned with tutor responses
- Refusal when sufficient relevant material cannot be found

### 📝 Adaptive Quiz
- AI-generated quizzes based on project material
- 4 multiple-choice questions
- 1 open-ended question
- Difficulty and concept information
- Structured AI-generated quiz data

### 📊 Assessment & Mastery
- Automatic MCQ evaluation
- AI evaluation of open-ended answers
- Score calculation
- Concept-level mastery tracking
- Mastery status:
  - Attention
  - Improving
  - Stable

### 💡 Learning Recommendations
- Identifies weaker concepts
- Generates a recommended next learning action
- Provides reasoning and priority
- Recommendations are connected to project mastery data

### 📈 Analytics
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

The AI Tutor uses a Retrieval-Augmented Generation pipeline.

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
Groq LLM
    ↓
Grounded AI Response
