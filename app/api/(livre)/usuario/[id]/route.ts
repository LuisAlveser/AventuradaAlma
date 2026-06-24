import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { serialize } from 'cookie'

export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){
     try {
        const {id}=await params
        console.log("Id eduardo",id)
        const resposta= await prisma.usuario.delete({where:{id:id}})
        if(!resposta){
            return NextResponse.json({mensagem:"Id não encontrada"},{status:404})  
        }
         const cookieDeletado = serialize('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0, 
            path: '/',
          })
    
        return NextResponse.json({mensagem:"Usuário excluido com sucesso"},{status:200})
     } catch (error) {
       
         return NextResponse.json({mensagem:"Error no servidor"},{status:500})
     }
}