
import { GoogleGenAI } from '@google/genai';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const fs = await import("fs");


export async function  POST(request:NextRequest){
    try {

  const {texto}=await request.json()      
 const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });  

   console.log("Texto para Imagens",texto)
const [imagem1,imagem2]= await Promise.all([
      await ai.interactions.create({
  model: 'gemini-3.1-flash-image',
   input : `Com base nesse texto gere uma ilustração infantil estilo livro de histórias sobre o início deste conto: ${texto}`,
 
  
}),
await  ai.interactions.create({
  model: 'gemini-3.1-flash-image',
  input: `Com base nesse texto gere  uma ilustração infantil estilo livro de histórias sobre o final deste conto: ${texto}`,
   
})
]) 
if(imagem1.output_image?.uri&&imagem2.output_image?.uri){
   
    
        const imagensArray:string[]=[imagem1.output_image.uri,imagem2.output_image.uri]
            console.log("Imagens:",imagensArray)
 return  NextResponse.json({imagens:imagensArray},{status:200})
}
 return NextResponse.json({mensagem:"Error inesperado"},{status:500})


 } catch (error) {
   
    if(error instanceof Error){
       console.log("erro imagens",error)
       return NextResponse.json({mesagem:"Erro no servidor"},{status:500})
    }
   
    return  NextResponse.json({mesagem:"Erro no servidor"},{status:500})


}
}