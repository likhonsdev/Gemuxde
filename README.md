# 💎 Gemuxde: Local AI for Termux

Gemuxde is a self-contained, mobile-first AI agent system designed to run entirely on your Android device via Termux. It combines a modern web interface with a powerful, locally-run language model, eliminating the need for external API calls or Docker dependencies.

## 🚀 Features

- **Modern Tech Stack**: Built with a Next.js frontend and a FastAPI (Python) backend.
- **Real-time Communication**: Uses WebSockets for instant, responsive interaction with the AI.
- **Local First**: All components, including the AI model, run directly on your device.
- **Termux Optimized**: Designed to be lightweight and work without root access on standard Termux installations.
- **Easy Setup**: A single script to install all dependencies and download the model.

## 🧠 The AI Model

This project uses **SmolLM3-3B**, a powerful 3-billion-parameter language model that is compact enough to run on mobile hardware. We use the GGUF quantized version (`SmolLM3-3B-Q5_K_M.gguf`) for optimal performance.

## 🛠️ Architecture

- **Frontend**: A Next.js application in the `gemuxde/frontend` directory. It provides a simple chat interface.
- **Backend**: A FastAPI server in the `gemuxde/backend` directory. It serves the AI model via a WebSocket endpoint.
- **Model Loading**: The backend uses the `llama-cpp-python` library to efficiently run the GGUF model on the CPU.

## 📋 Prerequisites

Before you begin, ensure you have the following installed in your Termux environment:

- **Python & Pip**: `pkg install python`
- **Node.js & NPM**: `pkg install nodejs`
- **Build Tools**: `pkg install build-essential cmake` (This is crucial for building the `llama-cpp-python` dependency).
- **Git**: `pkg install git`
- **Curl**: `pkg install curl`

### A Note on Dependencies

The most complex dependency is `llama-cpp-python`. The `setup.sh` script will try to install it automatically. However, depending on your Termux setup and device architecture, the installation might fail.

If you encounter issues during the `pip install` step, you may need to install it manually or consult the `llama-cpp-python` documentation for more specific instructions for your device. The `pkg install build-essential cmake` step is crucial, but other libraries might be required.

## ⚙️ Setup and Installation

A single script handles the entire setup process.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemuxde.git
    cd gemuxde
    ```
    *(Note: Replace the URL with the actual repository URL after creation.)*

2.  **Run the setup script:**
    This script will install all Python and Node.js dependencies and download the AI model (approx. 2.1 GB).

    **Important**: Run the script using `bash`, as it may not be executable by default.
    ```bash
    bash setup.sh
    ```

## ▶️ Running the Application

1.  **Start the servers:**
    Use the `run.sh` script to start both the backend and frontend servers.

    ```bash
    bash run.sh
    ```
    - The FastAPI backend will run on `http://localhost:8000`.
    - The Next.js frontend will be available at `http://localhost:3000`.
    - Logs for both servers are saved to `backend.log` and `frontend.log` respectively.

2.  **Access the application:**
    Open a web browser on your Android device and navigate to `http://localhost:3000`.

## ⏹️ Stopping the Application

To stop both the frontend and backend servers, use the `kill.sh` script:

```bash
bash kill.sh
```
This will read the process IDs from the `pids.txt` file and terminate the application.
