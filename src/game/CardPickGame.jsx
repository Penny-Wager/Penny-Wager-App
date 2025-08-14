import React, { useState } from "react"
import { useWeb3 } from "../context/Web3Context";


export default function CardPickGame(){
    const [isShuffling, setShuffleStatus] = useState(false)
    const [selectedValue, selectNewValue] = useState('')
    const [selectedSuit, selectNewSuit] = useState('')
    const [shouldStartShuffle, setShuff] = useState(false)
    const { account, isConnected, isOnMonadChain, switchToMonadChain } =
        useWeb3();

    function simShuffle(){
        setShuff(true)
        setShuffleStatus(true)
        console.log(isShuffling, selectedSuit.length >1 && selectedValue.length >1)
        setTimeout(()=> setShuffleStatus(false), 3000)

    }
    console.log(isConnected, isConnected && selectedValue.length <2 && selectedSuit.length <2)
    return(
        <div className="grid md:grid-cols-2 p-2 md:p-4">
            <div>
                     <p className="text-xl bold">Pick A Card!</p>
            <div className="flex gap-x-2 md:gap-x-4">
           
                <div>
                <label htmlFor="card_number">Card Value: 
                <select name="card_number" id="card_number" onChange={(e)=> selectNewValue(e.target.value.charAt(0))}>
                    <option value={"King"}>King</option>
                    <option value={"Queen"}>Queen</option>
                    <option value={"Jack"}>Jack</option>
                    <option value={"10"}>10</option>
                    <option value={"9.0"}>9</option>
                    <option value={"8.0"}>8</option>
                    <option value={"7.0"}>7</option>
                    <option value={"6.0"}>6</option>
                    <option value={"5.0"}>5</option>
                    <option value={"4.0"}>4</option>
                    <option value={"3.0"}>3</option>
                    <option value={"2.0"}>2</option>
                    <option value={"Ace"}>Ace</option>
                </select>
                </label>
                <label htmlFor='card-suit'>Card Suit:
                <select name="suit" id="suit" onChange={(e)=> selectNewSuit(e.target.value)}>
                    <option value="Spades">Spades</option>
                    <option value="Hearts">Hearts</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Diamonds">Diamonds</option>
                </select>
                </label>
                </div>

                <div className="card_preview my-2 md:my-4 p-2 md:p-4 bg-white h-[7.5rem] w-[5rem] rounded-3xl text-black" >
                    <div className="grid relative h-full">
                    <p>{selectedValue}</p> 
                    <p className="text-center">{selectedSuit}</p>  
                    <p className="self-bottom m-0 rotate-180">{selectedValue}</p>                  
                    </div>
                </div>           
            </div>

                 <button className="bg-indigo-600 opacity-100 w-full rounded-2xl p-1 md:p-2 disabled:bg-zinc-400 disabled:opacity-75 transition-all" 
                onClick={simShuffle}
                disabled={isConnected && selectedValue.length <2 && selectedSuit.length <2 }              
                >
                    Confirm
                </button>
            </div>
            <div className="grid place-items-center h-[7.5rem] md:h-auto">
               {
                isShuffling ? <p>Shuffling!</p> : <p>{
                    setShuff && selectedSuit.length >1 && selectedValue.length >1? "Actual Lucky Card is: ..." : 'Awaiting card choice'
                    }</p>
               } 
            </div>
        </div>
    )
}