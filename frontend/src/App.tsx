import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

import { RefreshCw, Github, Linkedin, Instagram } from 'lucide-react'

function App() {
  const [game, setGame] = useState(new Chess())
  const [status, setStatus] = useState("Sua vez! (Brancas)")

  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      const gameCopy = new Chess(game.fen())
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })

      if (!move) return false

      setGame(gameCopy)
      
      if(gameCopy.isGameOver()) {
        setStatus("Fim de Jogo!")
      } else {
        setStatus("Pensando...")
        setTimeout(() => botPlay(gameCopy.fen()), 250)
      }
      return true
    } catch (error) {
      return false
    }
  }

  async function botPlay(fenAtual: string) {
    try {
      const response = await fetch('http://localhost:8000/proxima-jogada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: fenAtual })
      })
      const data = await response.json()

      if (data.best_move) {
        setGame(g => {
            const gameCopy = new Chess(g.fen())
            gameCopy.move(data.best_move)

            if (gameCopy.isCheckmate()) setStatus("Xeque-mate! Você perdeu.")
            else if (gameCopy.isDraw()) setStatus("Empate!")
            else if (gameCopy.isCheck()) setStatus("Cuidado: Xeque!")
            else setStatus("Sua vez!")
            
            return gameCopy
        })
      }
    } catch (error) {
      console.error('Erro:', error)
      setStatus("Erro ao conectar com o bot 😢")
    }
  }

  function resetGame() {
    setGame(new Chess())
    setStatus("Sua vez!")
  }

  return (
    <div style={styles.appContainer}>
      
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <span style={{fontSize: '2rem'}}>♟️</span>
          <h2 style={{margin: 0, marginLeft: '10px'}}>ChessBot</h2>
        </div>
        
        <button onClick={resetGame} style={styles.resetButton}>
          <RefreshCw size={18} style={{marginRight: '8px'}} />
          Reiniciar Jogo
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.statusCard}>
          {status}
        </div>

        <div style={styles.boardWrapper}>
          {/* @ts-ignore */}
          <Chessboard 
            id="BasicBoard"
            position={game.fen()} 
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </main>

      <footer style={styles.footer}>
        <p>Desenvolvido por <strong>Anderson Gomes</strong></p>
        <div style={styles.socialLinks}>
          <a href="https://github.com/anderson3001" target="_blank" style={styles.link}>
            <Github size={24} />
          </a>
          <a href="https://linkedin.com/in/andersonsgomes" target="_blank" style={styles.link}>
            <Linkedin size={24} />
          </a>
          <a href="https://instagram.com/andersonn_sgomes" target="_blank" style={styles.link}>
            <Instagram size={24} />
          </a>
        </div>
      </footer>

    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: '#282c34',
    color: 'white',
    fontFamily: 'Nunito, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#21252b',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: '900',
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  statusCard: {
    marginBottom: '20px',
    padding: '10px 30px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '50px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  boardWrapper: {
    width: '450px',
    height: '450px',
    maxWidth: '90vw',
  },
  footer: {
    backgroundColor: '#21252b',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  link: {
    color: '#abb2bf',
    transition: 'color 0.2s',
    textDecoration: 'none',
  }
};

export default App;