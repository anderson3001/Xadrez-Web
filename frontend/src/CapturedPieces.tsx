import React from 'react';
import { Chess } from 'chess.js';

interface CapturedPiecesProps {
  game: Chess;
  color: 'w' | 'b';
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ game, color }) => {

  const initialCount: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const currentCount: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  game.board().forEach(row => {
    row.forEach(piece => {
      if (piece && piece.color === color) {
        currentCount[piece.type]++;
      }
    });
  });

  const captured: string[] = [];
  const pieceOrder = ['p', 'n', 'b', 'r', 'q'];

  pieceOrder.forEach((type) => {
    const count = initialCount[type] - currentCount[type];
    for (let i = 0; i < count; i++) {
      captured.push(type);
    }
  });

  if (captured.length === 0) return <div style={{ height: '30px' }}></div>;

  return (
    <div className="captured-pieces-container">
      {captured.map((piece, index) => (
        <img 
            key={index} 
            src={`https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${color}${piece}.png`}
            alt={piece}
            className="captured-piece-img"
        />
      ))}
    </div>
  );
};