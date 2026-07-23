'use client'

import { toast } from "sonner";
import { useEffect, useState, use } from "react";
import { GoogleGenAI } from "@google/genai";

import {useRouter} from "next/navigation"
import Carregando from "@/app/Carregando";
import Image from "next/image"
import { text } from "stream/consumers";
interface Imagem{
    id:string,
    conteudo:string
}


interface Historia{
  historia:{
    id: string;
    texto: string;
    crianca_id: string | null;
    criado_em: Date;
    imagem ?: Imagem[]
  }
} 

export default function Historia({params}:{params:Promise<{id:string}>}){
     const { id } = use(params);
    const [carregando,setcarregando]=useState<boolean>(true)
    const [texto,setTexto]=useState<string>("Gerando texto ...")
    const [imagens, setImagens] = useState<string[]|null>(null);
    const URL_BASE = `${process.env.NEXT_PUBLIC_CAMINHO_PROJETO}`

       
   
useEffect(() => {
    const mostrar_historia = async () => {
      try {
        const resposta = await fetch(`/api/historia/${id}`, {
          method: "GET",
        });

        if (resposta.ok) {
          const { historia }: Historia = await resposta.json();

          setTexto(historia.texto);

          if (Array.isArray(historia.imagem) && historia.imagem.length > 0) {
            const img1 = historia.imagem[0]?.conteudo;
            const img2 = historia.imagem[1]?.conteudo;
            setImagens([img1, img2]);
          } else {
            setImagens(null);
          }
        } else {
          throw new Error("Falha ao buscar história");
        }
      } catch (error) {
        console.error("Erro em ler novamente história", error);
        toast.error("Erro no carregamento do texto");
        setTexto("Erro ao carregar história. Tente novamente.");
      } finally {
        setcarregando(false);
      }
    };

    mostrar_historia();
  }, [id]);



    
    return(
        <div className="flex flex-col justify-start  mt-4  ">
           
         {carregando?
         <div className="flex justify-center items-center">
         <Carregando/>
          </div>
         :
         <div className="flex flex-col px-4 py-4 border-4  w-full max-h-80 overflow-y-auto  gap-4 items-center">
                 {imagens?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={`${URL_BASE}/${imagens[0]}`} alt="Imagem gerada por IA"/>:null}
        
          <h1 className="text-black">{texto}</h1>

         {imagens?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={`${URL_BASE}/${imagens[1]}`} alt="Imagem gerada por IA"/>:null}

         </div>
         
         
         }   
         
          
        </div>
    )
}