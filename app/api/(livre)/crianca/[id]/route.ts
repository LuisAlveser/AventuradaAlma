import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { CriancaCadastro } from "@/app/modelos";
import { supabase } from "../route";
import { alfabetizacao, autismo } from "@/generated/prisma/enums";
import { ZodError } from "zod";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const id = (await params).id
        if(!id){
         return NextResponse.json({mensagem:"Criança não encontrada"},{status:404})
        }
        const response= await prisma.crianca.findFirst({where:{id:id}})
        if(response){
            return NextResponse.json({crianca:response},{status:200})
        }
    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
       const id = (await params).id
        if(!id){
             return NextResponse.json({mensagem:"Id não encontrada"}, { status: 404 })
        }
        const crianca= await prisma.crianca.findUnique({where:{id:id}})

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
       
         if (file && file.size > 0) {
   const { data, error} = await supabase
              .storage
              .from('fotos_perfil')
              .remove([`${crianca!.foto_perfil}`])
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
                await prisma.crianca.update({where:{id:id},data:{
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
                 
                  }})
                       return NextResponse.json({ 
                   message: "Edição realizada com sucesso com sucesso!",
                 }, { status: 200 })
         }
          const validador=CriancaCadastro.parse(dadosCrianca)
      
     await prisma.crianca.update({where:{id:id},data:{
      nome: validador.nome,
      idade: validador.idade,
      nivel_autismo: validador.nivel_autismo as autismo,
      hiperfoco: validador.hiperfoco,
      pais: validador.pais,
      nivel_alfabetizacao: validador.nivel_alfabetizacao as alfabetizacao,
      animais_estimacao: validador.animais_estimacao,
      amigos_nomes: validador.amigos_nomes,
      parentes: validador.parentes?validador.parentes:"",
      foto_perfil:null,
     
     }})
        return NextResponse.json({ 
      message: "Cadastro realizado com sucesso!",
      
    }, { status: 200 })
    } catch (error ) {
        if(error instanceof ZodError){
            return NextResponse.json({mensagem:"Erro na formulário"}, { status: 400 })
        }
          return NextResponse.json({mensagem:"Erro no servidor"}, { status: 500 })
        

    }
}
export async function DELETE( request: NextRequest,{params}:{params:Promise<{id:string}>}){
       try {
      const {id } =await params
     
      if(!id){
          return NextResponse.json({mesagem:"Id não encontrado"},{status:404})
      }
    
      const crianca =await prisma.crianca.findFirst({where:{id:id}})
      if(crianca?.foto_perfil){
          const { data, error:storageError} = await supabase
              .storage
              .from('fotos_perfil')
              .remove([`${crianca!.foto_perfil}`])
                if (storageError) {
              console.log("Erro no storage:",storageError)
              return NextResponse.json({ error: `Erro na exclução  da imagem: ${storageError.message}` }, { status: 400 })
            }
            const  resposta= await prisma.crianca.delete({where:{id:id}})
         if(resposta){
           return NextResponse.json({mesagem:"Exclução feita com sucesso"},{status:200})
      }
       return NextResponse.json({mesagem:"Id não encontrado"},{status:404})
            
      }
        const  resposta= await prisma.crianca.delete({where:{id:id}})
      if(resposta){
        return NextResponse.json({mesagem:"Exclução feita com sucesso"},{status:200})
      }
       return NextResponse.json({mesagem:"=Id não encontrado"},{status:404})
       } catch (error) {
        console.log(error)
        return NextResponse.json({mensagem:"Erro no servidor"}, { status: 500 })
       }
}