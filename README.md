<div align="center">

# 📸 VisionCraft AI - Commercial Product Photography SaaS
![VisionCraft Banner](https://img.shields.io/badge/Status-Beta%20v1.5-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20|%20Gemini%202.5%20|%20Bun-purple?style=for-the-badge)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Orchestration-LangGraph-FF4B4B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Runtime-Bun%20v1.1-000000?style=for-the-badge&logo=bun&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Hono-E36002?style=for-the-badge&logo=hono&logoColor=white" />
</p>

</div>

**VisionCraft** is an autonomous AI studio that transforms raw, amateur product photos into professional commercial assets. Unlike basic AI wrappers, it uses **Edge-based Background Removal** and **Composite Layering** to generate high-conversion marketing content without hallucinations.
---

## ⚡ What is VisionCraft?

VisionCraft uses a "Vision-to-Execution" pipeline powered by **Google's Gemini 2.5 Flash** to analyze brand identity and generate hyper-realistic marketing scenery. It solves the biggest problem in GenAI—consistency—by compositing the original product pixels *over* the generated scene.

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| ✂️ **Smart Cutout** | Instantly removes backgrounds using **WebAssembly** (runs 100% in-browser via `@imgly/background-removal`). |
| 🛡️ **Composite Layering** | Eliminates AI hallucinations (misspelled logos) by compositing the **original product** over the AI scene. |
| 🕰️ **Session History** | Auto-saves every generation to a local gallery. Browse, restore, and edit past creations instantly. |
| 🧠 **The Brain** | Autonomous Prompt Engineering that enforces brand constraints while designing lighting and texture. |
| 🎨 **The Artist** | Renders 8k resolution assets using **Gemini 2.5 Flash Image** (Imagen 3). |
---

* * *
## 📸 Real Results

<div align="center">

| **Raw Input** | **AI Vision + Generation Result** |
| :---: | :---: |
| <img src="https://driftbasket.com/wp-content/uploads/2022/06/monster-e1692443093805.jpg" width="250" /> | <img src="https://github.com/user-attachments/assets/371bc67e-d3e5-4820-9d72-c51956392b95" width="250" /> |
| *Original Photo* | *"On a neon-lit gaming desk"* |

</div>
* * *

\## \\## 🏗️ Architecture

The system operates on a specialized \\\*\\\*Agentic Workflow\\\*\\\*:

\\\`\\\`\\\`mermaid
graph LR
  A\[User Upload\] -->|WASM| B(Background Removal);
  B -->|Clean Cutout| C(Vision Node);
  C -->|Extracts Brand & Context| D(Prompt Engineer);
  D -->|Synthesizes Scene| E(Generation Node);
  E -->|Background Image| F{Composite Engine};
  B -->|Original Pixels| F;
  F -->|Final Render| G\[Commercial Asset\];
  
  style B fill:#ffecb3,stroke:#ff6f00
  style F fill:#e1f5fe,stroke:#01579b
  style G fill:#f3e5f5,stroke:#4a148c

**Tech Stack:**

*   **Core AI:** Google Gemini 2.5 Flash & Flash-Image
    
*   **Backend:** Bun (Runtime) + Hono (High-performance API)
    
*   **Frontend:** Next.js + React

*   **Processing:** @imgly/background-removal (Edge Computing)
    
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



## 🛡️ License

This project is open-source and available under the **MIT License**.
