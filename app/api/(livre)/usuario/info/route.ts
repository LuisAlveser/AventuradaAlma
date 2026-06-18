import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { plano } from "@/generated/prisma/enums";
import bcrypt from"bcrypt"
import { UsuarioLogin } from "@/app/modelos";
import { json } from "zod";
import {createPlanoBasico} from "@/lib/stripe"
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
 
   const usuario:UsuarioToken =  await jwt.decode(token) as UsuarioToken
   const info= await prisma.usuario.findFirst({where:{id:usuario.id}})
    if(info){
        if(info?.historias_geradas_no_mes===0||!info?.historias_geradas_no_mes){
           return NextResponse.json({ mesagem:"Você excedeu o número de histórias Geradas" },{status:404})
        }
       return NextResponse.json({plano:info.plano,id:info.id,nome:info.nome},{status:200})
    }
    return NextResponse.json({ usuario },{status:200})
    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }

}
export async function PATCH(request:NextRequest){
      try {
        const usuario= await request.json()
        const  validador=UsuarioLogin.parse(usuario)
        const usuarioemail =await prisma.usuario.findFirst({where:{email:validador.email}})
        if(!usuarioemail){
             return NextResponse.json({mensagem:"Esse email não existe"},{status:404})
        }
        const rodadas=10
        const senhahash= await bcrypt.hash(validador.senha,rodadas)

       const novasenha= await prisma.usuario.update({where:{id:usuarioemail.id},data:{senha:senhahash}})
       if(novasenha){
        return NextResponse.json({mensagem:"Senha atualizada com sucesso"},{status:200})
       }  
    
    } catch (error) {
         return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
      }
}
export async function POST(request:NextResponse){
    try {
        const plano:string=await request.json()
      
          const token = request.cookies.get("auth_token")?.value
         
        if (!token) {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
  } 
 
   const usuario:UsuarioToken =  await jwt.decode(token) as UsuarioToken

       const sessao=await createPlanoBasico(usuario.id,usuario.email,plano)
       if(sessao&&sessao.url){
        return NextResponse.json({sessao},{status:200})
       }
    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }
}