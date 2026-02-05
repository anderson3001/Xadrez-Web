import chess
from app.engine.eval import evaluate_board

def minimax(board: chess.Board, depth: int, is_maximizing: bool):
    if depth == 0 or board.is_game_over():
        return evaluate_board(board)
    
    if is_maximizing:
        max_eval = -float('inf')

        for move in board.legal_moves:
            board.push(move)

            eval = minimax(board, depth - 1, False)
            board.pop()

            max_eval = max(max_eval, eval)

        return max_eval
    else:
        min_eval = float('inf')

        for move in board.legal_moves:
            board.push(move)

            eval = minimax(board, depth - 1, True)
            board.pop()

            min_eval = min(min_eval, eval)

        return min_eval