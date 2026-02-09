import { useState, useRef } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, type Square } from 'chess.js'
import './App.css'
import Confetti from 'react-confetti'
import { CapturedPieces } from './CapturedPieces'

import { RefreshCw, Github, Linkedin, Instagram } from 'lucide-react'

function App() {
  const [game, setGame] = useState(new Chess())
  const [status, setStatus] = useState('Sua vez! (Brancas)')
  const [moveFrom, setMoveFrom] = useState('')
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({})
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white')
  const [lastMoveSquares, setLastMoveSquares] = useState<Record<string, any>>(
    {}
  )
  const [difficulty, setDifficulty] = useState('medium')

  const gameRef = useRef(0)

  function playSound(type: 'move' | 'capture' | 'gameover') {
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.play().catch((e) => console.log('Erro ao tocar som:', e))
  }

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square: square as Square,
      verbose: true,
    })

    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: Record<string, any> = {}

    moves.map((move) => {
      const targetPiece = game.get(move.to as Square)
      const sourcePiece = game.get(square as Square)

      const isCapture =
        targetPiece && sourcePiece && targetPiece.color !== sourcePiece.color

      newSquares[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, rgba(255,0,0,.5) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.5) 25%, transparent 25%)',
        borderRadius: '50%',
      }
      return move
    })

    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    }

    setOptionSquares(newSquares)
    return true
  }

  function onSquareClick(square: string) {
    if (square === moveFrom) {
      setMoveFrom('')
      setOptionSquares({})
      return
    }
    if (optionSquares[square]) {
      const move = onDrop(moveFrom, square, true)
      if (move) {
        setMoveFrom('')
        setOptionSquares({})
        return
      }
    }
    const piece = game.get(square as Square)

    if (piece && piece.color === playerColor[0]) {
      const hasMoves = getMoveOptions(square)
      if (hasMoves) setMoveFrom(square)
    } else {
      setMoveFrom('')
      setOptionSquares({})
    }
  }

  function onDrop(sourceSquare: string, targetSquare: string, isClick = false) {
    const piece = game.get(sourceSquare as Square)

    if (piece && piece.color !== playerColor[0]) {
      return false
    }

    
    try {
      const gameCopy = new Chess()
      gameCopy.loadPgn(game.pgn())
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })

      if (!move) return false

      const isPromotion =
        piece?.type === 'p' &&
        ((piece.color === 'w' && targetSquare[1] === '8') ||
         (piece.color === 'b' && targetSquare[1] === '1'))

      if (isPromotion) {
        if (!isClick) {
          return true
        }
      }

      setLastMoveSquares({
        [sourceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
        [targetSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
      })

      if (move.captured) {
        playSound('capture')
      } else {
        playSound('move')
      }

      setGame(gameCopy)
      setOptionSquares({})
      setMoveFrom('')

      if (gameCopy.isCheckmate()) {
        const winner = gameCopy.turn() === 'w' ? 'Pretas' : 'Brancas'
        setStatus(`Xeque-mate! ${winner} venceram.`)
        playSound('gameover')
      } else if (gameCopy.isDraw()) {
        setStatus('Empate! (Repetição ou Regras)')
        playSound('gameover')
      } else {
        setStatus('Pensando...')
        setTimeout(() => botPlay(gameCopy.fen(), gameCopy.pgn()), 250)
      }
      return true
    } catch (error) {
      return false
    }
  }

  function onPromotionPieceSelect(
    piece?: string,
    sourceSquare?: string,
    targetSquare?: string
  ) {
    const promotionPiece = piece ? piece[1].toLowerCase() : 'q'

    try {
      const gameCopy = new Chess()
      gameCopy.loadPgn(game.pgn())

      const move = gameCopy.move({
        from: sourceSquare!,
        to: targetSquare!,
        promotion: promotionPiece,
      })

      if (!move) return false

      setGame(gameCopy)

      setOptionSquares({})
      setMoveFrom('')

      if (gameCopy.isGameOver()) {
        setStatus('Fim de Jogo!')
      } else {
        setStatus('Pensando...')
        setTimeout(() => botPlay(gameCopy.fen(), gameCopy.pgn()), 250)
      }

      return true
    } catch (error) {
      return false
    }
  }

  function toggleOrientation() {
    gameRef.current += 1
    const newColor = playerColor === 'white' ? 'black' : 'white'
    setPlayerColor(newColor)

    const newGame = new Chess()
    setGame(newGame)
    setOptionSquares({})
    setMoveFrom('')
    setLastMoveSquares({})

    if (newColor === 'black') {
      setStatus('Bot pensando na abertura...')
      setTimeout(() => {
        botPlay(newGame.fen(), newGame.pgn())
      }, 500)
    } else {
      setStatus('Sua vez! (Brancas)')
    }
  }

  async function botPlay(fenAtual: string, pgnAtual: string) {
    const currentId = gameRef.current
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${API_URL}/proxima-jogada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: fenAtual,
          difficulty: difficulty,
        }),
      })
      const data = await response.json()

      if (currentId !== gameRef.current) return

      if (data.best_move) {
        const gameCopy = new Chess()
        gameCopy.loadPgn(pgnAtual)
        const move = gameCopy.move(data.best_move)

        setLastMoveSquares({
          [move.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
          [move.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
        })

        if (move && move.captured) {
          playSound('capture')
        } else {
          playSound('move')
        }
        setGame(gameCopy)

        if (gameCopy.isCheckmate()) {
          const winner = gameCopy.turn() === 'w' ? 'Pretas' : 'Brancas'
          setStatus(`Xeque-mate! ${winner} venceram.`)
          playSound('gameover')
        } else if (gameCopy.isDraw()) {
          setStatus('Empate! (Repetição ou Regras)')
          playSound('gameover')
        } else if (gameCopy.isCheck()) {
          setStatus('Cuidado: Xeque!')
        } else {
          setStatus('Sua vez!')
        }
      }
    } catch (error) {
      console.error('Erro:', error)
      setStatus('Erro ao conectar com o bot 😢')
    }
  }

  function undoMove() {
    setLastMoveSquares({})

    const gameCopy = new Chess()
    gameCopy.loadPgn(game.pgn())

    const move = gameCopy.undo()

    if (!move) return

    const myColorShort = playerColor === 'white' ? 'w' : 'b'

    if (gameCopy.turn() !== myColorShort) {
      gameCopy.undo()
    }

    setGame(gameCopy)
    setOptionSquares({})

    gameRef.current += 1
    setStatus('Sua vez!')
  }

  function resetGame() {
    gameRef.current += 1
    const newGame = new Chess()
    setGame(newGame)
    setOptionSquares({})
    setMoveFrom('')
    setLastMoveSquares({})

    if (playerColor === 'black') {
      setStatus('Bot pensando na abertura...')
      setTimeout(() => botPlay(newGame.fen(), newGame.pgn()), 500)
    } else {
      setStatus('Sua vez! (Brancas)')
    }
  }

  const isCheckmate = game.isCheckmate()
  const winnerColor = game.turn() === 'w' ? 'black' : 'white'
  const playerWon = isCheckmate && winnerColor === playerColor

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-area">
          <img
            src="/cavalo.png"
            alt="ChessBot Logo"
            style={{ width: '40px', height: 'auto', marginRight: '10px' }}
          />
          <h2 style={{ margin: 0 }}>ChessBot</h2>
        </div>

        <div className="buttons-area">
          <div className="controls-area">
            <label className="difficulty-label">Nível:</label>
            <select
              className="difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <button
            onClick={toggleOrientation}
            className="action-button"
            style={{ backgroundColor: '#6c757d' }}
          >
            {playerColor === 'white'
              ? 'Jogar de Pretas ♟️'
              : 'Jogar de Brancas ♔'}
          </button>

          <button
            onClick={resetGame}
            className="action-button"
            style={{ backgroundColor: '#4a90e2' }}
          >
            <RefreshCw size={18} style={{ marginRight: '8px' }} />
            Reiniciar
          </button>
        </div>
      </header>

      <main className="main-content">
        {playerWon && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
          />
        )}

        <div className="status-card">{status}</div>

        <div className="board-area">
          <div className="board-top-bar">
            <CapturedPieces game={game} color={playercolor === 'white' ? 'w' : 'b'} />

            <button
              onClick={undoMove}
              className="toolbar-btn"
              disabled={game.history().length === 0}
            >
              ↩ Desfazer
            </button>
          </div>
          <div className="board-wrapper">
            <Chessboard
              id="BasicBoard"
              position={game.fen()}
              onPieceDrop={(source, target) => onDrop(source, target, false)}
              onSquareClick={onSquareClick}
              boardOrientation={playerColor}
              arePiecesDraggable={!status.includes('Pensando')}
              customSquareStyles={{
                ...lastMoveSquares,
                ...optionSquares,
              }}
              onPromotionPieceSelect={onPromotionPieceSelect}
            />
          </div>
          <div className="board-bottom-bar">
            <CapturedPieces game={game} color={playercolor === 'white' ? 'b' : 'w'} />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>
          Desenvolvido por <strong>Anderson Gomes</strong>
        </p>

        <div className="social-links">
          <a
            href="https://github.com/anderson3001"
            target="_blank"
            className="social-link"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/andersonsgomes"
            target="_blank"
            className="social-link"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://instagram.com/andersonn_sgomes"
            target="_blank"
            className="social-link"
          >
            <Instagram size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
