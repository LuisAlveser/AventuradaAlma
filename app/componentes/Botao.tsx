import { ReactNode } from "react"

interface Props{
    children:ReactNode
}


export function Botao({children}:Props){

    return(
        <button className="rounded-2xl bg-blue-500 cursor-pointer px-4 py-2 hover:bg-blue-600">{children}</button>
    )
}