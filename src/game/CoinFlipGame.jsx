import React, {useState} from "react";
import { FaAnchor, FaCrown, FaHourglass } from "react-icons/fa6";

export default function CoinFlipGame(){
 const [coinState, changeCoinState] = useState(false);
 const [isFlipping, flipCoin] = useState(false)
 const [attempts, incAttempts] = useState(0)

function flip(){
    const decider = Math.random();
    if (decider > 0.5) {
        changeCoinState(true)
        return "Heads"
    }
    else {
        changeCoinState(false)
        return "Tails"
    }
} 

function CoinComponent(){
    return(
        <div className="grid place-items-center">   
            <div className={`w-25 h-25 animate rounded-full bg-gradient-to-br from-amber-300 to-amber-700 perspective-[300px] transform-3d place-items-center grid shadow-black shadow-2xl border-4 border-amber-800 ${isFlipping ? "animate" : 'animate-none'} ${isFlipping? 'block' : 'hidden'}`}>
                {
        coinState ? <FaCrown size={40} className="coinShow"/> : <FaAnchor size={40} className="coinShow"/>
      }
           
            </div>

        </div>
    )
}



    return(
        <div className="grid grid-cols-2 gap-x-2 bg-zinc-700 border-zinc-800 p-1 md:p-2 border-2">
            <div className="grid">
                <p className="font-bold text-xl">Flip a Coin!</p>
                <p>Attempts: {attempts}/5</p>
                <label htmlFor="flip" className="block">Side: 
                <select name="coinFlip" id="flip" className="w-3/4 border-zinc-600 rounded-md border-2 p-1 md:p-2 ml-1">
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

                <button className="rounded-2xl block justify-self-center bg-indigo-600 text-white hover:bg-indigo-800 text-center p-2 md:p-4" 
                    onClick={()=> {
                        flipCoin(true);
                        incAttempts((attempts)=> ++attempts );
                        flip()
                    } }
                >
                    Confirm and Flip
                </button>


            </div>
            <CoinComponent />
        </div>
    )
}