import { GoogleGenAI } from "@google/genai";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";
import { serialize } from 'cookie'
import OpenAI from 'openai';
import { string } from "zod";
import { text } from "stream/consumers";
import { error } from "console";
import { Crianca } from "@/generated/prisma/client";


interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
    historias_geradas_no_mes:number
    foto:string|null,
    iat?: number; 
    exp?: number;

}
interface HistoriaConteudo{
     crianca:{ 
     id: string,
    nome: string,
    idade: string,
    nivel_autismo: string,
    hiperfoco: string,
    animais_estimacao: string,
    amigos_nomes: string,
    pais: string,
    parentes: string,
    foto_perfil: string,
    usuario_id: string,
    nivel_alfabetizacao: string
}
  conteudo:string
}

export async function POST(request:NextRequest){
    try {
    const token=request.cookies.get("auth_token")?.value
    if(!token){
        return NextResponse.json({mensagem:""},{status:404})
    }
    const usuario:UsuarioToken= jwt.decode(token) as UsuarioToken

    const {conteudo,crianca}:HistoriaConteudo =  await request.json()


      let maxTokens:number
   const prompt= `Crie uma história para uma criança de nome ${crianca.nome}, com idade de ${crianca.idade} anos e autismo de nível ${crianca.nivel_autismo}. Essa criança possui o seguinte nível de alfabetização: ${crianca.nivel_alfabetizacao}, e tem como hiperfoco: ${crianca.hiperfoco}. A história deve dar ênfase nessas preferências: ${conteudo}.

${
  (!crianca.pais && !crianca.parentes && (!crianca.amigos_nomes || crianca.amigos_nomes === "Sem personagens secundários"))
    ? "Não inclua personagens secundários na história."
    : `Personagens secundários que devem aparecer: ${[
        crianca.amigos_nomes,
        crianca.pais,
        crianca.parentes
      ].filter(Boolean).join(", ")}.`
}
**REGRAS DE FORMATAÇÃO E ENVIO:**
1. Escreva o texto de forma natural. Se precisar adaptar para o nível de alfabetização "${crianca.nivel_alfabetizacao}", use palavras mais simples e frases curtas, mas **NÃO separe as palavras por hífens** (evite fazer ca-sa-co, car-ros, brin-ca-va). Escreva as palavras inteiras.
2. Não use aspas curvas (“ ” ou ‘ ’) nem reticências (...). Use estritamente aspas retas (") e apóstrofos retos (').
3. Garanta que a história tenha um início, meio e fim claros, sem cortar a última frase.
**REGRAS DE FORMATAÇÃO E ENVIO:**
1. Escreva o texto de forma natural. Se precisar adaptar para o nível de alfabetização "${crianca.nivel_alfabetizacao}", use palavras mais simples e frases curtas, mas **NÃO separe as palavras por hífens** (evite fazer ca-sa-co, car-ros, brin-ca-va). Escreva as palavras inteiras.
2. Não use aspas curvas (“ ” ou ‘ ’) nem reticências (...). Use estritamente aspas retas (") e apóstrofos retos (').
3. Garanta que a história tenha um início, meio e fim claros, sem cortar a última frase.`

 const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });   
       switch(crianca.nivel_autismo){
        case "NIVEL_1":
        maxTokens = 5500;
        break;
    case "NIVEL_2":
        maxTokens = 4500;
        break;
    default:
        maxTokens = 3500;  
       }
       
     const resposta= await ai.models.generateContent({
       model: "gemini-2.5-flash",
     contents: prompt,
    config:{
       maxOutputTokens:maxTokens    
   } 
})
   const textoGerado = resposta.text;
   
    if(textoGerado){
       
        const result=await prisma.$transaction(async(tx)=>{

          return  await tx.usuario.update({
            where:{id:usuario.id},
            data:{historias_geradas_no_mes:{decrement:1}
        }})
           
        })
        if(result){
             
                   const tokenpayload={
                id:result.id,
                nome:result.nome,
                foto_perfil:result.foto_perfil,
                email:result.email,
                plano:result.plano,
                historias_geradas_no_mes:result.historias_geradas_no_mes
              
              }
              const token=jwt.sign(tokenpayload,process.env.SEGREDO!,{expiresIn:"1h"})
      
            
                
               const resposta= NextResponse.json({texto:textoGerado},{status:200})
                 resposta.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 1, 
        path: '/',
    });
                     
                 return resposta
 
        }
       
    }else{
        return  NextResponse.json({mensagem:"Erro ao gerar texto"},{status:400})
    }
    
    } catch (error) {
        console.log("Erro na geração do texto ",error)
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }
}



