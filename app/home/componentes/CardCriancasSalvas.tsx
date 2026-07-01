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
import { useHistoria } from "./HistoriaHook";

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
interface dados{
    crianca:crianca[],
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

export function CardCriancasSalvas(){
    const [crianca,setCrianca]=useState<crianca[]>([])
    const [paginacao,setpaginacao]=useState<paginacao>()
    const [paginaNav,setpaginaNav]=useState<number>(1)
    const [carregando,setcarregando]=useState<boolean>(false)
    const rota=useRouter()
     const {buscarUsuario} = useHistoria();
    const [formulariohistoria,setformulariohistoria]=useState<boolean>(false)

useEffect(()=>{
   
    const buscarcrianca=async (pagina:number)=>{
           try {
             setcarregando(true)
     const resposta =await fetch(`http://localhost:3000/api/crianca?pagina=${pagina}`,{
        method:"GET"
     })
       if(resposta.status===200){
        const dados:dados=await resposta.json()
         await buscarUsuario()
        setpaginacao(dados.paginacao)
        setCrianca(dados.crianca)
       
       }
      } catch (error) {
        
        toast.error("Erro inesperado no servidor")
      }finally{
        setcarregando(false)
      }
    }
   buscarcrianca(paginaNav)
},[paginaNav])

const editar =(dados:crianca)=>{
    return  rota.push(`/home/paginas/atualizarcrianca?id=${dados.id}`)

}
const excluir=async (id:string)=>{
    try {
          const resposta =await fetch(`http://localhost:3000/api/crianca/${id}`,{
        method:"DELETE"
     })
     if(resposta.status===200){
        setCrianca((lista)=>lista.filter(item=>item.id!==id))
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
        
        {carregando?<Carregando/>:Array.isArray(crianca)&&crianca.length>0?(
        
        crianca.map((item ) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col justify-between"
          >
          
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                
                {item.foto_perfil ? (
                  <img 
                    src={`https://xsyzrgzigoclicnwbxkt.supabase.co/storage/v1/object/public/fotos_perfil/${item.foto_perfil}`} 
                    alt={item.nome} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                    <FaUser className="text-xl" />
                  </div>
                )}
                
               
                <div>
                  <h3 className="font-bold text-gray-800 text-sm tracking-tight">{item.nome}</h3>
                  <p className="text-[11px] text-slate-400">Perfil Cadastrado</p>
                </div>
              </div>

             
              <div className="flex items-center gap-3 text-slate-400">
                <button onClick={()=>{editar(item)}}title="Editar" className="hover:text-blue-600 transition-colors cursor-pointer p-1">
                  <FaPen className="text-xs" />
                </button>

                <button onClick={()=>{excluir(item.id)}} title="Excluir" className="hover:text-red-600 transition-colors cursor-pointer p-1">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>

          
            <div className="flex flex-col gap-2 mt-4 text-xs">
              
              
              <div className="flex items-center gap-2 text-gray-600 bg-slate-50 px-3 py-2 rounded-xl">
                <FaCalendarAlt className="text-slate-400 text-sm" />
                <span className="font-medium">Idade:</span>
                <span className="text-gray-800 font-semibold ml-auto">{item.idade}</span>
              </div>

           
              <div className="flex items-center gap-2 text-gray-600 bg-slate-50 px-3 py-2 rounded-xl">
                <FaBrain className="text-slate-400 text-sm" />
                <span className="font-medium">Autismo:</span>
                <span className="ml-auto bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                  {item.nivel_autismo.replace("_", " ")}
                </span>
              </div>

              
              {item.hiperfoco && (
                <div className="mt-1 text-[11px] text-slate-500 pl-1">
                  ⭐ <span className="font-medium">Hiperfoco:</span> {item.hiperfoco}
                </div>
              )}
            </div>
             <button
             onClick={()=>{setformulariohistoria(true)}}
               type="submit"
              className=" mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
             >
                 Começar Conto
                </button>

                 {formulariohistoria?<Formulariohistoria setformulariohistoria={setformulariohistoria} crianca={item}/>:null}
          </div>
        ))):(<h1 className="text-blue-600 justify-center ">Nenhuma criança cadastrada</h1>)}
        
          
        
         
      </div>
         <Paginacao paginacao={paginacao} setpaginaNav={setpaginaNav} paginaNav={paginaNav}  />
      </div>
       
    )
}