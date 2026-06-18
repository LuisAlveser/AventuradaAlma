
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";
interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
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
           
          const numero_histarias_geadas= await prisma.usuario.findFirst({where:{id:usuario.id}})
             if(numero_histarias_geadas?.historias_geradas_no_mes){
                console.log("Numero de histórias :",numero_histarias_geadas)
                if(numero_histarias_geadas.historias_geradas_no_mes<=0){
                    return NextResponse.json({ mensagem: "Você  excedeu o número de histórias geradas" }, { status: 404 })
                }
                else{
                
                   const resposta= await prisma.usuario.update({
                     where: { id: usuario.id },
                    data: { historias_geradas_no_mes: { decrement: 1 } } 
                   });
                    if(resposta){
                         return NextResponse.json({ mensagem: "Avaçar para próximo tela" }, { status: 200 })
                    }
              
               
                }

             }
     } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"})
    }
}
