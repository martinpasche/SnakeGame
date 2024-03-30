import Button from 'react-bootstrap/Button';
import React from 'react';
import { useState, useEffect } from 'react';

const GameOverDialog = ({points, onRestart, onQuit, onSave, showResult}) => {

    const [isSaving, setIsSaving] = useState(false);
    const [username, setUsername] = useState("");


    const handleIsSaving = () => {
        setIsSaving(!isSaving);
    } 

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleBack = () => {
        setIsSaving(!isSaving);
    }

    useEffect(() => {
        document.body.style.overflow = showResult ? 'hidden' : 'auto'; // Disable scrolling when the dialog is open
    }, [showResult]);

    const dialogStyle = {
        opacity: showResult ? 1 : 0,
        visibility: showResult ? 'visible' : 'hidden',
        transition: 'opacity 0.5s ease-in-out',
    }


    return (
    <div className='dialog' style={dialogStyle}>
        <div className="dialog-screen">
            <h2>Game Over</h2>

            <div className="flex-text"><p>Score:</p><p>{points}</p></div>

            {!isSaving ?
            <div className="flex-text">
                <Button variant="outline-success" className="button flex-text" size="lg" onClick={onRestart}>Restart</Button>{' '}
                <Button variant="outline-primary" className="button flex-text" size="lg" onClick={handleIsSaving} >Save</Button>{' '}
                <Button variant="outline-danger" className="button flex-text" size='lg' onClick={onQuit}>Quit</Button>
            </div> :
            <>
                <form className='form-group'>
                    <label className='form-label' id="username-label" htmlFor='username'>Username: </label>
                    <input required className='form-input' id="username" type="text" placeholder="Username..." value={username} onChange={handleChangeUsername} />
                </form>
                <div style={{display:'flex', justifyContent:'center',}}>
                    <Button variant="outline-primary" style={{margin:'1rem'}} className="button flex-text" size="lg" onClick={() => {onQuit(); onSave(username); handleIsSaving()}} >Save</Button>{' '}
                    <Button variant="outline-danger" style={{margin:'1rem'}} className="button flex-text" size='lg' onClick={handleBack}>Back</Button>
                </div>
            </>}
        </div>
    </div>);
}


export default GameOverDialog;