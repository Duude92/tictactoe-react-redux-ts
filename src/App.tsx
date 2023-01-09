import React, { useState } from 'react';
import styles from './Styles/App.module.css';
import { Cell } from './Components/Cell';
import { useAppSelector } from './app/hooks';
import { selectPlayer, WinningLine, WinningLineType } from './features/tictactoe/desk';


function App() {
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState({} as WinningLineType);
  window.addEventListener('onGameEnded', (ev) => {
    setGameEnded(true);
    setGameResult((ev as CustomEvent).detail as WinningLineType);
  })
  const isFirstUser = useAppSelector(selectPlayer);
  let cells: React.CElement<typeof Cell, any>[][] = [];
  for (let index = 0; index < 3; index++) {
    let row: React.CElement<typeof Cell, any>[] = [];
    for (let index2 = 0; index2 < 3; index2++) {
      row.push(<Cell key={(index * 3) + index2} position={{ X: index2, Y: index }} />);
    }
    cells.push(row);
  }
  return (
    <div className="App">
      <div className={styles.playerPanel} > {isFirstUser ? 'Cross player move' : 'Circle player move'}<br />{gameEnded && ((!isFirstUser ? 'First' : 'Second') + ' player won game.')}</div>
      <div className={styles.gameDesk}>
        {cells}
        {gameEnded && <i className={styles.strikeLine} style={
          gameResult.Line === WinningLine.COLUMN ? {
            transform: 'rotate(90deg)',
            right: 0,
            top: `calc(33.33%*${gameResult.index + 0.5})`,
            transformOrigin: 'top'
          } :
            gameResult.Line === WinningLine.ROW ? {
              left: `calc(33.33%*${gameResult.index + 0.5})`
            } :
              gameResult.Line === WinningLine.SECONDARYDIAGONAL ? {
                transform: 'rotate(45deg)',
                transformOrigin: 'bottom',
                height: '141%',
                bottom: 0,
              } :
                gameResult.Line === WinningLine.PRIMARYDIAGONAL ? {
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top',
                  height: '141%',
                  top: 0
                } :
                  undefined} />}
      </div>
    </div>
  );
}

export default App;
