
import Image from "next/image"
import { FaBookOpen, FaUsers } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import jwt  from "jsonwebtoken"
import { Navegaçao } from "./componentes/Navegação";
import { redirect } from 'next/navigation';

import { cookies } from "next/headers";
interface UsuarioHome{
    id:string,
    nome:string,
    plano:string,
    foto:string|null
}

export default async function Home({ children }: { children: React.ReactNode }) {
  
  const links = [
    { name: 'Histórias Salvas', href: '/home/paginas/historias_salvas',icon: FaBookOpen,id:1},
    { name: 'Adicionar Criança', href: '/home/paginas/adicionar_crianca',icon: TiUserAdd ,id:2},
    { name: 'Crianças Salvas', href: '/home/paginas/criancas_salvas',icon: FaUsers,id:3 },
   
  ]
    
      const cookie=await cookies()
        const token = cookie.get('auth_token')?.value
       let usuario:UsuarioHome|null
  
    usuario = token ? jwt.decode(token) as UsuarioHome:null;
    
  

  return (

    <div className="w-full min-h-screen flex bg-slate-50 text-slate-700 antialiased">
      
      
      <aside className="w-64 md:w-72 bg-white h-screen flex flex-col justify-between p-4 border-r border-slate-100 shadow-sm">
        
       
        <div className="flex flex-col gap-6">
          
         
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-50">
            <div className="relative w-10 h-10 shadow-md rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center">
              <Image 
                src="/Logo_Tcc.png" 
                alt="logo" 
                width={40} 
                height={40} 
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Aventura da Alma
              </h2>
              <p className="text-xs text-slate-400 font-medium">Painel de Controle</p>
            </div>
          </div>
             <Navegaçao itens={links} />
          
        </div>

       
        <div className=" border-t border-slate-100 pt-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 font-medium rounded-xl transition-all duration-200 hover:bg-red-50 hover:text-red-600 group">
            <IoMdSettings size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm">Configurações</span>
          </button>
        </div>

      </aside>

     
      <main className="flex-1 p-8 bg-blue-50/30">
        <header className="mb-6  flex  flex-row justify-between ">
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo de volta!</h1>
           <div className=" flex flex-row justify-center items-end gap-2">
             <FaUserCircle size={30} className="text-blue-500"/>
             <h1 className="text-blue-500">{usuario?.nome}</h1>
             <div className=" border-2 bg-blue-800 rounded-2xl px-2">
               <h2 className="text-white">{usuario?.plano}</h2>
             </div>
           </div>
           
        </header>
        
       
        <div className="border-2 border-dashed border-slate-200 rounded-2xl h-[calc(100vh-160px)] flex items-center justify-center text-slate-400">
          {children} 
          
        </div>
      </main>

    </div>
  )
}