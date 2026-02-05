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
    
def find_best_move(board: chess.Board, depth: int):
    best_move = None
    
    is_maximizing = board.turn == chess.WHITE
    best_eval = -float('inf') if is_maximizing else float('inf')

    for move in board.legal_moves:
        board.push(move)

        current_eval = minimax(board, depth - 1, not is_maximizing)
        board.pop()
        if is_maximizing:
            if current_eval > best_eval:
                best_eval = current_eval
                best_move = move
        else:
            if current_eval < best_eval:
                best_eval = current_eval
                best_move = move

    return best_move