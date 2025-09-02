import React, { useState } from "react"
import { useWeb3 } from "../context/Web3Context";
import { GiHearts, GiSpades } from "react-icons/gi";
import { GiClubs } from "react-icons/gi";
import { GiDiamonds } from "react-icons/gi";


export default function CardPickGame(){
    const [isShuffling, setShuffleStatus] = useState(false)
    const [betValue, updateBet] = useState(0.1)
    const [betMultiplier, updateMultiplier] = useState(1.0)
    const [attempts, addAttempt] = useState(0)
    const [selectedValue, selectNewValue] = useState('')
    const [selectedSuit, selectNewSuit] = useState('')
    const [shouldStartShuffle, setShuff] = useState(false) // State should only be true when game start conditions are met
    const { account, isConnected, isOnMonadChain, switchToMonadChain } =
        useWeb3();

    function simShuffle(){
        setShuff(true)
        setShuffleStatus(true)
        setTimeout(()=> {
            setShuffleStatus(false);
            
        }
        , 3000) //Simulates delay for the card shuffle
    }

    //function used to generate the "Lucky Card"
    function luckyChoose(){
        const suits = ["Spades", "Hearts", "Clubs", "Diamonds"]
        const values = ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"]

        const lucky_suit = suits[Math.floor(Math.random() * suits.length )]
        const lucky_value = values[Math.floor(Math.random() * values.length)]

        return {suit: lucky_suit, value: lucky_value}

    }


    //Shows card icons depending on the card suit
      function CardIcon({suit}){
            switch (suit){
                case "Hearts":
                    return <GiHearts size={48} fill="red"/>;
                case "Spades":
                    return <GiSpades size={48}/>
                case "Diamonds":
                    return <GiDiamonds size={48} fill="red"/>
                case "Clubs":
                    return <GiClubs size={48}/>
            }
        }


    //Right-Hand Side Component
    function GameComp(){
        const {suit, value} =  luckyChoose()
      
        return(
            <div className="grid">
                <p>
                Actual Lucky Card is: {`${value} of ${suit}`}
                </p>
                   <div className="grid">
                <div className="card_preview my-2 place-self-center md:my-4 p-2 md:p-4 bg-white h-[7.5rem] w-[5rem] rounded-xl text-black" >
                    <div className="grid relative h-full">
                    <p className="font-bold">{value}</p>
                    <div className="place-self-center">
                    <CardIcon suit={suit}/>  
                    </div>
                    <p className="self-bottom m-0 rotate-180 font-bold">{value}</p>                  
                    </div>
                </div> 
                </div>   

                <div className="game_review">
                    <p>Guessed Correct Suit: {selectedSuit == suit ? "Yes" : "No"}</p>
                    <p>Guessed Correct Value: {selectedValue == value ? "Yes" : "No"}</p>

                </div>

                <div className="flex gap-x-4">
                <button className="rounded-xl text-white bg-zinc-600 p-2">
                    Accept Winnings: +0.45MON
                </button>
                <button className="rounded-xl text-white bg-indigo-700 p-2" onClick={()=> {
                    setShuff(false);
                    addAttempt((attempt) => attempt + 1)
                    }}>Play Again</button>
            </div>
            </div>
        )
    }


    return(
        <div className="grid md:grid-cols-2 m-2 p-1 md:p-2 md:gap-x-2 border-zinc-600 border-1 rounded-2xl">
            <div className="p-2 md:p-4 bg-zinc-800 rounded-2xl my-2 md:my-0">
            <p className="text-2xl font-bold">Pick A Card!</p>
            <p><u>Attempts Remaining:</u> {3 - attempts}</p>
            <div className="grid md:grid-cols-2 gap-x-2 md:gap-x-4">
           
                <div>
                <label htmlFor="card_number" className="block">Card Value: 
                <select className="
                border-2 border-zinc-800
                bg-zinc-600
                 hover:border-indigo-800 
                 ml-1 rounded-[4px] md:rounded-[8px]
                p-1 md:p-2
                text-white
                outline-0
                 w-3/5
                 "
                 disabled={shouldStartShuffle} //Ensures that inputs cannot be manipulated post-shuffle
                 name="card_number" id="card_number" onChange={(e)=> selectNewValue(e.target.value)}>
                    <option value={'else'} disabled>Select</option>
                    <option value={"K"}>King</option>
                    <option value={"Q"}>Queen</option>
                    <option value={"J"}>Jack</option>
                    <option value={"10"}>10</option>
                    <option value={"9"}>9</option>
                    <option value={"8"}>8</option>
                    <option value={"7"}>7</option>
                    <option value={"6"}>6</option>
                    <option value={"5"}>5</option>
                    <option value={"4"}>4</option>
                    <option value={"3"}>3</option>
                    <option value={"2"}>2</option>
                    <option value={"A"}>Ace</option>
                </select>
                </label>
               
                <label htmlFor='card-suit' className="block">Card Suit:
                <select name="suit" id="suit" onChange={(e)=> selectNewSuit(e.target.value)}
                    className="border-2 border-zinc-800 bg-zinc-600 hover:border-indigo-800 ml-1 rounded-[4px] md:rounded-[8px] disabled:opacity-75 text-white outline-0
                    p-1 md:p-2 w-3/5
                    " 
                    disabled= {selectedValue.length < 1 || shouldStartShuffle}
                    >
                    <option value="Spades">Spades</option>
                    <option value="Hearts">Hearts</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Diamonds">Diamonds</option>
                </select>
                </label>
            
                <label htmlFor="amnt" className="font-bold">
                    Bet Amount:
                <div className="flex gap-x-2 border-2 border-zinc-600 rounded-xl">
                <input type="number" name="betAmount" id="amnt" step={0.01} min={0.10} max={5.0} className="block indent-3  w-[75%] outline-0" defaultValue={0.1} onChange={(e) => updateBet(e.target.value)}
                disabled={shouldStartShuffle}
                />
                <span className="border-l-2 border-zinc-600 p-1 md:p-2">MON</span>
                </div>
                </label> 

                <p>Multiplier: </p>
                <div className="grid grid-cols-4 gap-2">

                <button onClick={()=>{updateMultiplier(1.25)}} className={`rounded-[1.25rem] ${betMultiplier == 1.25? "chosen" : ''} bg-green-400 text-green-200 hover:text-white`}>x1.25</button>
                <button onClick={()=>updateMultiplier(2.43)} className={`rounded-[1.25rem] ${betMultiplier == 2.43? "chosen" : ''} bg-amber-500 text-amber-300 hover:text-white`}>x2.43</button>
                <button onClick={()=>updateMultiplier(1.34)} className={`rounded-[1.25rem]  ${betMultiplier == 1.34? "chosen" : ''} bg-green-400 text-green-200 hover:text-white`}>x1.34</button>
                <button onClick={()=>updateMultiplier(4.23)} className={`rounded-[1.25rem] ${betMultiplier == 4.23 ? "chosen": ''} bg-red-500 text-red-300 hover:text-white`}>x4.23</button>
             
                </div>
                   <p className="my-2">
                    Pot. Win: {(betValue * betMultiplier).toFixed(4)} MON
                </p>
</div>
                <div className="grid">
                <div className={`card_preview my-2 place-self-center md:my-4 p-2 md:p-4 bg-white h-[7.5rem] w-[5rem] rounded-xl text-black ${selectedValue.length == 0 ? "opacity-75": ''} transition-all`} >
                    <div className="grid relative h-full">
                    <p className="font-bold">{selectedValue}</p> 
                    <div className="place-self-center">
                    <CardIcon suit={selectedSuit} />
                    </div>
                    <p className="self-bottom m-0 rotate-180 font-bold">{selectedValue}</p>                  
                    </div>
                </div> 
                </div>          
            </div>

                 <button className="bg-indigo-600 opacity-100 w-full rounded-2xl p-1 md:p-2 disabled:bg-zinc-400 disabled:opacity-75 transition-all my-2 md:my-1" 
                onClick={simShuffle}
                disabled={selectedValue.length <10 && selectedSuit.length <2 && betValue < 0.5 || shouldStartShuffle || attempts == 3}              
                >
                    Confirm
                </button>
            </div>

            <div className="grid place-items-center p-1 md:p-2 min-h-[7.5rem] md:h-auto border-t-2 md:border-t-0 md:border-l-2 border-zinc-800">
               {
                isShuffling ? <p>Shuffling!</p> : <p>{
                    shouldStartShuffle && selectedSuit.length >1 && selectedValue.length >= 1 ? <GameComp/>: 'Awaiting card choice'
                    }</p>
               } 
            </div>
        </div>
    )
}