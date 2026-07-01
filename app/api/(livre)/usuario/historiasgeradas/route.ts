
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";
interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
    historias_geradas_no_mes:number,
    foto:string|null,
    iat?: number; 
    exp?: number;

}
export async function GET(request:NextRequest){
    try {
       
         const token = request.cookies.get("auth_token")?.value
           
                if (!token) {
            return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
          } 
              const usuario:UsuarioToken =   await jwt.decode(token) as UsuarioToken
           
         
                console.log("Numero de histórias :",usuario.historias_geradas_no_mes)
                if(usuario.historias_geradas_no_mes<=0){
                    return NextResponse.json({ mensagem: "Você  excedeu o número de histórias geradas" }, { status: 404 })
                }
                
                
                   const resposta= await prisma.usuario.findFirst({
                     where: { id: usuario.id },
                   
                   });
                    if(resposta){
                         return NextResponse.json({ mensagem: "Avaçar para próximo tela" }, { status: 200 })
                    }
              
               
                
             
     } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"})
    }
}
