import chess 
import random

def calculate_best_move(fen: str):
    board = chess.Board(fen)

    if board.is_game_over():
        return None

    legal_moves = list(board.legal_moves)
    best_move = random.choice(legal_moves)

    return best_move.uci()