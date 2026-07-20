import { describe,it ,expect} from 'vitest';
import { email, ZodError } from 'zod';

import {CriancaCadastro} from "@/app/modelos"

describe("Testes para criança",()=>{
    it("deve verificar sucesso para os dados obrigatórios de cadastro para criança ",()=>{
        const crianca={
              nome: "Luis",
              idade:"12",
              nivel_autismo :"Nivel 3",
              hiperfoco:"Carros",
              pais :"Ana e Marcos",
              nivel_alfabetizacao :"Silabica",
        }
        const objeto= CriancaCadastro.parse(crianca)      
        expect(objeto.nome).toBe("Luis")
        expect(objeto.idade).toBe("12")
        expect(objeto.nivel_autismo).toBe("Nivel 3")
        expect(objeto.hiperfoco).toBe("Carros")
        expect(objeto.nivel_alfabetizacao).toBe("Silabica")
        expect(objeto.animais_estimacao).toBe("null")
        expect(objeto.foto_perfil).toBe("null")
        expect(objeto.parentes).toBe("null")
        expect(objeto.amigos_nomes).toBe("null")

    })
    it("deve verificar erro  para falta de dados obrigatórios de cadastro para criança ",()=>{
        const crianca={
             
              idade:"12",
              nivel_autismo :"Nivel 3",
              hiperfoco:"Carros",
              pais :"Ana e Marcos",
              nivel_alfabetizacao :"Silabica",
        }
       expect(()=>CriancaCadastro.parse(crianca)).toThrow(ZodError)     
    

    })
})