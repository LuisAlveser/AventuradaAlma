"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { FaUserCircle } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { IoLogOutOutline } from "react-icons/io5";
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import z from "zod"
import {UsuarioAtualizacao} from "@/app/modelos"
import { zodResolver } from "@hookform/resolvers/zod"
import Carregando from "@/app/Carregando"
import {useRouter} from "next/navigation"
interface UsuarioToken{
    usuario:{
    id:string,
    nome:string,
    email:string,
    plano:string,
    foto:string|null,
    iat?: number; 
    exp?: number;
}
}
type AtualizacaoUsuario=z.infer<typeof UsuarioAtualizacao>
export function Configuracao(){
   const [usuario,setusuario]=useState<UsuarioToken["usuario"]|undefined>(undefined)
   const [carregando,setcarregando]=useState<boolean>(false)
  const rota =useRouter()
   const {register,handleSubmit,formState:{errors}}=useForm({
      resolver:zodResolver(UsuarioAtualizacao),
     
   })

   const atualizar=async (data:AtualizacaoUsuario)=>{
         try {
            setcarregando(true)
            const dados={
                nome:data.nome,
                email:data.email
            }
            const resposta= await fetch("http://localhost:3000/api/usuario",{
                method:"PATCH",
                body:JSON.stringify(dados),
                 headers: {
                'Content-Type': 'application/json'
               },
            })
            if(resposta.status===200){
                rota.refresh()
                toast.success("Atualização realizada com sucesso")
            }
            if(resposta.status===500){
                toast.error("Erro na atualização")
            }
         } catch (error) {

            toast.error("Erro no servidor")
         }finally{
            setcarregando(false)
         }
   }
useEffect(()=>{
    const buscarToken=async ()=>{
        try {
          const  resposta= await fetch("http://localhost:3000/api/usuario",{
            method:"GET"
          })
          if(resposta.status===200){
            const dados:UsuarioToken= await resposta.json()
          
           setusuario( dados.usuario)
          }
        } catch (error) {
            toast.error("Erro na busca do token")
        }
    }
     buscarToken()
    
},[])
    const sair=async ()=>{
     const resposta= await fetch("http://localhost:3000/api/usuario",{
        method:"POST"
       })
       if(resposta.status===200){
        rota.push("/")
       }
    }

    return (
        
        <div className="flex flex-col w-full h-auto items-start justify-start px-5 gap-6">
            
            <h1 className="text-2xl font-extrabold text-blue-600 pt-4">Configurações</h1>
            
          
            <form onSubmit={handleSubmit(atualizar)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
                
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-blue-600">Perfil</h2>
                    <p className="text-sm   text-blue-600">Atualize sua foto e detalhes públicos.</p>
                </div>

              
                <div className="flex flex-col gap-4 md:col-span-2 max-w-xl w-full">
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 pl-1">Nome</label>
                        <div className="relative flex items-center">
                            <FaUserCircle className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
                            <input 
                                type="text" 
                                defaultValue={usuario?.nome}
                                {...register("nome")}
                                placeholder="Digite seu nome" 
                                className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm shadow-sm"
                                required
                            />
                        </div>
                          {errors.nome && <span className="text-red-500 text-[10px] font-medium">{errors.nome.message}</span>}

                    </div>
          
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 pl-1">E-mail</label>
                        <div className="relative flex items-center">
                            <MdEmail className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
                            <input 
                                type="email" 
                                 defaultValue={usuario?.email}
                                {...register("email")}
                                placeholder="seu@email.com" 
                                className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm shadow-sm"
                                required
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-[10px] font-medium">{errors.email.message}</span>}

                    </div>
                    

                    <button type="submit" disabled={carregando} className="rounded-2xl text-white cursor-pointer px-5 py-2.5 bg-blue-500 hover:bg-blue-700 font-medium transition-colors w-fit shadow-md">
                     { carregando?<Carregando/> :"Atualizar"}
                    </button>
                </div>
            </form>

          <div className="flex flex-row justify-end w-full">
    <button 
         onClick={sair}
        type="button" 
        className="flex items-center justify-center cursor-pointer text-white gap-2 bg-red-600 px-4 py-2 rounded-2xl hover:bg-red-700 font-medium transition-colors"
    >
        <IoLogOutOutline className="w-4 h-4 text-white" size={30} />
        Sair
    </button>
</div>


<div className="flex flex-row justify-end w-full">
    <button 
        type="button" 
        className="flex items-center justify-center cursor-pointer text-white gap-2 bg-red-600 px-4 py-2 rounded-2xl hover:bg-red-700 font-medium transition-colors"
    >
        <Trash2 className="w-4 h-4 text-white" />
        Excluir minha conta
    </button>
</div>
                  
                
           
        </div>
    )
}