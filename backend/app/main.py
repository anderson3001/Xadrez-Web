from fastapi import FastAPI
from pydantic import BaseModel
import chess
import random 

app = FastAPI()

class BoardRequest(BaseModel):
    fen: str 
@app.get("/")
def read_root():
    return {"status": "Chess Bot is running!"}

@app.post("/proxima-jogada")
def get_next_move(request: BoardRequest): #será modificado para fazer 
    board = chess.Board(request.fen)      #o calculo da melhor jogada por fora

    if board.is_game_over():
        return {"game_over": True}

    legal_moves = list(board.legal_moves)
    random_move = random.choice(legal_moves)

    return {
        "best_move": random_move.uci(),
        "game_over": False
    }