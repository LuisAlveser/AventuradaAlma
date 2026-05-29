

import { IconType } from "react-icons/lib";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
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
export function Navegaçao({itens}:ItensNavArray){
  
    return(
         <nav className="flex flex-col gap-4" >

                    {itens.map((item) => (
                      <Link key={item.id} href={item.href}>
                    <div  key={item.id} className=" cursor-pointer flex items-center gap-3 w-full px-4 py-3 text-slate-600 font-medium rounded-xl transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        
                      <item.icon size={20} className="text-blue-500" />
                      <span className="text-sm">{item.name}</span>
                    </div> 
                      </Link>
                 ))}
                   
                  </nav>
    )
}