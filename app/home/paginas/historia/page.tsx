'use client'

import { toast } from "sonner";
import { useHistoria,} from "../../componentes/HistoriaHook";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useEffectEvent, useState } from "react";
import {useRouter} from "next/navigation"
import Carregando from "@/app/Carregando";
import Image from "next/image"
interface resposta{
    plano:string,
    id:string,
    nome:string,
    historias_geradas_no_mes:number
}
interface RespostaIA{
   mensagem: string;
    texto: string;
    
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

export default function Historia({params}:{params:Promise<{id:string}>}){
    const rota=useRouter()
     const {dados,buscarUsuario} = useHistoria();
     const [usuario,setUsuario]=useState<resposta>()
    const [texto,setTexto]=useState<string>("Gerando texto ...")
    let [imagens, setImagens] = useState<string[]|null>(null);
    const [carregando,setcarregando]=useState<boolean>(false)
     const [carregando_historia,setcarregando_historia]=useState<boolean>(true)
        if (!dados) return <p>Nenhum dado encontrado...</p>;
   

useEffect(() => {
    let isMounted = true;

    const gerar_texto = async () => {
        try {
            if (!dados) return;
            
            const response_usuario = await fetch("/api/usuario/info", { method: "GET" });
            
            if (response_usuario.status === 200 && isMounted) {
                const usuario: resposta = await response_usuario.json();
                setUsuario(usuario);

               

                if ( isMounted) {
                    const iatexto=await fetch("http://localhost:3000/api/ia",{
                     method:"POST",
                      headers: {
                      "Content-Type": "application/json"
                                },
                     body:JSON.stringify({crianca:dados.crianca,conteudo:dados.conteudo})  

                    })
                    if(iatexto.status===200){
                       const {texto}: RespostaIA = await iatexto.json()
                       setTexto(texto)
                      
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    
                    await buscarUsuario();
                     

                        if(usuario.plano!=="FREE"){
                        
                        const resposta= await fetch("http://localhost:3000/api/ia/imagens",{
                            
                            method:"POST",
                            headers: {
                                    "Content-Type": "application/json"
                                },
                            body:JSON.stringify({texto:"Gatos"})
                        })
                        console.log("Resposta api",resposta)
                        if(resposta.status===200){
                            
                            const  {imagens:imagens}= await  resposta.json()
                            setImagens([imagens[0],imagens[1]])
                        }
                    }else{
                        setImagens(null)
                    }
                    }   
                    
                }
                
                
            }
        } catch (error) {
            if (isMounted) {
                toast.error("Erro na geração do texto");
                setTexto("Erro ao gerar história. Tente novamente.");
            }
        }finally{
             
            setcarregando_historia(false)
        }
    };

    gerar_texto();

    return () => {
        isMounted = false; 
    };
}, []);




const salva_historia=async (texto:string,id_crianca:string)=>{
         try {
            setcarregando(true)
             if (!usuario||!usuario.id) {
        toast.error("Aguarde o carregamento dos dados do usuário...");
        return;
    }    
    const img1 = imagens && imagens[0] ? imagens[0] : "";
        const img2 = imagens && imagens[1] ? imagens[1] : "";   
             
           
   
            const conteudo:HistoriaInterface={
                texto,
                crianca_id:id_crianca,
                criado_em:new Date(),
                plano:usuario!.plano,
                id:usuario!.id,
                imagem1:img1,
                imagem2:img2
                
            }
           

            const resposta=await fetch("http://localhost:3000/api/historia",{
                method:"POST",
                body:JSON.stringify(conteudo)
            })
            if(resposta.status===200){
                toast.success("História Salva com Sucesso")
             rota.back()
             return
            }
            if(resposta.status===403){
            return    toast.error("Você excedeu o número de histórias salvas, exclua uma para salvar ")
            }
            
         } catch (error) {
           console.error("Erro ao salvar história:", error)
             return    toast.error("Erro Inesperado no Servidor")
         }finally{
          return  setcarregando(false)
         }
 }   





    
    return(
        <div className="flex flex-col justify-start  mt-4  ">
           
            <div className="flex flex-col px-4 py-4 border-4  w-full max-h-80 overflow-y-auto  gap-4 items-center">
                 {imagens&&imagens[0]?carregando_historia?<Carregando/>:<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens![0]} alt="Imagem gerada por IA"/>:null}
        
          <div className="text-black text-base whitespace-pre-line text-justify w-full px-2">
    {texto}
</div>

         {imagens&&imagens[0]?carregando_historia?<Carregando/>:<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens![1]} alt="Imagem gerada por IA"/>:null}

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