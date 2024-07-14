import React from 'react'
import { useLocation } from 'react-router-dom';


const Results = () => {
    //exp store ka function banana h
    const location = useLocation()
    const {results} = location.state

    return (
        <>
            {results.result=='win' && (<>
                <h1>VICTORY</h1>
                <br></br>
                <p>Claim your Rewards : {results.reward} exp</p>
                <button></button>
            </>)}

            {results.result=='lost' && (<>
                <h1>Defeat</h1>
                <p>Better luck next time...</p>
                <br></br>
                <p>Claim your Exp Points : {results.reward} exp</p>
                <button></button>
            </>)}
        </>
    )
}

export default Results