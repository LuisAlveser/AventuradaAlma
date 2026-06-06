import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prima";
import { email } from "zod";
import { serialize } from 'cookie'

export function GET(request:NextRequest){
    try {
        const token = request.cookies.get("auth_token")?.value
         
        if (!token) {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
  } 
   const usuario =  jwt.decode(token)
  
    return NextResponse.json({ usuario },{status:200})
    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }

}
interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
    foto:string|null,
    iat?: number; 
    exp?: number;

}
export async function PATCH(request:NextRequest){
      try {
           const token = request.cookies.get("auth_token")?.value
         const dados=await request.json()
        if (!token) {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 })
  } 
      const usuario:UsuarioToken =  jwt.decode(token) as UsuarioToken
     
      const usuario_atualizado= await prisma.usuario.update({data:dados,where:{id:usuario!.id}})
     if(usuario_atualizado){
 
        const tokenpayload={
            id:usuario_atualizado.id,
            nome:usuario_atualizado.nome,
            email:usuario_atualizado.email,
            foto_perfil:usuario_atualizado.foto_perfil,
            plano:usuario_atualizado.plano
        }
        const token =jwt.sign(tokenpayload,process.env.SEGREDO!,{expiresIn:"1h"})
         const cookie = serialize('auth_token', token, {
                   httpOnly: true,
                   secure: process.env.NODE_ENV === 'production', 
                   maxAge: 60 * 60 * 24 * 7, 
                   path: '/',
           })
               return  NextResponse.json({mensagem:"Atualização feita com sucesso"},
                   {status:200,headers:{"Set-Cookie":cookie}})
     }
      } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
      }
}
export function POST(){
    const cookieDeletado = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, 
    path: '/',
  })

  return NextResponse.json(
    { mensagem: "Logout realizado com sucesso" },
    { 
      status: 200, 
      headers: { "Set-Cookie": cookieDeletado } 
    }
  )
}