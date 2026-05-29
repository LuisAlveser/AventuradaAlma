'use client'
import { ReactNode, } from "react"
interface Props{
    children:ReactNode
    FormOpen?: () => void;


}


export function Botao({children,FormOpen}:Props){

    return(
        <button className="rounded-2xl  cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-700" onClick={FormOpen}>{children}</button>
    )
}