
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {UsuarioLogin, UsuarioModelo} from "@/app/modelos"
import { serialize } from 'cookie'
import jwt  from "jsonwebtoken"
import  bcrypt from "bcrypt"




export async function POST(request:NextRequest) {
        try {

        const usuariologin= await request.json()
       
        const validador=UsuarioLogin.parse(usuariologin)

        const {email,senha}=validador

        const usuario=await prisma.usuario.findFirst({where:{email:email}})
         if(!usuario){
           return NextResponse.json({mensagem:"Email ao senha incorretos"},{status:404})
         }
        const senhacomparacao= await bcrypt.compare(senha,usuario?.senha)
        if(!senhacomparacao){
          return NextResponse.json({mensagem:"Email ao senha incorretos"},{status:404})
        }
        const tokenpayload={
          id:usuario.id,
          nome:usuario.nome,
          foto:usuario.foto_perfil,
          email:usuario.email,
          plano:usuario.plano,
          historias_geradas_no_mes:usuario.historias_geradas_no_mes
        
        }
        const token=jwt.sign(tokenpayload,process.env.SEGREDO!,{expiresIn:"1h"})

           const cookie = serialize('auth_token', token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production', 
           maxAge: 60 * 60 * 24 * 7, 
           path: '/',
   })
       return  NextResponse.json({mensagem:"Login Realizado com sucesso"},
           {status:201,headers:{"Set-Cookie":cookie}})
    

        } catch (error: any) {
          console.log(error)
    if(error instanceof ZodError){
         return NextResponse.json({error:error.cause},{status:404})
    }
    return NextResponse.json(
      { erro: error.message || "Erro interno" }, 
      { status: 500 }
    );
  }
}