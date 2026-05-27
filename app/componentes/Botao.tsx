'use client'
import { ReactNode, } from "react"
interface Props{
    children:ReactNode
  FormOpen?: () => void;


}


export function Botao({children,FormOpen}:Props){

    return(
        <button className="rounded-2xl bg-blue-500 cursor-pointer px-4 py-2 hover:bg-blue-600" onClick={FormOpen}>{children}</button>
    )
}