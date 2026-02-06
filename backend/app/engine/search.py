import chess
from app.engine.eval import evaluate_board

def minimax(board: chess.Board, depth: int, alpha: float, beta: float, is_maximizing: bool):
    if board.is_game_over():
        if board.is_checkmate():
            if board.turn == chess.WHITE:
                return -100000 - depth 
            else:
                return 100000 + depth
        return evaluate_board(board)

    if depth == 0:
        return evaluate_board(board)
    
    if is_maximizing:
        max_eval = -float('inf')

        for move in board.legal_moves:
            board.push(move)

            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()

            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)

            if beta <= alpha:
                break

        return max_eval
    else:
        min_eval = float('inf')

        for move in board.legal_moves:
            board.push(move)

            eval = minimax(board, depth - 1, alpha, beta, True)
            board.pop()

            min_eval = min(min_eval, eval)
            beta = min(beta, eval)

            if beta <= alpha:
                break

        return min_eval
    
def find_best_move(board: chess.Board, depth: int):
    best_move = None
    
    is_maximizing = board.turn == chess.WHITE

    alpha = -float('inf')
    beta = float('inf')

    if is_maximizing:
        best_eval = -float('inf')
        for move in board.legal_moves:
            board.push(move)

            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()

            if eval > best_eval:
                best_eval = eval
                best_move = move

            alpha = max(alpha, eval)
            
    else:
        best_eval = float('inf')
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, True)
            board.pop()

            if eval < best_eval:
                best_eval = eval
                best_move = move

            beta = min(beta, eval)

    return best_move