<div align="center">

# 📸 VisionCraft AI
### Autonomous Commercial Product Photography Agent

![VisionCraft Demo](https://via.placeholder.com/800x400?text=VisionCraft+Dashboard+Screenshot+Here)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Orchestration-LangGraph-FF4B4B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Runtime-Bun%20v1.1-000000?style=for-the-badge&logo=bun&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Hono-E36002?style=for-the-badge&logo=hono&logoColor=white" />
</p>

</div>

---

## ⚡ What is VisionCraft?

**VisionCraft** is an autonomous multi-agent system that transforms raw, amateur product photos into professional commercial assets. It uses a "Vision-to-Execution" pipeline powered by **Google's Gemini 2.5 Flash** to analyze brand identity and generate hyper-realistic marketing scenery.

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 👁️ **The Eye** | Uses **Gemini 2.5 Flash** to scan products, identifying logos, materials, and colors with 99% accuracy. |
| 🧠 **The Brain** | Autonomous Prompt Engineering that enforces brand constraints while designing lighting and texture. |
| 🎨 **The Artist** | Renders 8k resolution assets using **Gemini 2.5 Flash Image** (Imagen 3). |
| 🤖 **The Agent** | Self-correcting **LangGraph** workflow that passes data between nodes. |

---

## 📸 Real Results

## 

<div align="center">

| Raw Input | AI Vision + Generation Result |
| --- | --- |
| <img src="https://www.google.com/search?q=https://driftbasket.com/wp-content/uploads/2022/06/monster-e1692443093805.jpg" width="250" /> | <img src="https://www.google.com/search?q=https://via.placeholder.com/250x300%3Ftext%3DPaste%2BYour%2BResult%2BLink%2BHere" width="250" /> |
| Original Photo | "On a neon-lit gaming desk" |

</div>

## \## 🏗️ Architecture

The system operates on a specialized \*\*Agentic Workflow\*\*:

\`\`\`mermaid
graph LR
    A\[User Upload\] --> B(Vision Node);
    B -->|Extracts Brand & Material| C(Prompt Engineer Node);
    C -->|Synthesizes Scene| D(Generation Node);
    D -->|Renders Asset| E\[Final Commercial Image\];
    style B fill:#e1f5fe,stroke:#01579b
    style D fill:#f3e5f5,stroke:#4a148c

**Tech Stack:**

*   **Core AI:** Google Gemini 2.5 Flash & Flash-Image
    
*   **Backend:** Bun (Runtime) + Hono (High-performance API)
    
*   **Frontend:** Next.js + React
    
*   **Logic:** LangChain.js + LangGraph
    

* * *

## ⚡ Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) installed (`powershell -c "irm bun.sh/install.ps1 | iex"` on Windows)
    
*   A **Google Gemini API Key** (Free tier supports Gemini 2.5 Flash)
    

### Installation

1.  **Clone the Repository**
    
    Bash
    
        git clone [https://github.com/HARJAPAN2005/visioncraft-ai.git](https://github.com/HARJAPAN2005/visioncraft-ai.git)
        cd visioncraft-ai
    
2.  **Install Dependencies**
    
    Bash
    
        # Install Backend Deps
        cd backend
        bun install
        
        # Install Frontend Deps
        cd ../frontend
        bun install
    
3.  Environment Setup
    
    Create a .env file in the backend/ folder:
    
    Code snippet
    
        GOOGLE_API_KEY=your_gemini_api_key_here
    

### Running the App

You need to run the Frontend and Backend simultaneously. Open two terminals:

**Terminal 1 (Backend Agent):**

Bash

    cd backend
    bun run dev

**Terminal 2 (Frontend UI):**

Bash

    cd frontend
    bun run dev

Open your browser to `http://localhost:3001` to start creating!

* * *

## 📸 Usage Example

| Input (Raw Photo) | Prompt | Output (VisionCraft Result) |
| --- | --- | --- |
| <img src="https://driftbasket.com/wp-content/uploads/2022/06/monster-e1692443093805.jpg" width="150"> | "On a neon-lit gaming desk" | <img src="<img width="1024" height="1024" alt="Image" src="https://github.com/user-attachments/assets/1d42d0d6-890f-4abc-a4ba-c39c43a876d8" />" width="150"> |

_Note: The system automatically detected the "Monster Energy" logo and "Mango Loco" flavor text without user input._

* * *

## 🛡️ License

This project is open-source and available under the **MIT License**.
