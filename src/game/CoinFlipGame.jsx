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
        <div className="grid place-items-center md:my-2 md:min-h-[50vh] h-[40vh] bg-zinc-900 rounded-2xl gameStage">   
            <div className={`md:w-25 md:h-25 h-20 w-20 animate rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center grid shadow-black shadow-2xl border-4 border-amber-800 ${isFlipping ? "animate" : 'hidden'}`}>
                {
        coinState ? <FaCrown size={40} className="coinShow"/> : <FaAnchor size={40} className="coinShow"/>
      }
        
        </div>

         {isGamePlayed && attempts > 0 ? 
            <div className={`${isGamePlayed? 'md:grid flex gap-x-2': "hidden"}`}>
                <div className="grid gap-x-2 place-items-center my-1 md:my-2">
                <div className={`md:w-25 md:h-25 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center grid shadow-black shadow-2xl border-4 border-amber-800`}>
                        {
        coinState ? <FaCrown size={40} /> : <FaAnchor size={40}/>
      }
      </div>
      </div>
            <div>
            <p>
               Value:  {coinState ? "Heads" : "Tails"}
            </p>
            <p>
                Is Guess Correct: {checker()}
            </p>

            <div className="md:flex grid gap-x-2">
            <button className="rounded-xl outline-none p-1 my-2 md:my-1 md:p-2 disabled:bg-zinc-500 bg-green-400 " disabled={checker
                () !== "Yes"
            }>
                Collect Winnings
            </button>
            <button onClick={()=> setPlayed(false)}  className="rounded-xl bg-indigo-600 p-1 md:p-2 my-2 md:my-1">
                Play Again
            </button>
            </div>
            </div>
            </div>
            : <div className={`${isFlipping? 'hidden': 'grid'} placeholderCoin`}>
                  <div className={`md:w-25 w-20 ${isFlipping? 'h-0': 'md:h-25 h-20'} rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center shadow-black shadow-2xl border-4 border-amber-800 
                  ${betAmount < 0.20 ? 'opacity-50': 'opacity-100'} ${isFlipping? 'hidden': 'grid'} transition-opacity`}>
            <FaCrown size={40} />
        </div>
            </div> }


        </div>
    )
}

    return(
        <div className="flex md:grid-cols-2 md:grid my-1 md:my-2 gap-2 flex-col-reverse md:flex-col rounded-2xl mx-1 md:mx-2 border-zinc-800 p-1 md:p-2 border-2">
            <div className="grid h-[45vh] md:h-auto my-1 md:my-0">
                <p className="font-bold text-xl">Flip a Coin!</p>
                <p>Attempts: {attempts}/5</p>
                <label htmlFor="flip" className="block">Side: 
                <select
                onChange={(e)=> makeGuess(e.target.value)
                }
                disabled={isGamePlayed || attempts > 5}
                name="coinFlip" id="flip" className="w-3/4 border-zinc-600 rounded-md border-2 p-1 md:p-2 ml-1 outline-none">
                    <option value={"Heads"} >Heads</option>
                    <option value={"Tails"}>Tails</option>
                </select>
                </label>


                <label htmlFor="amnt">Bet Amount: 
                    <div className="flex gap-x-2 p-1 md:p-2 items-center w-[85%]">
                  <input
                  id='amnt'
                  type="number"
                  className="flex-1 bg-zinc-700 text-white p-2 rounded-md border border-zinc-600 focus:outline-none focus:border-indigo-500 peer" 
                  step="0.01"
                  min={0.20}
                  max={2.0}
                  defaultValue={0.10}
                  onChange={(e)=> changeBetAmount(e.target.value)}
                />
                <span className="block">MON</span>
                </div>
                </label>

                <button 
                className="rounded-2xl block justify-self-center bg-indigo-600 text-white hover:bg-indigo-800 text-center p-1 md:p-2 disabled:bg-zinc-500 w-3/5" 
                disabled={attempts > 5 || isGamePlayed || betAmount < 0.20}
                    onClick={()=> {
                         flipCoin(true)
                         flip();
                         setTimeout(()=> {
                            flipCoin(false);
                            setPlayed(true);
                        },3000)
                       
                        incAttempts((attempts)=> ++attempts );
                        }
                    } 
                >
                    Confirm and Flip
                </button>


            </div>
            <CoinComponent />
        </div>
    )
}