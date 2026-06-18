'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import router from "next/navigation"
import { toast } from "sonner";
import Carregando from "@/app/Carregando";
 
interface Url{
    sessao:{
    url:string
}
}

export default function PlanosHome() {
     const[carregando_plano_basico,setcarregando_plano_basico]=useState<boolean>(false)
      const[carregando_plano_pro,setcarregando_plano_pro]=useState<boolean>(false)

    const comprar_plano=async (plano:string)=>{
        try {
        plano==="BASICO"? setcarregando_plano_basico(true):setcarregando_plano_pro(true)
        const resposta=await fetch("http://localhost:3000/api/usuario/info",{
            method:"POST",
            body:JSON.stringify(plano)
        })  
        if(resposta.status===200){
            const url: Url = await resposta.json()
            rota.push(url.sessao.url)
        }
        if(resposta.status===500){
            toast.error("Erro no direcionamento para pagamento")
        }
        } catch (error) {
             toast.error("Erro no servidor")
        }finally{
            plano==="BASICO"? setcarregando_plano_basico(false):setcarregando_plano_pro(false)
        }
    }
    const rota=router.useRouter()
    const voltar=()=>{
        rota.back()
    }
  return (
    <div className="fixed inset-0 w-full h-screen bg-black/70 backdrop-blur-md z-50 overflow-y-auto flex justify-center md:items-center p-6">
   
      <button
        onClick={voltar}
        className="fixed top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[60] cursor-pointer"
      >
        <IoMdClose size={28} />
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center my-auto w-full max-w-6xl py-12">
        
      
        <div className="flex-1 flex flex-col bg-white/10 border border-white/20 backdrop-blur-lg p-8 rounded-3xl text-white transition-transform hover:scale-105">
          <h2 className="text-xl font-medium text-blue-300">Grátis</h2>
          <div className="my-6">
            <span className="text-5xl font-bold">R$ 0</span>
            <span className="text-blue-200/60">/sempre</span>
          </div>
          <ul className="flex-1 space-y-4 mb-8">
            <Feature text=" Até 3 histórias" />
             <Feature text=" Salve até 2 crianças" />
            <Feature text="Salve até 2 histórias" />
            <Feature text="Sem imagens" crossout />
          </ul>
          <button className=" cursor-pointer w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 transition-colors">
            Você já está nesse plano
          </button>
        </div>

        
        <div className="flex-1 flex flex-col bg-blue-600 border-2 border-blue-400 p-8 rounded-3xl text-white shadow-2xl shadow-blue-500/20 transform md:scale-110 z-10 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
           Mais Popular
          </div>
          <h2 className="text-xl font-medium text-blue-100">Básico</h2>
          <div className="my-6">
            <span className="text-5xl font-bold">R$ 29</span>
            <span className="text-blue-100/60">,90/mês</span>
          </div>
          <ul className="flex-1 space-y-4 mb-8">
            <Feature text="20 histórias por mês" />
            <Feature text="Salve até 10 histórias" />
              <Feature text=" Salve até 10 crianças" />
            <Feature text="Imagens inclusas" />
          </ul>
          <button onClick={()=>{comprar_plano("BASICO")}} className=" cursor-pointer w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-lg">
          {carregando_plano_basico?<Carregando/>:" Assinar"}  
          </button>
        </div>

      
        <div className="flex-1 flex flex-col bg-white/10 border border-white/20 backdrop-blur-lg p-8 rounded-3xl text-white transition-transform hover:scale-105">
          <h2 className="text-xl font-medium text-blue-300">Pró</h2>
          <div className="my-6">
            <span className="text-5xl font-bold">R$ 59</span>
            <span className="text-blue-200/60">,90/mês</span>
          </div>
          <ul className="flex-1 space-y-4 mb-8">
            <Feature text="100 histórias por mês" />
            <Feature text="Salve até 100 histórias" />
              <Feature text=" Salve até 50 crianças" />
            <Feature text="Imagens inclusas" />
          </ul>
          <button onClick={()=>{comprar_plano("PRO")}} className=" cursor-pointer w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-colors border border-blue-400">
            {carregando_plano_pro?<Carregando/>:" Assinar"}  
          </button>
        </div>

      </div>
    </div>
  );
}


function Feature({ text, crossout }: { text: string; crossout?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${crossout ? "opacity-40" : ""}`}>
      <IoMdCheckmarkCircle className={crossout ? "text-gray-400" : "text-blue-300"} size={20} />
      <span className={`text-sm ${crossout ? "line-through" : ""}`}>{text}</span>
    </li>
  );
}