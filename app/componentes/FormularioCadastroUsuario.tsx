'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { Botao } from "./Botao";
import { FaUserCircle,FaRegEyeSlash, FaEye, FaEyeSlash} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { IoMdClose } from "react-icons/io"; // Ícone de fechar mais moderno
import { useForm } from "react-hook-form";
import {UsuarioModelo} from "../modelos"
import z from"zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner"
import Link from "next/dist/client/link";
import Carregando from "../Carregando";
import { useRouter } from 'next/navigation';

interface Props {
  setcadastro: Dispatch<SetStateAction<boolean>>;
}
 type UsuarioFormCadastro=z.infer<typeof UsuarioModelo>

export function FormularioUsuario({ setcadastro }: Props) {

   const router = useRouter();
   const [mostrasenha, setmostraSenha] = useState(false);
   const [carregando,setcarregando]=useState(false)
   const {register,handleSubmit,formState:{errors}}=useForm<UsuarioFormCadastro>({
       resolver:zodResolver(UsuarioModelo),
  
  })

  const cadastro = async (data:UsuarioFormCadastro) => {
        try {
            setcarregando(true)
            const usuario= new FormData()
              usuario.append("nome",data.nome)
             usuario.append("email",data.email)
              usuario.append("senha",data.senha)
            
            const response= await fetch("http://localhost:3000/api/usuario/cadastro",{
            method:"POST",
            body:usuario
            }) 
            if(response.status==201){
                setcadastro(false)
                
                router.push("/home"); 
                toast.success("Cadastro realizado com sucesso")
            }
            if(response.status===404){

                toast.error("Esse email já existe")
            }

        } catch (error) {
            setcarregando(false)
            console.log(error)

            toast.error("Erro no servidor")
        }finally{
            setcarregando(false)
        }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form 
        onSubmit={handleSubmit(cadastro)} 
        className="relative flex flex-col justify-center bg-white rounded-2xl gap-5 px-8 py-10 w-full max-w-md shadow-2xl transition-all scale-100"
      >
       
        <button 
          type="button"
          onClick={() => setcadastro(false)} 
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Fechar formulário"
        >
          <IoMdClose size={24} />
        </button>

       
        <div className="text-center mb-2">
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">Comece sua Aventura Agora</h2>
          <p className="text-gray-500 text-sm mt-1">Crie sua conta para personalizar as histórias do seu filho</p>
        </div>

       
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">Nome</label>
          <div className="relative flex items-center">
            <FaUserCircle className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            <input 
            {...register("nome")}
              type="text" 
              placeholder="Digite seu nome" 
              className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm"
              required
            />
          </div>
          {errors.nome&&(<span className="text-red-500">{errors.nome.message}</span>)}
        </div>

      
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

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">Senha</label>
          <div className="relative flex items-center">
            <TbPassword className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            <input 
             {...register("senha")}
              type={mostrasenha?"password":"text" }
              placeholder="Crie uma senha forte" 
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
                    {carregando?<Carregando/>:"Criar Conta"}
                  </button>
          <p className="text-center text-xs text-gray-400 px-4">
            Ao se cadastrar, você concorda com os nossos Termos de Uso e Políticas de Privacidade.
          </p>
        </div>
      </form>
    </div>
  );
}