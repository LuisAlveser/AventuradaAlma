'use client'
import { useHistoria, } from "../../componentes/HistoriaHook";

export default function Historia(){
     const { dados} = useHistoria();
     console.log("Dados",dados?.conteudo,dados?.crianca)
    if (!dados) return <p>Nenhum dado encontrado...</p>;
    return(
        <div>gg</div>
    )
}