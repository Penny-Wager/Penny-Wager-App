import React, {useState} from "react";
import { FaAnchor, FaCrown } from "react-icons/fa6";

export default function CoinFlipGame(){
 const [coinState, changeCoinState] = useState(false);
 const [isFlipping, flipCoin] = useState(false)
 const [isGamePlayed, setPlayed] = useState(false)
 const [attempts, incAttempts] = useState(0)
 const [betAmount, changeBetAmount] = useState(0.1)
 const [userSideGuess, makeGuess] = useState('Heads')

function flip(){
    const decider = Math.random();
    if (decider > 0.5) {
        changeCoinState(true)
    }
    else {
        changeCoinState(false)
    }
} 

function checker(){
    if (userSideGuess == "Heads" && coinState){
        return "Yes"
    }
    else if ( 
        userSideGuess == "Tails" && !coinState
    ){
        return "Yes"
    }
    else{
        return "No"
    }
}

function CoinComponent(){
    return(
        <div className="grid place-items-center my-2">   
            <div className={`w-25 h-25 animate rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center grid shadow-black shadow-2xl border-4 border-amber-800 ${isFlipping ? "animate" : 'hidden'}`}>
                {
        coinState ? <FaCrown size={40} className="coinShow"/> : <FaAnchor size={40} className="coinShow"/>
      }
        
        </div>

         {isGamePlayed && attempts > 0 ? 
            <div className={`${isGamePlayed? 'block': "hidden"}`}>
                <div className="grid place-items-center my-1 md:my-2">
                <div className={`w-25 h-25 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center grid shadow-black shadow-2xl border-4 border-amber-800`}>
                        {
        coinState ? <FaCrown size={40} /> : <FaAnchor size={40}/>
      }
      </div>
      </div>
            <p>
               Value:  {coinState ? "Heads" : "Tails"}
            </p>
            <p>
                Is Guess Correct: {checker()}
            </p>

            <div className="flex gap-x-2">
            <button className="rounded-xl outline-none p-1 md:p-2 disabled:bg-zinc-500 bg-green-400 " disabled={checker
                () !== "Yes"
            }>
                Collect Winnings
            </button>
            <button onClick={()=> setPlayed(false)}  className="rounded-xl bg-indigo-600 p-1 md:p-2">
                Play Again
            </button>
            </div>
            </div>
            : null }


        </div>
    )
}



    return(
        <div className="grid md:grid-cols-2 my-1 md:my-2 gap-2 bg-zinc-700 border-zinc-800 p-1 md:p-2 border-2">
            <div className="grid">
                <p className="font-bold text-xl">Flip a Coin!</p>
                <p>Attempts: {attempts}/5</p>
                <label htmlFor="flip" className="block">Side: 
                <select
                onChange={(e)=> makeGuess(e.target.value)
                }
                disabled={isGamePlayed || attempts > 5}
                name="coinFlip" id="flip" className="w-3/4 border-zinc-600 rounded-md border-2 p-1 md:p-2 ml-1">
                    <option value={"Heads"} >Heads</option>
                    <option value={"Tails"}>Tails</option>
                </select>
                </label>


                <label htmlFor="amnt">Bet Amount: 
                    <div className="flex gap-x-2 p-1 md:p-2 items-center w-3/4">
                  <input
                  id='amnt'
                  type="number"
                  className="flex-1 bg-zinc-700 text-white p-2 rounded-md border border-zinc-600 focus:outline-none focus:border-indigo-500" 
                  step="0.01"
                  min={0.01}
                  max={2.0}
                  defaultValue={0.10}
                />
                <p>MON</p>
                </div>
                </label>

                <button 
                className="rounded-2xl block justify-self-center bg-indigo-600 text-white hover:bg-indigo-800 text-center p-2 md:p-4 disabled:bg-zinc-500" 
                disabled={attempts > 5 || isGamePlayed}
                    onClick={()=> {
                         flipCoin(true)
                         flip();
                         setTimeout(()=> {
                            flipCoin(false);
                            setPlayed(true);
                        },3000)
                       
                        incAttempts((attempts)=> ++attempts );
                    
                    } }
                >
                    Confirm and Flip
                </button>


            </div>
            <CoinComponent />
        </div>
    )
}