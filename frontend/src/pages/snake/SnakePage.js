import React from "react";
import axios from "axios";
import '../../assets/styles/SnakePage.scss';
import LeaderShipTable from "../../components/LeaderShip";
import BoardGrid from "../../components/BoardGrid";
import GameOverDialog from "../../components/GameOverDialog";

import { useState, useEffect, useRef, useMemo } from "react";
import Button from 'react-bootstrap/Button';


const possibleDirection = {
    up : 0,
    right : 1,
    down : 2,
    left : 3, 
}

const emptyLeadershipBoardItems = {name: "", points : ""}

const SnakePage =  () => {

    const [direction, setDirection] = useState(randomDirection());
    const [snakePos, setSnakePos] = useState([randomInitPos()]);
    const [applePos, setApplePos] = useState(randomInitPos(snakePos));
    const [isGameOver, setIsGameOver] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [leadershipList, setLeadershipList] = useState([emptyLeadershipBoardItems]);
    const [loadingLeadership, setLoadingLeadership] = useState(true);



    const snakeRealDir = getSnakeRealPos(snakePos, direction);
    const points = snakePos.length - 1;
    useInterval(tick, 200);

    // cuando tenemos una función costosa, solo correrla cuando es nesario
    // memo por memorizar
    const cells = useMemo(() => createCells(snakePos, applePos, isGameOver), [snakePos, applePos, isGameOver]);



    function tick () {

        if (!isGameOver) {

            //we want to change position of the snake
            let snakeLength = snakePos.length;
            let headPos = snakePos[snakeLength - 1];

            let newHeadPos = getNewSnakeHead(headPos, direction);
            let newSnakePos = [...snakePos, newHeadPos];

            //////////////// aqui comprobar si se perdio !! ////////////////////////////////////
            if (snakePos.includes(newHeadPos)){
                //Game lost
                setIsGameOver(!isGameOver);
                setShowResult(!showResult);
                console.log("Perdiste! ", points);
            }
            

            //Si no esta en la posicion de la manzana, hay que eliminar hacer correr la serpiente
            if (newHeadPos !== applePos){
                newSnakePos.shift();
            } else {
                //se comio la manzana
                setApplePos(randomInitPos(newSnakePos));
            }
            setSnakePos(newSnakePos);
        }
    }


    //////////////////// INIT THE GAMES ///////////////////////////
    function handleStartButton () {
        setIsGameOver(!isGameOver);
        initGameValues();
    }

    function initGameValues () {
        setDirection(randomDirection());
        setSnakePos([randomInitPos()])
        setApplePos(randomInitPos(snakePos));
    }



    function handleRestart () {
        setIsGameOver(false);
        setShowResult(false);
        initGameValues();
        updateLeadershipBoard();
    }

    function handleQuit () {
        setShowResult(false);
        updateLeadershipBoard();
    }


    const updateLeadershipBoard = () => {
        setLoadingLeadership(true);
        axios
            .get('api/leaderships/')
            .then((response) => {
                setLeadershipList(response.data);
                setLoadingLeadership(false);
            })
            .catch((e) => {
                console.log(e);
                setLoadingLeadership(false);
            });
    }

    const handleSave = (username) => {
        const user = {
            name : username,
            points : points,
        }

        axios
            .post('/api/leaderships/', user)
            .then( (res) => updateLeadershipBoard());
    }

    

    //For handling user input
    useEffect ( () => {
        const handleKeyDown = (e) => handleKey(e, setDirection, snakeRealDir);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [snakeRealDir]);

    
    //fetching leadership for the first time
    useEffect(() => {
        axios
            .get('api/leaderships/')
            .then((response) => {
                console.log(response)
                console.log(response.data)
                setLeadershipList(response.data);
                setLoadingLeadership(false);
            })
            .catch((e) => {
                console.log(e);
                setLoadingLeadership(false);
            });
    }, []);



    return (
        <div className="page">
            {showResult && <GameOverDialog 
                points={points} 
                onQuit={handleQuit} 
                onRestart={handleRestart}
                onSave={handleSave} 
                showResult={showResult} />}
        
            <div className="leadership-board side-flex-column">
                {loadingLeadership ? (
                    <p style={{fontSize:'4rem', color:'gray',}}>Loading</p>
                    )  : <LeaderShipTable loadingLeadership={loadingLeadership} leadershipList={leadershipList}/>
                }
            </div>

            <div className="main-game-column main-flex-column">
                <h1>Snake</h1>
                <BoardGrid cells={cells} />
            </div>

            <div className="side-flex-column flex f-center f-vertical">
                {!isGameOver &&
                <div className="points">
                    <p>{points} pts</p>
                </div>}
                
                {isGameOver &&
                <Button 
                    variant="outline-primary" 
                    size="lg" 
                    style={{fontSize:'2rem',}}
                    onClick={handleStartButton}
                >
                    Start
                </Button>}
            </div>

        </div>        
    );
}





function useInterval (callBack, delay){
    const callBackRef = useRef();

    useEffect( () => {
        callBackRef.current = callBack;
    }, [callBack] );

    useEffect ( () => {
        const interval = setInterval(() => callBackRef.current(), delay);
        return () => clearInterval(interval);
    })
}


function getNewSnakeHead (headPos, dir) {
    //we will cosider a grid of 16 x 16
    //row y column comienzan desde el 0
    let row = Math.floor( headPos / 16);
    let column = headPos % 16;
    
    if (dir === possibleDirection.up){
        if (row !== 0){
            row -= 1;
        } else {
            row = 15;
        }
    } else if (dir === possibleDirection.right){
        if (column !== 15){
            column += 1;
        } else {
            column = 0;
        }
    }else if (dir === possibleDirection.down){
        if (row !== 15){
            row += 1;
        } else {
            row = 0;
        }
    }else {
        if (column !== 0){
            column -= 1;
        } else {
            column = 15;
        }
    }
    return row * 16 + column;
}


function getSnakeRealPos(snakePos, direction){
    let difRow = 0;
    let difColumn = 0;
    let snakeRealDir = 0;
    if (snakePos.length >= 2){

        let headPos = snakePos[snakePos.length - 1];
        let neckPos = snakePos[snakePos.length - 2];

        let rowHead = Math.floor( headPos / 16);
        let columnHead = headPos % 16;

        let rowNeck = Math.floor( neckPos / 16);
        let columnNeck = neckPos % 16;

        if (rowNeck === 0 && rowHead === 15){
            rowNeck = 16;
        } else if (rowNeck === 15 && rowHead === 0){
            rowNeck = -1;
        }

        if (columnNeck === 0 && columnHead === 15){
            columnNeck = 16;
        } else if (columnNeck === 15 && columnHead === 0){
            columnNeck = -1;
        }

        difRow = rowHead - rowNeck;
        difColumn = columnHead - columnNeck;
        

        if ( difRow === 1){
            snakeRealDir = possibleDirection.down;
        } else if (difRow ===  -1){
            snakeRealDir = possibleDirection.up;
        } else if (difColumn === 1){
            snakeRealDir = possibleDirection.right;
        } else {
            snakeRealDir = possibleDirection.left;
        }
    } else {
        snakeRealDir = direction;
    }

    return snakeRealDir;
}   
    


function randomInitPos(pos) {
    pos = typeof pos !== 'undefined' ? pos : null;

    if (pos === null){
        return Math.floor( Math.random() * 256);
    } else {
        let possiblePos = 0;
        do {
            possiblePos = Math.floor( Math.random() * 256);
        } while (pos.includes(possiblePos));
        return possiblePos;
    }
}


function randomDirection (){
    return Math.floor( Math.random() * 4);
}


function createCells (snakePos, applePos, isGameOver){

    const array = new Array(256).fill(null);

    if (!isGameOver){
        let index = 0;
        for (let i = 0; i < snakePos.length; i++){
            index = snakePos[i];
            array[index] = 'snake';
        }
        array[applePos] = 'apple';
    }
    return array;
}



function handleKey (e, setDirection, snakeRealDir){
    let dir = -1;
    switch (e.key) {
        case 'w':
            dir = possibleDirection.up;
            break;
        case 'd' :
            dir = possibleDirection.right;
            break;
        case 's' :
            dir = possibleDirection.down;
            break;
        case 'a':
            dir = possibleDirection.left;
            break;
        case 'W':
            dir = possibleDirection.up;
            break;
        case 'D' :
            dir = possibleDirection.right;
            break;
        case 'S' :
            dir = possibleDirection.down;
            break;
        case 'A':
            dir = possibleDirection.left;
            break;
        case 'ArrowUp':
            dir = possibleDirection.up;
            break;
        case 'ArrowRight' :
            dir = possibleDirection.right;
            break;
        case 'ArrowDown' :
            dir = possibleDirection.down;
            break;
        case 'ArrowLeft':
            dir = possibleDirection.left;
            break;
    }
    setDirection (prevDirection => {
        if (dir === -1){
            return prevDirection;
        } else if ((dir === 0 && snakeRealDir  === 2) ||  (dir === 2 && snakeRealDir  === 0)) {
            return snakeRealDir;
        } else if ((dir === 1 && snakeRealDir  === 3) ||  (dir === 3 && snakeRealDir  === 1)){
            return snakeRealDir;
        } else {
            return dir;
        }
    });
}




export default SnakePage;