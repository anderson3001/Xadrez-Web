from fastapi import FastAPI
from pydantic import BaseModel
import chess
import random 
from engine.bot import calculate_best_move

app = FastAPI()

class BoardRequest(BaseModel):
    fen: str 
@app.get("/")
def read_root():
    return {"status": "Chess Bot is running!"}

@app.post("/proxima-jogada")
def get_next_move(request: BoardRequest):
    best_moviment = calculate_best_move(request.fen)

    if best_moviment is None:
        return {"game_over": True}

    return {
        "best_move": best_moviment,
        "game_over": False
    }