import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from llama_cpp import Llama
import asyncio

app = FastAPI()

# Configuration
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
MODEL_PATH = os.path.join(MODEL_DIR, "SmolLM3-3B-Q5_K_M.gguf") # Placeholder

# Load the model
llm = None
if os.path.exists(MODEL_PATH):
    try:
        llm = Llama(model_path=MODEL_PATH, n_ctx=2048)
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print(f"Model not found at {MODEL_PATH}")


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    await manager.send_personal_message("Welcome to Gemuxde AI!", websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if llm:
                # Stream the response
                response_stream = llm(data, max_tokens=150, stream=True)
                full_response = ""
                for output in response_stream:
                    token = output['choices'][0]['text']
                    await manager.send_personal_message(token, websocket)
                    full_response += token
            else:
                await manager.send_personal_message("Model not loaded. Please check the server logs.", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A user has left the chat")
