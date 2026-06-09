'use client'

import { HistoriaFormulario } from "@/app/modelos";
import { alfabetizacao, autismo } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import {useRouter} from "next/navigation"
import z from "zod"

import { toast } from "sonner";
import Carregando from "@/app/Carregando";
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

interface Props{
    setformulariohistoria:Dispatch<SetStateAction<boolean>>
    crianca:crianca
}


type HistoriaConteudo=z.infer<typeof HistoriaFormulario>



export function Formulariohistoria({setformulariohistoria,crianca}:Props){
    const rota=useRouter()
    const { setDados} = useHistoria();
     const [carregando,setcarregando]=useState<boolean>(false)

   const {register,handleSubmit,formState:{errors}}=useForm({
    resolver:zodResolver(HistoriaFormulario)
   })

  const ir_para_historia=(data:HistoriaConteudo)=>{
             try {
                setcarregando(true)
               
              setDados({
                crianca,
                conteudo:data.conteudoHistoria
              })
          rota.push(`/home/paginas/historia`,)
           } catch (error) {
            console.log(error)
                toast.error("Erro em gerar a História")
             }finally{
                setcarregando(false)
             }
}


    return(
         <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
              <form 
                onSubmit={handleSubmit(ir_para_historia)}
                className="relative flex flex-col justify-center bg-white rounded-2xl gap-5 px-8 py-10 w-full max-w-md shadow-2xl transition-all scale-100"
              >
               
                <button 
                  type="button"
                  onClick={()=>{setformulariohistoria(false)}}
                  className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Fechar formulário"
                >
                  <IoMdClose size={24} />
                </button>
                   <div className="text-center mb-2">
                           <h2 className="text-gray-800 text-2xl font-bold trac
                           king-tight">Comece sua Aventura Agora</h2>
                           <p className="text-gray-500 text-sm mt-1">Digite quais assuntos você gostaria que a história abordasse. Quanto mais detalhes você forneser  </p>
                         </div>
                 
                        
                         <div className="flex flex-col gap-1">
                           <label className="text-sm font-medium text-gray-700 pl-1">Assunto</label>
                           <div className="relative flex items-center">
                           
                             <textarea
                           
                               {...register("conteudoHistoria")}
                               placeholder="Ex:Amizade.." 
                               className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm"
                               required
                             />
                           </div>
                           {errors.conteudoHistoria&&<span className="text-red-600">{errors.conteudoHistoria.message}</span>}
                             <button
                             
                        type="submit"
                        disabled={carregando}
                        className=" mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
                    >
                  { carregando?<Carregando/>:"Começar História"}
                    </button>
                           </div>
               
               
              </form>
            </div>
    )
}