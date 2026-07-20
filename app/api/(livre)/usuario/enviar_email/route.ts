import { UsuarioEnvioEmail } from "@/app/modelos"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import {enviar_email} from "@/lib/nodemailer"


export async function POST(request:NextRequest) {
        try {

        const usuariologin= await request.json()
        console.log("Email usuario",usuariologin)
        const validador=UsuarioEnvioEmail.parse(usuariologin)

        const {email}=validador
      
        const usuario=await prisma.usuario.findFirst({where:{email:email}})
         if(!usuario){
           return NextResponse.json({mensagem:"Email ao senha incorretos"},{status:404})
         }
         
    
        enviar_email(email)
            return NextResponse.json({mensagem:"Email enviado"},{status:200})

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