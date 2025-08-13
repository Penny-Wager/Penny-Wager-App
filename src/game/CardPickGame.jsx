import React, { useState } from "react"
import { useWeb3 } from "../context/Web3Context";


export default function CardPickGame(){
    const [isShuffling, setShuffleStatus] = useState(false)
    const { account, isConnected, isOnMonadChain, switchToMonadChain } =
        useWeb3();


    return(
        <div className="grid md:grid-cols-2 h-[400px] p-2 md:p-4">
            <div>
                <p className="text-center">Pick A Card!</p>
                <select name="card_number" id="card_number">
                    <option value={"King"}></option>
                     <option value={"Queen"}></option>
                      <option value={"Jack"}></option>
                     <option value={"10"}></option>
                      <option value={"9"}></option>
                     <option value={"8"}></option>
                     <option value={"7"}></option>
                      <option value={"6"}></option>
                      <option value={"5"}></option>
                      <option value={"4"}></option>
                      <option value={"3"}></option>
                      <option value={"2"}></option>
                      <option value={"1"}></option>
                </select>
            </div>
            <div className="grid place-items-center">
               <p>Shuffling!</p> 
            </div>
        </div>
    )
}