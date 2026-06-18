'use client'

import { toast } from "sonner";
import { useHistoria, } from "../../componentes/HistoriaHook";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useEffectEvent, useState } from "react";
import {useRouter} from "next/navigation"
import Carregando from "@/app/Carregando";
import Image from "next/image"
interface resposta{
    plano:string,
    id:string,
}
interface HistoriaInterface{
     texto: string;
    nota ?: number | null;
    imagem1 ? :string 
    imagem2 ? :string 
    crianca_id: string | null;
    criado_em: Date;
    plano:string,
    id:string
}
export default function Historia(){
    const rota=useRouter()
     const {dados} = useHistoria();
     const [usuario,setUsuario]=useState<resposta>()
    const [texto,setTexto]=useState<string>("Gerando texto ...")
    let [imagens, setImagens] = useState<string[]>([]);
    const [carregando,setcarregando]=useState<boolean>(false)
   
        if (!dados) return <p>Nenhum dado encontrado...</p>;
   

useEffect(()=>{
    
    const gerar_texto=async ()=>{
          try {
             if (!dados) return;
     
     
    const response_usuario =await fetch("http://localhost:3000/api/usuario/info",{
        method:"GET"
     })
     if(response_usuario.status===200){
        const  usuario:resposta = await response_usuario.json()

         setUsuario(usuario)
           const response_texto =await fetch("http://localhost:3000/api/ia",{
        method:"POST",
        body:JSON.stringify(dados.crianca)
     })
     if(response_texto.status===200){
        const texto = await response_texto.json()
        setTexto(texto)
     }
     if(response_texto.status===400){
        toast.error("Erro na geração do texto")
     }
   
     }
   
  
   } catch (error) {
     console.log("Erro na geração da historia",error)
      toast.error("Erro na geração do texto")
       setTexto("Erro ao gerar história. Tente novamente.");
  }
    }
    gerar_texto()
   },[dados])




const salva_historia=async (texto:string,id_crianca:string)=>{
         try {
            setcarregando(true)
             if (!usuario||!usuario.id) {
        toast.error("Aguarde o carregamento dos dados do usuário...");
        return;
    }       
             
           
   
            const conteudo:HistoriaInterface={
                texto,
                crianca_id:id_crianca,
                criado_em:new Date(),
                plano:usuario!.plano,
                id:usuario!.id,
                imagem1:imagens[0]||"",
                imagem2:imagens[1]||""
                
            }
           

            const resposta=await fetch("http://localhost:3000/api/historia",{
                method:"POST",
                body:JSON.stringify(conteudo)
            })
            if(resposta.status===200){
                toast.success("História Salva com Sucesso")
            return   rota.back()
            }
            if(resposta.status===403){
            return    toast.error("Você excedeu o número de histórias salvas, exclua uma para salvar ")
            }
            
         } catch (error) {
            console.log(error)
             return    toast.error("Erro Inesperado no Servidor")
         }finally{
          return  setcarregando(false)
         }
 }   





    
    return(
        <div className="flex flex-col justify-start  mt-4  ">
           
            <div className="flex flex-col px-4 py-4 border-4  w-full max-h-80 overflow-y-auto  gap-4 items-center">
                 {imagens.length>0?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens[0]} alt="Imagem gerada por IA"/>:null}
        
          <h1 className="text-black">{texto}</h1>

         {imagens.length>0?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens[1]} alt="Imagem gerada por IA"/>:null}

         </div>
         
          <button
              onClick={()=>{salva_historia(texto,dados.crianca.id)}}
               type="submit"
              className=" mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
             >
                 {carregando?<Carregando/>:"Salvar Conto"}
                </button>
        </div>
    )
}