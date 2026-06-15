'use client'
import Image from "next/image";
import { alfabetizacao, autismo, Usuario } from "@/generated/prisma/client"
import { useEffect, useState } from "react"
import { FaUser,FaPen,FaTrash, FaCalendarAlt, FaBrain } from "react-icons/fa";
import { Paginacao } from "./Paginacao";
import { useRouter } from "next/navigation";
import Carregando from "@/app/Carregando";
import { toast } from "sonner";
import { Formulariohistoria } from "./FormularioHistoria";

interface crianca{
      id: string;
    nome: string;
    foto_perfil: string | null;
    idade: string;
    nivel_autismo: autismo;
    hiperfoco: string;
    animais_estimacao: string | null;
    amigos_nomes: string | null;
    pais: string;
    parentes: string;
    nivel_alfabetizacao: alfabetizacao;
    usuario_id: string;
}
interface historias{
    id: string,
    texto:string,
    nota ? :number,
    crianca:crianca,
    criado_em:Date,
    imagem?:Imagem[]
}
interface Imagem{
    conteuto:string
}
interface dados{
    historias:historias[],
    paginacao:{
    paginaAtual:number,
    total_registros:number,
    numero_paginas:number
    }
}
interface paginacao{
    paginaAtual:number,
    total_registros:number,
    numero_paginas:number
}

export function CardHistoriasSalvas(){
    const [historias,sethistorias]=useState<historias[]>([])
    const [paginacao,setpaginacao]=useState<paginacao>()
    const [paginaNav,setpaginaNav]=useState<number>(1)
    const [carregando,setcarregando]=useState<boolean>(false)
    const rota=useRouter()
    const limite:number=15

useEffect(()=>{
   
    const buscarcrianca=async (pagina:number)=>{
           try {
             setcarregando(true)
     const resposta =await fetch(`http://localhost:3000/api/historia?pagina=${pagina}`,{
        method:"GET"
     })
       if(resposta.status===200){
        const dados:dados=await resposta.json()
         console.log("Historias conteudo",dados.historias)
        setpaginacao(dados.paginacao)
        sethistorias(dados.historias)
       
       }
      } catch (error) {
        
        toast.error("Erro inesperado no servidor")
      }finally{
        setcarregando(false)
      }
    }
   buscarcrianca(paginaNav)
},[paginaNav])


const excluir=async (id:string)=>{
    try {
          const resposta =await fetch(`http://localhost:3000/api/historia/${id}`,{
        method:"DELETE"
     })
     if(resposta.status===200){
        sethistorias((lista)=>lista.filter(item=>item.id!==id))
        toast.success("Exclução realizada com sucesso")
     }
     if(resposta.status===404){
        toast.error("Id não encontrada")
     }
    } catch (error) {
        toast.error("Erro inesperado no servidor")
    }
}
    return(
              <div className="flex flex-col justify-center items-center">
         <div className=" max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-6">
        
        {carregando?<Carregando/>:Array.isArray(historias)&&historias.length>0?(
         
        historias.map((item ) => (
            
          <div 
            key={item.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col justify-between "
          >
          
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                
               
                <div>
                  <h3 className="font-bold text-gray-800 text-sm tracking-tight">{item.texto.length>limite ?item.texto.substring(0,limite)+"...":item.texto}</h3>
                  <p className="text-[11px] text-slate-400">História Cadastrada Cadastrada</p>
                </div>
              </div>

             
              <div className="flex items-center gap-3 text-slate-400">
             
                <button onClick={()=>{excluir(item.id)}} title="Excluir" className="hover:text-red-600 transition-colors cursor-pointer p-1">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>

          
            <div className="flex flex-col gap-2 mt-4 text-xs">
              
              
              <div className="flex items-center gap-2 text-gray-600 bg-slate-50 px-3 py-2 rounded-xl">
                <FaCalendarAlt className="text-slate-400 text-sm" />
                <span className="font-medium">Data de Criação:</span>
                <span className="text-gray-800 font-semibold ml-auto">
                   {new Date(item.criado_em).toLocaleDateString('pt-BR')} 
                </span>
              </div>

           
            

              
              
            </div>
             <button
            
               type="submit"
              className=" mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
             >
                 Ler Novamente
                </button>

               
          </div>
        ))):(<h1 className="text-blue-600 justify-center items-center ">Nenhuma criança cadastrada</h1>)}
        
          
        
         
      </div>
         <Paginacao paginacao={paginacao} setpaginaNav={setpaginaNav} paginaNav={paginaNav}  />
      </div>
       
    )
}