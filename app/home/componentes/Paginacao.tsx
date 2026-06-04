import { Dispatch, SetStateAction } from "react";

interface Props{
    paginacao?:{
    paginaAtual:number,
    total_registros:number,
    numero_paginas:number
    }
     paginaNav:number
     setpaginaNav: Dispatch<SetStateAction<number>>
}

export function Paginacao({paginacao,setpaginaNav,paginaNav}:Props,){
    const voltar=()=>{
          if(paginaNav>1){
            setpaginaNav((prev)=>prev-1)
          }
    }
       const avancar=()=>{
          if(paginaNav<paginacao!.numero_paginas){
            setpaginaNav((prev)=>prev+1)
          }
    }
    const navegacao=(pagina:number)=>{
           setpaginaNav(pagina)
    }
    if (!paginacao || paginacao.numero_paginas <= 1) return null;
    return(
        <div className=" flex flex-row justify-center items-center gap-4 mt-4">
          
          <button className="px-2 py-2 bg-blue-600 rounded-2xl text-white cursor-pointer" onClick={voltar}>
            Voltar</button>
             {Array.from({ length: paginacao.numero_paginas || 0 }, (_, i) => i + 1).map((pagina) => (
        <button 
        onClick={()=>{navegacao(pagina)}}
          key={pagina} 
          className={`px-4 py-2 rounded-2xl text-white cursor-pointer ${
            paginacao.paginaAtual === pagina ? "bg-blue-800 font-bold" : "bg-blue-600"
          }`}
        >
          {pagina}
        </button>
      ))}
          <button className="px-2 py-2 bg-blue-600 rounded-2xl text-white cursor-pointer" onClick={avancar}>
            Avançar</button>


        </div>
    )
}