'use client'
import { Cabecalho } from "@/app/componentes/Cabecalho";
import { Botao } from "@/app/componentes/Botao";
import { CardsHome } from "./componentes/CardsHome";
import { FaBookOpen, FaUserAlt,FaImage } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FormularioUsuario } from "./componentes/FormularioCadastroUsuario";
import { Login } from "./componentes/FormularioLoginUsuario";
import { Planos } from "./componentes/Planos";
import { email } from "zod";
import { FormularioAlterarSenha } from "./componentes/FormularioAlterarSenha";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default function Home({searchParams}:PageProps) {

  const[login,setlogin]=useState<boolean>(false)
  const[cadastro,setcadastro]=useState<boolean>(false)
  const[planos,setplanos]=useState<boolean>(false)
  const[alterarsenhaformulario,setalterarsenhaformuario]=useState<boolean>(false)
  const[alterarsenhaEmail,setalterarsenhaEmail]=useState<string>("")
  
   useEffect(()=>{
    const buscar_email=async ()=>{
        const {email}= await searchParams
       
        if(email){
          setalterarsenhaEmail(email)
          setalterarsenhaformuario(true)
        }else{
          setalterarsenhaEmail("")
        }
    }
     buscar_email()
   },[])
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-blue-300">
     
      <Cabecalho setcadastro={setcadastro} setlogin={setlogin} />

    
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-16 p-5">
           {cadastro&&(<FormularioUsuario setcadastro={setcadastro}/>)}
            {login&&(<Login setlogin={setlogin}/>)}
            {planos&&(<Planos setplanos={setplanos}/>)}
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-4xl md:text-5xl text-black font-bold leading-tight">
            Histórias que encantam e ensinam, feitas para seu filho
          </h1>
          
          <p className="text-lg text-gray-800 font-medium max-w-md">
            Crie aventuras únicas adaptadas ao perfil sensorial e cognitivo 
            do seu filho com auxílio de nossa inteligência artificial.
          </p>

          <div className="flex flex-row items-center gap-4 pt-2">
            <Botao FormOpen={()=>setcadastro(true)}>Experimente Grátis</Botao>
            <Botao  FormOpen={()=>setplanos(true)}>Conheça nossos Pacotes</Botao>
          </div>
        </div>

        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:grid-rows-2 justify-center items-center">
  
  <CardsHome 
  icone={FaBookOpen}
  titulo_card="Personalização Única"
  texto_card="Histórias sob medida feitas com base nos interesses, temas preferidos e rotina do seu filho." 
     />

  <CardsHome 
   icone={FaUserAlt}
  titulo_card="Foco no Perfil Sensorial"
  texto_card="Narrativas e comprimentos adaptados ao nível de autismo e às necessidades cognitivas da criança." 
   />

   <CardsHome 
   icone={FaImage}
  titulo_card="Ilustrações Inclusivas"
  texto_card="Imagens geradas automaticamente por IA para engajar visualmente e facilitar a compreensão." 
   />

   <CardsHome 
    icone={IoLibrary}
  titulo_card="Biblioteca e Planos"
  texto_card="Guarde as aventuras favoritas do seu pequeno e escolha o plano que melhor se adapta à sua família." 
    />
         
        </div>
       {alterarsenhaformulario?
       <FormularioAlterarSenha setalterarsenhaformuario={setalterarsenhaformuario}
       alterarsenhaEmail={alterarsenhaEmail}
       />
       :null
       }
      </main>
    </div>
  );
}