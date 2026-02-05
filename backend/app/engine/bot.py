import chess 

from app.engine.search import find_best_move

def calculate_best_move(fen: str):
    board = chess.Board(fen)

    if board.is_game_over():
        return None
  
    best_move = find_best_move(board, depth=3)

    if best_move:
        return best_move.uci()

    return list(board.legal_moves)[0].uci()