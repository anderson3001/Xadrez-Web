import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

function App() {
  const [game, setGame] = useState(new Chess())
  
  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      console.log(`Jogador moveu de ${sourceSquare} para ${targetSquare}`)

      const gameCopy = new Chess(game.fen())

      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      })

      console.log("Resultado do chess.js:", move)

      if (!move) {
        console.warn("MOVIMENTO ILEGAL")  
        return false
      }

      console.log("Movimento aceito")
      setGame(gameCopy)

      console.log("Chamando bot")
      botPlay(gameCopy.fen())

      return true
    } catch (error){
      console.error("Erro no código", error)
      return false
    }
  }

  
  async function botPlay(fenAtual: string) {
    try {
      const response = await fetch('http://localhost:8000/proxima-jogada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fen: fenAtual })
      })

      const data = await response.json()

      if (data.best_move) {
        const gameCopy = new Chess(fenAtual)
        gameCopy.move(data.best_move)
        setGame(gameCopy)
      }
    } catch (error) {
      console.error('Erro ao obter a jogada do bot:', error)
    }
  }

  return (
    <div style={styles.container}>
      <h1>Xadrez: Você vs Python</h1>
      <div style={styles.board}>
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop} 
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#282c34',
    color: 'white',
    margin: 0, 
  },
  board: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '400px',
    height: '400px',
    maxWidth: '90vw',
  }
};

export default App;