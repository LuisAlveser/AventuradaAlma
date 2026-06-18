import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        
    
    const crianca=  await request.json()
   
      let maxTokens:number
   const prompt= `Crie uma história para uma criança de nome ${crianca.nome}, com idade de ${crianca.idade} anos e autismo de nível ${crianca.nivel_autismo}. Essa criança possui o seguinte nível de alfabetização: ${crianca.nivel_alfabetizacao}, e tem como hiperfoco: ${crianca.hiperfoco}. A história deve dar ênfase nessas preferências: ${crianca.conteudo}.

${
  (!crianca.pais && !crianca.parentes && (!crianca.amigos_nomes || crianca.amigos_nomes === "Sem personagens secundários"))
    ? "Não inclua personagens secundários na história."
    : `Personagens secundários que devem aparecer: ${[
        crianca.amigos_nomes,
        crianca.pais,
        crianca.parentes
      ].filter(Boolean).join(", ")}.`
}

**IMPORTANTE: Não use aspas curvas (“ ” ou ‘ ’) nem reticências (...). Use estritamente aspas retas (") e apóstrofos retos (')."**`

 const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });   
       switch(crianca.nivel_autismo){
        case "NIVEL_1":
            maxTokens=2500
            break;
       
        case "NIVEL_2":
            maxTokens=1500
            break;

         default:
            maxTokens=1000   
       }
       
     const responsta= await ai.models.generateContent({
        model: "gemini-2.5-flash",
     contents: prompt,
    config:{
       maxOutputTokens:maxTokens    
    }
   
})
    if(responsta.data){
      
        return NextResponse.json({texto:responsta.data},{status:200})
    }else{
        return  NextResponse.json({mensagem:"Erro ao gerar texto"},{status:400})
    }
    
    } catch (error) {
        console.log(error)
        return NextResponse.json({mensagem:"Erro no servidor"},{status:500})
    }
}