
"use client"
import { usePathname } from 'next/navigation'
import { FaBookOpen, FaUsers } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { IconType } from "react-icons/lib";


import Link from "next/link";

interface ItensNav{
    id:number,
    icon: IconType,
    name: string;
    href: string;
    
}
interface ItensNavArray{
    itens:ItensNav[],
}


export function Navegaçao(){
    const pathname = usePathname();
    
   const itens = [
    { name: 'Histórias Salvas', href: '/home/paginas/historias_salvas',icon: FaBookOpen,id:1},
    { name: 'Adicionar Criança', href: '/home/paginas/adicionar_crianca',icon: TiUserAdd ,id:2},
    { name: 'Crianças Salvas', href: '/home/paginas/criancas_salvas',icon: FaUsers,id:3 },
     { name: 'Planos', href: '/home/paginas/planos',icon: FiLayers,id:4 },
   
  ]
  const Rotaconfiguracao:string= '/home/paginas/configuracoes'
  const ConfigAtivo=pathname===Rotaconfiguracao
    return(
        <>
         <nav className="flex flex-col gap-4" >

                    {itens.map((item) => {
                          const Ativo = pathname === item.href;
                          return(
                      <Link key={item.id} href={item.href}>
                   <div className={`
                            cursor-pointer flex items-center gap-3 w-full px-4 py-3 font-medium rounded-xl transition-all duration-200
                            ${Ativo
                                ? "bg-blue-100 text-blue-600 shadow-sm" 
                                : "text-slate-600 hover:bg-blue-50 hover:text-blue-500" 
                            }
                    `}>                        
                      <item.icon size={20} className="text-blue-500" />
                      <span className="text-sm">{item.name}</span>
                    </div> 
                      </Link>
               )})}
                 
              
           
               
            <div className=" border-t border-slate-100 pt-4 ">
              <Link href={Rotaconfiguracao}>  
               <button className={`flex  cursor-pointer items-center gap-3 w-full px-4 py-3 text-slate-600 font-medium rounded-xl transition-all duration-200 group ${ConfigAtivo?"bg-red-600 text-white":" hover:text-red-600"}`}>
              <IoMdSettings size={20} className={`text-slate-400 group-hover:text-red-500 transition-colors ${ConfigAtivo?"group-hover:text-white text-white":"group-hover:text-red-500"}`} />
              <span className="text-sm">Configurações</span>
          </button>
            </Link>
        </div>
                   
                  </nav>
                 
                 </> 
    )
}