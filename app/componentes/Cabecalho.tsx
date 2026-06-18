

import { Dispatch, SetStateAction, useState } from "react"
import {Botao} from "./Botao"
import Image from "next/image"


interface Props{
    setcadastro:Dispatch<SetStateAction<boolean>>
    setlogin:Dispatch<SetStateAction<boolean>>
}

export function Cabecalho({setcadastro,setlogin}:Props){
        
    return(
        <header className="flex flex-row justify-between px-4 p-5 bg-gradient-to-br from-blue-50 to-white items-center  border rounded-b-xl rounded-b-sm">
            <div className=" items-center flex flex-row px-5 gap-5">
            <Image src={"/Logo_Tcc.png"} alt="logo" width={60} height={60} className="rounded-2xl"></Image>
            <h2 className="font-bold  text-2xl text-blue-500">Aventura da Alma</h2>
         </div>
          
           <div className=" flex flex-row  items-center  gap-5">
           <Botao FormOpen={()=>setlogin(true)}>Login</Botao>
           <Botao FormOpen={()=>setcadastro(true)} >Experimente Grátis</Botao>
          
         </div>
        </header>
    )
}