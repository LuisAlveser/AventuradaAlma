
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {UsuarioLogin, UsuarioModelo} from "@/app/modelos"
import { serialize } from 'cookie'
import jwt  from "jsonwebtoken"
import  bcrypt from "bcrypt"
import { plano } from "@/generated/prisma/enums";
import {createCustumer}from "@/lib/stripe"
export async function POST(request: NextRequest) {
  

  try {
    const formdata = await request.formData();
    
     
    const data = {
      nome: formdata.get("nome"), 
      email: formdata.get("email"),
      senha: formdata.get("senha"),
    };
  

    const validador = UsuarioModelo.parse(data)

    const emailUsuario= await prisma.usuario.findFirst({where:{email:validador.email}})

      if(emailUsuario){
      
        return NextResponse.json({messagem:"Esse usuário já existe"},{status:404})
      }
      const rodadas=10
     const senha = await bcrypt.hash(validador.senha,rodadas)
      const customer=await createCustumer({email:validador.email,name:validador.nome})

     const response=await prisma.usuario.create({
      data:{
        nome:validador.nome,
        email:validador.email,
        senha:senha,
        historias_geradas_no_mes:3,
        historias_salvas:3,                     
        stripe_customer_id:customer.id,
       
      },
    })
    if(response){
     
      const tokenpayload={id:response.id,nome:response.nome,email:response.email,plano:response.plano,foto:response.foto_perfil}

      const token=jwt.sign(tokenpayload,process.env.SEGREDO!,{expiresIn:"1h"})

      const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
   })
    return  NextResponse.json({mensagem:"Cadastro Realizado com sucesso"},
      {status:201,headers:{"Set-Cookie":cookie}})
    }
    
      
  } catch (error: any) {
    if(error instanceof ZodError){
         return NextResponse.json({error:error.cause},{status:404})
    }
    return NextResponse.json(
      { erro: error.message || "Erro interno" }, 
      { status: 500 }
    );
  }
}