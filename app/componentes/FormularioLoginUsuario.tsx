'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { Botao } from "./Botao";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { IoMdClose } from "react-icons/io"; // Ícone de fechar mais moderno

interface Props {
  setlogin: Dispatch<SetStateAction<boolean>>;
}

export function Login({ setlogin }: Props) {
    const [mostrasenha, setmostraSenha] = useState(false);

    
  const cadastro = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Olá");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <form 
        onSubmit={cadastro} 
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

       
        <div className="text-center mb-2">
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">Bem Vindo</h2>
          <p className="text-gray-500 text-sm mt-1">Começe a criar histórias</p>
        </div>

       
    

      
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">E-mail</label>
          <div className="relative flex items-center">
            <MdEmail className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-slate-50 text-gray-800 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 outline-none border border-slate-200 focus:border-blue-400 focus:bg-white transition-all text-sm"
              required
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 pl-1">Senha</label>
          <div className="relative flex items-center">
            <TbPassword className="absolute left-3.5 text-gray-400 pointer-events-none" size={20} />
            <input 
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
        </div>

      
        <div className="flex flex-col gap-3 mt-4">
          <Botao >
            Entrar
          </Botao>
          <p className="text-center text-xs text-gray-400 px-4">
           Esqueceu sua senha ? <button className="cursor-pointer text-blue-500">Clique aqui!</button>
          </p>
        </div>
      </form>
    </div>
  );
}