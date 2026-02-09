from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.engine.bot import calculate_best_move

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BoardRequest(BaseModel):
    fen: str 
    difficulty: str = "medium"

@app.api_route("/", methods=["GET", "HEAD"])
def read_root():
    return {"status": "Chess Bot is running!"}

@app.post("/proxima-jogada")
def get_next_move(request: BoardRequest):
    difficulty_map = {
        "easy": 1,
        "medium": 3,
        "hard": 4
    }

    depth = difficulty_map.get(request.difficulty, 3)

    best_moviment = calculate_best_move(request.fen, depth=depth)

    if best_moviment is None:
        return {"game_over": True}

    return {
        "best_move": best_moviment,
        "game_over": False
    }