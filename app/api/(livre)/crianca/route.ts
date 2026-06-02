
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {CriancaCadastro} from "@/app/modelos"
import { autismo,alfabetizacao, Usuario } from '@/generated/prisma/client'
import { prisma } from '@/lib/prima'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

const supabaseUrl = process.env.PROJETOURL!
const supabaseKey = process.env.APIKEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request:NextRequest){
      try {

   const cookieStore = await cookies();
   const token = cookieStore.get('auth_token')?.value;
  
   const usuario= await jwt.decode(token!) as {id:string}|null

     
        const formData= await request.formData()
        const file = formData.get("foto_perfil") as File | ""
    
     let dadosCrianca= {
      nome: formData.get("nome"),
      idade: formData.get("idade"),
      nivel_autismo: formData.get("nivel_autismo"),
      hiperfoco: formData.get("hiperfoco"),
      pais: formData.get("pais"),
      nivel_alfabetizacao: formData.get("nivel_alfabetizacao"),
      animais_estimacao: formData.get("animais_estimacao") || "",
      amigos_nomes: formData.get("amigos_nomes") || "",
      parentes: formData.get("parentes") || "",
      foto_perfil:""
     }
       

        let fotoUrl=null
        if (file && file.size > 0) {
    
      const extensao = file.name.split('.').pop()
   
      const nomeUnicoArquivo = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extensao}`
   
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('fotos_perfil')
        .upload(nomeUnicoArquivo, file, {
          upsert: false 
        })

      if (storageError) {
        console.log("Erro no storage:",storageError)
        return NextResponse.json({ error: `Erro no upload da imagem: ${storageError.message}` }, { status: 400 })
      }
       dadosCrianca.foto_perfil=nomeUnicoArquivo

       const validador=CriancaCadastro.parse(dadosCrianca)
      
     await prisma.crianca.create({data:{
      nome: validador.nome,
      idade: validador.idade,
      nivel_autismo: validador.nivel_autismo as autismo,
      hiperfoco: validador.hiperfoco,
      pais: validador.pais,
      nivel_alfabetizacao: validador.nivel_alfabetizacao as alfabetizacao,
      animais_estimacao: validador.animais_estimacao,
      amigos_nomes: validador.amigos_nomes,
      parentes: validador.parentes?validador.parentes:"",
      foto_perfil:validador.foto_perfil,
      usuario:{
        connect:{
            id:usuario!.id
        }
      }
     }})
          return NextResponse.json({ 
      success: true, 
      message: "Cadastro realizado com sucesso!",
      fotoUrl: fotoUrl 
    }, { status: 200 })

    }
      } catch (error: any) {
          console.error("Erro na rota POST:", error)
    
   
    if (error.errors) {
      return NextResponse.json({ error: "Dados inválidos", detalhes: error.errors }, { status: 400 })
    }
      }
}