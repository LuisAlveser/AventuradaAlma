import { prisma } from "@/lib/prima";
import { NextBuildContext } from "next/dist/build/build-context";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"
import { supabase } from "../crianca/route";

interface HistoriaInterface{
     texto: string;
    nota ?: number | null;
    imagem1 ? :string 
    imagem2 ? :string 
    crianca_id: string | null;
    criado_em: Date;
    plano ?:string ,
    id:string
}
export async function POST(request: NextRequest) {
  try {
    const conteudo: HistoriaInterface = await request.json();
    const usuario = await prisma.usuario.findUnique({ where: { id: conteudo.id } });

    if (!usuario || (usuario.historias_salvas ?? 0) <= 0) {
      return NextResponse.json({ mensagem: "Limite de histórias atingido" }, { status: 403 });
    }

   
    let nomesImagens: string[] = [];
    if (conteudo.imagem1 && conteudo.imagem2) {
      nomesImagens = await salvar_Imagens(conteudo.imagem1, conteudo.imagem2);
    }

    
    const resultado = await prisma.$transaction(async (tx) => {
   
      await tx.usuario.update({
        where: { id: usuario.id },
        data: { historias_salvas: { decrement: 1 } }
      });

     
      const novaHistoria = await tx.historia.create({
        data: {
          texto: conteudo.texto,
          crianca_id: conteudo.crianca_id,
          nota: 0,
         
          ...(nomesImagens.length > 0 && {
            imagem: {
              create: nomesImagens.map(nome => ({ conteudo: nome }))
            }
          })
        },
        include: { imagem: true } 
      });

      return novaHistoria;
    });

    return NextResponse.json(resultado, { status: 200 });

  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ mensagem: "Erro no servidor" }, { status: 500 });
  }
}

export async function GET(request:NextRequest){
    try {
          const cookieStore = await cookies();
          const token = cookieStore.get('auth_token')?.value;
         
           const usuario= await jwt.decode(token!) as {id:string}|null
            if(!usuario){
               return NextResponse.json({ mensagem:"Usuário não autenticado" }, { status: 404 })
            }
            const url =new URL(request.url)
       
            const {searchParams}=url
            
            const  total_registros:number=await prisma.historia.count({
                where:{
                    crianca:{usuario_id:usuario.id}
                }
            })
            const limite:number=3 //Quantidade de itens a serem mostrados
        const paginaAtual:number=parseInt(searchParams.get("pagina")||"1")
       const numero_paginas=Math.ceil(total_registros/limite)

        const pula_registros:number=(paginaAtual-1)*limite
            const historias=await prisma.historia.findMany({
                where:{crianca:{usuario_id:usuario.id},
            },include:{
                crianca:true,
                imagem:true
            },take:limite,skip:pula_registros
        },)
        if(historias){
            return NextResponse.json({historias:historias,paginacao:{paginaAtual,total_registros,numero_paginas}},{status:200})
        }

    } catch (error) {
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
}
}
const salvar_Imagens = async (imagem1: string, imagem2: string): Promise<string[]> => {
    const urls: string[] = [imagem1, imagem2];
    let retorno: string[] = [];

    if (imagem1 && imagem2) {
        for (const url of urls) {
            try {
               
                const resposta = await fetch(url);
                const blob = await resposta.blob();

              
                const extensao = url.split('.').pop()?.split(/\#|\?/)[0] || 'jpg';
                const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extensao}`;

          
                const { data, error: storageError } = await supabase
                    .storage
                    .from('fotos_perfil')
                    .upload(nomeArquivo, blob, { 
                        contentType: `image/${extensao}`,
                        upsert: false
                    });

                if (storageError) {
                    console.error("Erro no storage:", storageError);
                } else {
                    retorno.push(nomeArquivo);
                    console.log("Upload concluído:", nomeArquivo);
                }
            } catch (err) {
                console.error("Erro ao baixar ou enviar imagem:", err);
            }
        }
        return retorno;
    }
    return retorno;
};

