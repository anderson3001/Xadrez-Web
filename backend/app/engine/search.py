import chess
from app.engine.eval import evaluate_board

piece_values = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}


def move_score(board, move):
    if board.is_capture(move):
        victim_piece = board.piece_at(move.to_square)
        aggressor_piece = board.piece_at(move.from_square)

        if victim_piece:
            victim_value = piece_values[victim_piece.piece_type]
        elif board.is_en_passant(move):
            victim_value = 1
        else:
            return 0

        aggressor_value = piece_values[aggressor_piece.piece_type]

        return 100 + victim_value - (aggressor_value / 100)
    return 0


def minimax(
    board: chess.Board, depth: int, alpha: float, beta: float, is_maximizing: bool
):
    if board.is_game_over():
        if board.is_checkmate():
            if board.turn == chess.WHITE:
                return -100000 - depth
            else:
                return 100000 + depth
        return evaluate_board(board)

    if depth == 0:
        return evaluate_board(board)

    ordered_moves = list(board.legal_moves)
    ordered_moves.sort(key=lambda m: move_score(board, m), reverse=True)

    if is_maximizing:
        max_eval = -float("inf")

        for move in ordered_moves:
            board.push(move)

            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()

            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)

            if beta <= alpha:
                break

        return max_eval
    else:
        min_eval = float("inf")

        for move in ordered_moves:
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

    alpha = -float("inf")
    beta = float("inf")

    ordered_moves = list(board.legal_moves)
    ordered_moves.sort(key=lambda m: move_score(board, m), reverse=True)

    if is_maximizing:
        best_eval = -float("inf")
        for move in ordered_moves:
            board.push(move)

            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()

            if eval > best_eval:
                best_eval = eval
                best_move = move

            alpha = max(alpha, eval)

    else:
        best_eval = float("inf")
        for move in ordered_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, True)
            board.pop()

            if eval < best_eval:
                best_eval = eval
                best_move = move

            beta = min(beta, eval)

    return best_move
