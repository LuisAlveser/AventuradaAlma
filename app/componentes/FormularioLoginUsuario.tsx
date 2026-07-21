'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { Botao } from "./Botao";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { IoMdClose } from "react-icons/io"; // Ícone de fechar mais moderno
import { useForm } from "react-hook-form";
import {UsuarioEnvioEmail, UsuarioLogin} from "../modelos"
import z from"zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import Carregando from "../Carregando";
import { FormularioRecuperaSenha } from "./FormularioRecuperaSenha";

interface Props {
  setlogin: Dispatch<SetStateAction<boolean>>;
}
type UsuarioEsquemaLogin=z.infer<typeof  UsuarioLogin>
type UsuarioEnviarEmail =z.infer<typeof UsuarioEnvioEmail>
export function Login({ setlogin }: Props) {
    const [mostrasenha, setmostraSenha] = useState<boolean>(false);
    const [carregando,setcarregando]=useState<boolean>(false)
     const router = useRouter();
     const [recuperarSenha,setRecuperarSenha]=useState<boolean>(false)
    const {register,handleSubmit,formState:{errors}}=useForm<UsuarioEsquemaLogin>({
        resolver:zodResolver( UsuarioLogin)
    })
     

  

  const login = async (data: UsuarioEsquemaLogin) => {
    try {
            setcarregando(true)
            const response =await fetch(("/api/usuario/login"),{
               headers: {
                'Content-Type': 'application/json',
               },
               method:"POST",
              body: JSON.stringify({
                email:data.email,
                senha:data.senha
              }),
            })
            if(response.status===201){
                 setlogin(false)
                router.push("/home"); 
             toast.success("Login realizado com sucesso")
            }
            if(response.status===404){
                  
                 toast.error("Email ou Senha inválidos")
            }


        } catch (error) {
              
           
            toast.success("Erro ao logar")
     } 
     finally{
           setcarregando(false)
     }
  };
  const enviar_email=async (data:UsuarioEnviarEmail)=>{
       try {
        setcarregando(true)
         const resposta=await fetch("/api/usuario/enviar_email",{
            method:"POST",
            body:JSON.stringify({email:data.email})

         })
         if(resposta.status===200){
           return toast.success("Email enviado com sucesso")
         }
        
         if(resposta.status===404){
           return toast.error("Esse email não existe")
         }
       } catch (error) {
        toast.error("Erro ao enviar email")
       }finally{
        setcarregando(false)
       }

  }
  
  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form 
        onSubmit={recuperarSenha ? ()=>{enviar_email} : handleSubmit(login)} 
        className="relative flex flex-col justify-center bg-white rounded-2xl gap-5 px-8 py-10 w-full max-w-md shadow-2xl transition-all scale-100"
      >
       
        <button 
          type="button"
          onClick={() => setlogin(false)} 
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Fechar formulário"
        >
          <IoMdClose size={24} />
        </button>

       
       {recuperarSenha ?
              <div className="text-center mb-2">
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">Altere sua Senha</h2>
           <p className="text-gray-500 text-sm mt-1">Você receberá o email de confirmação, fique atento a sua caixa de spam</p>
        </div>
        :
        <div className="text-center mb-2">
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">Bem Vindo</h2>
          <p className="text-gray-500 text-sm mt-1">Começe a criar histórias</p>
        </div>
       } 

       
    

      
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">E-mail</label>
          <div className="relative flex items-center">
            <MdEmail className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            <input 
            {...register("email")}
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm"
              required
            />
          </div>
          {errors.email&&(<span className="text-red-500">{errors.email.message}</span>)}
        </div>

       {recuperarSenha?
         null
       :   <div className="flex flex-col gap-1">
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
       }
       

      
        <div className="flex flex-col gap-3 mt-4">
           <button disabled={carregando} className="rounded-2xl  cursor-pointer px-4 py-2  bg-blue-500 hover:bg-blue-700" >
                              {carregando?<Carregando/>:recuperarSenha?"Enviar Email":"Entrar"}
                            </button>

          {recuperarSenha?
             <p className="text-center text-xs text-gray-400 px-4">
           Faça o Login <button onClick={()=>{setRecuperarSenha(!recuperarSenha)}} className="cursor-pointer text-blue-500">Clique aqui!</button>
          </p>
          :<p className="text-center text-xs text-gray-400 px-4">
           Esqueceu sua senha ? <button onClick={()=>{setRecuperarSenha(!recuperarSenha)}} className="cursor-pointer text-blue-500">Clique aqui!</button>
          </p>}
        </div>
      </form>
      {recuperarSenha?<FormularioRecuperaSenha setRecuperarSenha={setRecuperarSenha} />:null}
    </div>
  );
}