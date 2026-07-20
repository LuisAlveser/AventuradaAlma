import { prisma } from "@/lib/prisma"
import { serialize } from "cookie"
import jwt from "jsonwebtoken"

export  async function criartoken(){
    const id= "05c3a99d-cab0-41c2-960e-1d80610bf9bb"
    const usuario=await prisma.usuario.findFirst({where:{id:id}})
  if (!usuario) {
    throw new Error(`Usuário com ID ${id} não foi encontrado.`)
  }
  const tokenpayload={
          id:usuario.id,
          nome:usuario.nome,
          foto_perfil:usuario.foto_perfil||"",
          email:usuario.email,
          plano:usuario.plano,
          historias_geradas_no_mes:usuario.historias_geradas_no_mes||5
        
        }
        
           const token=jwt.sign(tokenpayload,process.env.SEGREDO!,{expiresIn:"1h"})
              return token  
}