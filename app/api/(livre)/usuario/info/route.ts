import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { plano } from "@/generated/prisma/enums";
import bcrypt from"bcrypt"
import { UsuarioAtualizacaoSenha, UsuarioLogin } from "@/app/modelos";
import { json, ZodError } from "zod";
import {createPlanoBasico} from "@/lib/stripe"
interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
    foto:string|null,
    historias_geradas_no_mes:number,
    iat?: number; 
    exp?: number;

}
interface corpo{
    plano:string
}
export async function GET(request:NextRequest){
    try {
        const token = request.cookies.get("auth_token")?.value
         
        if (!token) {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
  } 
 
   const {id}:UsuarioToken =  await jwt.decode(token) as UsuarioToken
   const usuario =await prisma.usuario.findFirst({where:{id:id}})
   
    return NextResponse.json({
        plano:usuario!.plano,
        id:usuario!.id,
        nome:usuario!.nome,
        historias_geradas_no_mes:usuario!.historias_geradas_no_mes

    },{status:200})
    
   
    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }

}
export async function PATCH(request:NextRequest){
      try {
        const {senha,email}= await request.json()
      
        
        
        const usuarioemail =await prisma.usuario.findFirst({where:{email:email}})
        if(!usuarioemail){
             return NextResponse.json({mensagem:"Esse email não existe"},{status:404})
        }
        const rodadas=10
        const senhahash= await bcrypt.hash(senha,rodadas)

       const novasenha= await prisma.usuario.update({where:{id:usuarioemail.id},data:{senha:senhahash}})
       if(novasenha){
        return NextResponse.json({mensagem:"Senha atualizada com sucesso"},{status:200})
       }  
    
    } catch (error) {
          if(error instanceof ZodError ){
            console.log("Erro zod",error.message)
          }
      
         return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
      }
}
export async function POST(request:NextRequest){
    try {
        const corpo:corpo=await request.json()
         const {plano}=corpo
          const token = request.cookies.get("auth_token")?.value
         
        if (!token) {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
  } 
 
 
   const usuario:UsuarioToken =  await jwt.decode(token) as UsuarioToken
   
     if (!usuario || !usuario.id || !usuario.email) {
      return NextResponse.json({ mensagem: "Token inválido" }, { status: 401 })
    }
       const sessao=await createPlanoBasico(usuario.id,usuario.email,plano)
      

       if(sessao&&sessao.url){
         
        return NextResponse.json({sessao},{status:200})
       }
       return NextResponse.json(
      { mensagem: "Não foi possível criar a sessão do checkout" }, 
      { status: 400 }
    );
    } catch (error) {
        console.log("Erro na compra",error)
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }
}