'use client'

import { Dispatch, SetStateAction, useState } from "react";

import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";

import { TbPassword } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import {UsuarioAtualizacaoSenha} from "../modelos"
import z from"zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner"

import Carregando from "../Carregando";


interface Props {
  setalterarsenhaformuario: Dispatch<SetStateAction<boolean>>;
  alterarsenhaEmail:string
}
type UsuarioAtualizacaoSenha=z.infer<typeof  UsuarioAtualizacaoSenha>

export function FormularioAlterarSenha({ setalterarsenhaformuario ,alterarsenhaEmail}: Props) {

    const [mostrasenha, setmostraSenha] = useState<boolean>(false);
    const [carregando,setcarregando]=useState<boolean>(false)
   
    const {register,handleSubmit,formState:{errors}}=useForm<UsuarioAtualizacaoSenha>({
        resolver:zodResolver( UsuarioAtualizacaoSenha)
    })
     

 
   const atualizarSenha = async (data: UsuarioAtualizacaoSenha) => {

    try {
            setcarregando(true)
            const response =await fetch("/api/usuario/info",{
               headers: {
                'Content-Type': 'application/json',
               },
               method:"PATCH",
              body: JSON.stringify({
                email:alterarsenhaEmail,
                senha:data.senha
              }),
            })
            if(response.status===200){
             toast.success("Senha atualizada com sucesso")
            }
            if(response.status===404){
                   
                 toast.error("Esse email não existe")
            }


        } catch (error) {
            toast.success("Erro ao atualizar senha")
     } 
     finally{
          
           setcarregando(false)
     }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form 
        onSubmit={ handleSubmit(atualizarSenha)} 
        className="relative flex flex-col justify-center bg-white rounded-2xl gap-5 px-8 py-10 w-full max-w-md shadow-2xl transition-all scale-100"
      >
       
        <button 
          type="button"
          onClick={() => setalterarsenhaformuario(false)} 
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Fechar formulário"
        >
          <IoMdClose size={24} />
        </button>

       
       
              <div className="text-center mb-2">
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">Digite sua Nova Senha</h2>
         
        </div>
      

       
    

      
       

       <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">Senha</label>
          <div className="relative flex items-center">
            <TbPassword className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            
            <input 
              {...register("senha")}
              type={mostrasenha?"password":"text"} 
              placeholder="Digite sua senha" 
              className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm"
              required
            />
           
             <button
               type="button"
               onClick={() => setmostraSenha(!mostrasenha)}
               className="absolute right-3.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer focus:outline-none"
                >
              {mostrasenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
             </button>

          </div>
           {errors.senha&&(<span className="text-red-500">{errors.senha.message}</span>)}
        </div>
       
       

      
        <div className="flex flex-col gap-3 mt-4">
           <button disabled={carregando} className="rounded-2xl  cursor-pointer px-4 py-2  bg-blue-500 hover:bg-blue-700" >
                              {carregando?<Carregando/>:"Alterar Senha"}
                            </button>

        
        </div>
      </form>
    
    </div>
  );
}