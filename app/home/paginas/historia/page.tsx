'use client'

import { toast } from "sonner";
import { useHistoria, } from "../../componentes/HistoriaHook";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useEffectEvent, useState } from "react";
import {useRouter} from "next/navigation"
import Carregando from "@/app/Carregando";
import Image from "next/image"
interface resposta{
    plano:string,
    id:string,
}
interface HistoriaInterface{
     texto: string;
    nota ?: number | null;
    imagem1 ? :string 
    imagem2 ? :string 
    crianca_id: string | null;
    criado_em: Date;
    plano:string,
    id:string
}
export default function Historia(){
    const rota=useRouter()
     const { dados} = useHistoria();
     const [usuario,setUsuario]=useState<resposta>()
    const [texto,setTexto]=useState<string>("Gerando texto ...")
    let [imagens, setImagens] = useState<string[]>([]);
    const [carregando,setcarregando]=useState<boolean>(false)
   
        if (!dados) return <p>Nenhum dado encontrado...</p>;
   
    
    let maxTokens:number
   const prompt= `Crie uma história para uma criança de nome ${dados.crianca.nome}, com idade de ${dados.crianca.idade} anos e autismo de nível ${dados.crianca.nivel_autismo}. Essa criança possui o seguinte nível de alfabetização: ${dados.crianca.nivel_alfabetizacao}, e tem como hiperfoco: ${dados.crianca.hiperfoco}. A história deve dar ênfase nessas preferências: ${dados.conteudo}.

${
  (!dados.crianca.pais && !dados.crianca.parentes && (!dados.crianca.amigos_nomes || dados.crianca.amigos_nomes === "Sem personagens secundários"))
    ? "Não inclua personagens secundários na história."
    : `Personagens secundários que devem aparecer: ${[
        dados.crianca.amigos_nomes,
        dados.crianca.pais,
        dados.crianca.parentes
      ].filter(Boolean).join(", ")}.`
}

**IMPORTANTE: Não use aspas curvas (“ ” ou ‘ ’) nem reticências (...). Use estritamente aspas retas (") e apóstrofos retos ('). Ao final do texto, inclua exatamente a frase: "História Gerada por ContoTEIA."**`
useEffect(()=>{
    
    const gerar_texto=async ()=>{
          try {
             if (!dados) return;
    // const ai = new GoogleGenAI({ apiKey: process.env.CHAVE_APIGOOGLE });   
       switch(dados.crianca.nivel_autismo){
        case "NIVEL_1":
            maxTokens=2.500
            break;
       
        case "NIVEL_2":
            maxTokens=1.500
            break;

         default:
            maxTokens=1000   
       }
       
    //  const response = await ai.models.generateContent({
   //  model: "gemini-3.5-flash",
  //   contents: prompt,
  //   config:{
  //      maxOutputTokens:maxTokens    
 //    }
   // },);
     
    const response_usuario =await fetch("http://localhost:3000/api/usuario/info",{
        method:"GET"
     })
     if(response_usuario.status===200){
        const  usuario:resposta = await response_usuario.json()
        console.log("Usuario dentro do if",usuario)
         setUsuario(usuario)
        // setTexto(response.data||"Gerando texto...")
     }
   
  
   } catch (error) {
    
      toast.error("Erro na geração do texto")
       setTexto("Erro ao gerar história. Tente novamente.");
  }
    }
    gerar_texto()
   },[dados])




const salva_historia=async (texto:string,id_crianca:string)=>{
         try {
            setcarregando(true)
             if (!usuario||!usuario.id) {
        toast.error("Aguarde o carregamento dos dados do usuário...");
        return;
    }       
             
           
   
            const conteudo:HistoriaInterface={
                texto,
                crianca_id:id_crianca,
                criado_em:new Date(),
                plano:usuario!.plano,
                id:usuario!.id,
                imagem1:imagens[0]||"",
                imagem2:imagens[1]||""
                
            }
           

            const resposta=await fetch("http://localhost:3000/api/historia",{
                method:"POST",
                body:JSON.stringify(conteudo)
            })
            if(resposta.status===200){
                toast.success("História Salva com Sucesso")
            return   rota.back()
            }
            if(resposta.status===403){
            return    toast.error("Você excedeu o número de histórias salvas, exclua uma para salvar ")
            }
            
         } catch (error) {
            console.log(error)
             return    toast.error("Erro Inesperado no Servidor")
         }finally{
          return  setcarregando(false)
         }
 }   





    
    return(
        <div className="flex flex-col justify-start  mt-4  ">
           
            <div className="flex flex-col px-4 py-4 border-4  w-full max-h-80 overflow-y-auto  gap-4 items-center">
                 {imagens.length>0?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens[0]} alt="Imagem gerada por IA"/>:null}
          <h1 className="text-black">A Filosofia da Informação: O Que Nos Torna Humanos?
À medida que as máquinas se tornam cada vez mais capazes de simular a linguagem e o pensamento humano, somos forçados a voltar às perguntas filosóficas mais fundamentais: O que, afinal, nos diferencia das máquinas? O que nos torna humanos?

Se a resposta fosse apenas a capacidade de processar informações, armazenar fatos ou calcular probabilidades, as máquinas já teriam nos superado há muito tempo. A essência do ser humano não reside na eficiência de seu processamento de dados, mas na sua capacidade de sentir, sofrer, intuir e amar.

A máquina opera no reino da sintaxe — as regras, a lógica, os códigos. O ser humano habita o reino da semântica — o significado, a experiência vivida, a consciência do próprio fim. Uma inteligência artificial pode escrever um poema perfeitamente estruturado sobre a dor da perda baseando-se em milhões de textos literários, mas ela própria nunca sentiu a dor do luto, a fragilidade do corpo físico ou o medo do desconhecido.

É precisamente a nossa finitude e a nossa vulnerabilidade que conferem peso e valor ao nosso conhecimento. Quando escolhemos ler um livro difícil, passar tempo em silêncio com um amigo ou contemplar a natureza sem o intermediário de uma tela de celular, estamos afirmando a nossa humanidade contra a torrente de automação que tenta quantificar cada aspecto da nossa existência.

Conclusão: A Escrita do Nosso Próprio Destino
A tecnologia é um espelho amplificado da condição humana. Ela não cria os nossos defeitos, nem inventa as nossas virtudes; ela simplesmente os projeta em escala global e em velocidade da luz. A hiperconectividade e as ferramentas de inteligência artificial são instrumentos de poder inimaginável. Nas mãos de uma sociedade consciente e educada, podem ser a chave para resolver os problemas mais complexos da nossa era, desde crises climáticas até a cura de doenças negligenciadas.

No entanto, se nos deixarmos seduzir pela conveniência do fluxo fácil e pela passividade do consumo desenfreado, correremos o risco de nos transformarmos em engrenagens de um sistema que nos lê melhor do que nós mesmos nos conhecemos.A Filosofia da Informação: O Que Nos Torna Humanos?
À medida que as máquinas se tornam cada vez mais capazes de simular a linguagem e o pensamento humano, somos forçados a voltar às perguntas filosóficas mais fundamentais: O que, afinal, nos diferencia das máquinas? O que nos torna humanos?

Se a resposta fosse apenas a capacidade de processar informações, armazenar fatos ou calcular probabilidades, as máquinas já teriam nos superado há muito tempo. A essência do ser humano não reside na eficiência de seu processamento de dados, mas na sua capacidade de sentir, sofrer, intuir e amar.

A máquina opera no reino da sintaxe — as regras, a lógica, os códigos. O ser humano habita o reino da semântica — o significado, a experiência vivida, a consciência do próprio fim. Uma inteligência artificial pode escrever um poema perfeitamente estruturado sobre a dor da perda baseando-se em milhões de textos literários, mas ela própria nunca sentiu a dor do luto, a fragilidade do corpo físico ou o medo do desconhecido.

É precisamente a nossa finitude e a nossa vulnerabilidade que conferem peso e valor ao nosso conhecimento. Quando escolhemos ler um livro difícil, passar tempo em silêncio com um amigo ou contemplar a natureza sem o intermediário de uma tela de celular, estamos afirmando a nossa humanidade contra a torrente de automação que tenta quantificar cada aspecto da nossa existência.

Conclusão: A Escrita do Nosso Próprio Destino
A tecnologia é um espelho amplificado da condição humana. Ela não cria os nossos defeitos, nem inventa as nossas virtudes; ela simplesmente os projeta em escala global e em velocidade da luz. A hiperconectividade e as ferramentas de inteligência artificial são instrumentos de poder inimaginável. Nas mãos de uma sociedade consciente e educada, podem ser a chave para resolver os problemas mais complexos da nossa era, desde crises climáticas até a cura de doenças negligenciadas.

No entanto, se nos deixarmos seduzir pela conveniência do fluxo fácil e pela passividade do consumo desenfreado, correremos o risco de nos transformarmos em engrenagens de um sistema que nos lê melhor do que nós mesmos nos conhecemos.{dados.crianca.nivel_autismo}</h1>
         {imagens.length>0?<Image className="flex justify-center items-center rounded-2xl"  width={550}  height={300} src={imagens[1]} alt="Imagem gerada por IA"/>:null}

         </div>
         
          <button
              onClick={()=>{salva_historia(texto,dados.crianca.id)}}
               type="submit"
              className=" mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
             >
                 {carregando?<Carregando/>:"Salvar Conto"}
                </button>
        </div>
    )
}