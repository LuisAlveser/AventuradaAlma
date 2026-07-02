import { describe,it ,expect} from 'vitest';
import { email, ZodError } from 'zod';

import {HistoriaFormulario} from "@/app/modelos"

describe("Formulário da Geração da Histórias",()=>{
    it("deve verificar com sucesso caso os campos forem prenchidos corretamente",()=>{
        const historia={
            conteudoHistoria:"eetretertert"
        }

        const objeto=HistoriaFormulario.parse(historia)

        expect(objeto.conteudoHistoria).toBe("eetretertert")
    })
     it("deve verificar com erro caso os campos não tiverem  mais de 2 caracteres",()=>{
        const historia={
            conteudoHistoria:"e"
        }
       
        expect(()=> HistoriaFormulario.parse(historia)).toThrow(ZodError)
    })
})