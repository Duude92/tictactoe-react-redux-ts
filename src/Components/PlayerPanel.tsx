import styles from '../Styles/App.module.css';
import  { useEffect, useState } from 'react'
import { useAppSelector } from '../app/hooks';
import { lastPlayerSelector, scoreSelector } from '../features/tictactoe/desk';



const PlayerPanel = () => {
    const score = useAppSelector(scoreSelector);
    const [gameEnded, setGameEnded] = useState(false);
    const lastPlayer = useAppSelector(lastPlayerSelector);
    const [roundDraw, setRoundDraw] = useState(false);

    const onEndEvent = (ev: CustomEvent) => {
        setRoundDraw(ev.detail.draw);
        setGameEnded(true);
        setTimeout(() => {
            setGameEnded(false);
        }, 3000);
    }
    useEffect(() => {
        window.addEventListener('onGameEnded', (ev) => onEndEvent(ev as CustomEvent));
        return () => {
            window.removeEventListener('onGameEnded', (ev) => onEndEvent(ev as CustomEvent))
        }
    }, [])

    return (
        <div className={styles.playerPanel} >
            <p> Tic Tac Toe</p>
            <hr />
            <span>{score.player1} : {score.player2}<div className={`${styles.winBar} ${gameEnded && styles.active}`} >{roundDraw ? `Round draw!` : `Player${lastPlayer ? 1 : 2} has won the game.`}</div> </span>
        </div>
    )
}

export default PlayerPanel;