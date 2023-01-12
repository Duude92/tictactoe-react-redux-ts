import React, { useEffect, useState } from 'react';
import styles from './Styles/App.module.css';
import { Cell } from './Components/Cell';
import { resetDesk, WinningLine, WinningLineType } from './features/tictactoe/desk';
import PlayerPanel from './Components/PlayerPanel';
import { useDispatch } from 'react-redux';


function App() {

  const dispatch = useDispatch();
  const [gameEnded, setGameEnded] = useState(false);
  const [roundDraw, setRoundDraw] = useState(false);
  const [gameResult, setGameResult] = useState({} as WinningLineType);
  const onEndEvent = (ev: CustomEvent) => {
    setGameEnded(true);
    setGameResult(ev.detail as WinningLineType);
    setRoundDraw(ev.detail.draw);
  };

  useEffect(() => {
    window.addEventListener('onGameEnded', (ev) => onEndEvent(ev as CustomEvent));
    return () => {
      window.removeEventListener('onGameEnded', (ev) => onEndEvent(ev as CustomEvent))
    }
  }, [])

  const createCells = (): React.CElement<typeof Cell, any>[][] => {
    const baseID = new Date().getTime();
    let cells: React.CElement<typeof Cell, any>[][] = [];
    for (let index = 0; index < 3; index++) {
      let row: React.CElement<typeof Cell, any>[] = [];
      for (let index2 = 0; index2 < 3; index2++) {
        row.push(<Cell key={baseID + (index * 3) + index2} position={{ X: index2, Y: index }} />);
      }
      cells.push(row);
    }
    return cells;
  }
  const [cells, setCells] = useState<React.CElement<typeof Cell, any>[][]>(createCells());

  const initCells = () => {
    setCells(createCells());
  }


  const newGame = (fullreset = false) => {
    initCells();
    dispatch(resetDesk(fullreset));
    setGameEnded(false);
    setGameResult({} as WinningLineType);
  }
  const resetGame = () => {
    newGame(true);
  }
  return (
    <div className="App">
      <PlayerPanel />
      <div className={styles.gameDesk}>
        {cells}
        {gameEnded && !roundDraw && <i className={styles.strikeLine} style={
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
      <div className={styles.newGamePanel}>
        <input type="button" value="NEW GAME" onClick={() => newGame(false)} />
        <input type="button" value="RESET GAME" onClick={resetGame} />
      </div>
    </div>
  );
}

export default App;
