
import { GoogleGenAI } from '@google/genai';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';




export async function  POST(request:NextRequest){
    try {

  const {texto}=await request.json()      
 const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });  

   console.log("História para o prompt das imagens",texto)
const [imagem1,imagem2]= await Promise.all([
       ai.interactions.create({
  model: 'gemini-3.1-flash-lite-image',
   input : `Com base nesse texto gere uma ilustração infantil estilo livro de histórias sobre o início deste conto: ${texto}`,
   response_format:{
     type: "image",
  }
  
}),
     ai.interactions.create({
  model: 'gemini-3.1-flash-lite-image',
  input: `Com base nesse texto gere  uma ilustração infantil estilo livro de histórias sobre o final deste conto: ${texto}`,
  response_format:{
     type: "image",
  }
})
]) 
if(!imagem1.output_image?.data || !imagem2.output_image?.data){
  return NextResponse.json({mensagem:"Error inesperado"},{status:500})
    
    
}
 const base64Image1 = imagem1.output_image?.data;
    const base64Image2 = imagem2.output_image?.data;


   const imagensArray:string[]=[
    `data:image/png;base64,${base64Image1}`,
    `data:image/png;base64,${base64Image2}`]
          
 return  NextResponse.json({imagens:imagensArray},{status:200})
 

 } catch (error) {
   
    if(error instanceof Error){
       console.log("erro imagens",error)
       return NextResponse.json({mesagem:"Erro no servidor"},{status:500})
    }
   
    return  NextResponse.json({mesagem:"Erro no servidor"},{status:500})


}
}