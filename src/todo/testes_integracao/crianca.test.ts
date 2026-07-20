import { describe,it ,expect,vi,beforeEach,} from 'vitest';
import {POST,GET} from "@/app/api/(livre)/crianca/route"
import {PATCH,DELETE} from "@/app/api/(livre)/crianca/[id]/route"
import { NextRequest } from 'next/server';
import {criartoken} from "@/src/todo/utils/criacao_token"
import { string } from 'zod';
import { cookies } from 'next/headers';

let mockToken = '';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === 'auth_token') {
        return { value: mockToken };
      }
      return undefined;
    }),
  })),
}));


describe("Teste Criança",()=>{
    beforeEach(async () => {
   
    mockToken = await criartoken();
  });
   /* it("deve verificar sucesso caso todos os campos sejam preechidos corretamente", async ()=>{
        
          const formData= new FormData()
        formData.append("nome", "Carlos Luis");
    formData.append("idade", "13");
    formData.append("nivel_autismo", "NIVEL_2");
    formData.append("hiperfoco", "CARROS");
    formData.append("pais", "Mãe:Ana");
    formData.append("nivel_alfabetizacao", "SILABICA");
    formData.append("animais_estimacao", "");
    formData.append("parentes", "");
    formData.append("amigos_nomes", "");
    formData.append("foto_perfil", "");
       
       const request=  new NextRequest("http://localhost:3000/api/crianca", {
        method:"POST",
        body:formData,
       })
       const resposta= await POST(request)
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(200)
       expect(corpo.mensagem).toBe("Cadastro realizado com sucesso!")
         
    })
       */
       it("deve buscar as crianças cadastradas pelo usuário", async ()=>{
        
         
       
       const request=  new NextRequest(`http://localhost:3000/api/crianca?pagina=1`, {
        method:"GET",
       
       })
       const resposta= await GET(request)
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(200)
       
       expect(corpo.paginacao).toEqual({
        paginaAtual: 1,
        total_registros: expect.any(Number),
        numero_paginas: expect.any(Number)
       })
        expect(corpo).toHaveProperty("crianca")
         
    })
     /* it("deve verificar sucesso para a atualização de criança caso a ID seja correta", async ()=>{
        
          const formData= new FormData()
        formData.append("nome", "Carlos Luis");
    formData.append("idade", "13");
    formData.append("nivel_autismo", "NIVEL_2");
    formData.append("hiperfoco", "CARROS");
    formData.append("pais", "Mãe:Ana");
    formData.append("nivel_alfabetizacao", "SILABICA");
    formData.append("animais_estimacao", "");
    formData.append("parentes", "");
    formData.append("amigos_nomes", "");
    formData.append("foto_perfil", "");

       const id:string="9d4fa579-bf37-47d2-b613-c195178c8c74"
       const request=  new NextRequest(`http://localhost:3000/api/crianca/${id}`, {
        method:"PATCH",
        body:formData,
        
        
       })
       const resposta= await PATCH(request,{params:Promise.resolve({id:id})})
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(200)
      expect(corpo.mensagem).toBe("Edição realizada com sucesso com sucesso!")
         
    })
      */
     it("deve verificar erro para a atualização de criança caso a ID seja incorreta", async ()=>{
        
          const formData= new FormData()
        formData.append("nome", "Carlos Luis");
    formData.append("idade", "13");
    formData.append("nivel_autismo", "NIVEL_2");
    formData.append("hiperfoco", "CARROS");
    formData.append("pais", "Mãe:Ana");
    formData.append("nivel_alfabetizacao", "SILABICA");
    formData.append("animais_estimacao", "");
    formData.append("parentes", "");
    formData.append("amigos_nomes", "");
    formData.append("foto_perfil", "");

       const id:string="9d4fa579-bf37-47d2-b613-c195178c8c70"
       const request=  new NextRequest(`http://localhost:3000/api/crianca/${id}`, {
        method:"PATCH",
        body:formData,
        
       })
       const resposta= await PATCH(request,{params:Promise.resolve({id:id})})
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(404)
      expect(corpo.mensagem).toBe("Criança não encaontrada")
         
    })
   /*  it("deve verificar erro para a exclução de criança caso a ID seja incorreta", async ()=>{
        
        

       const id:string="9d4fa579-bf37-47d2-b613-c195178c8c70"
       const request=  new NextRequest(`http://localhost:3000/api/crianca/${id}`, {
        method:"DELETE",
        
       })
       const resposta= await DELETE(request,{params:Promise.resolve({id:id})})
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(404)
      expect(corpo.mensagem).toBe("Criança  não encontrada")
         
    })
      */
      it("deve verificar sucesso para a exclução de criança caso a ID seja correta", async ()=>{
        
        

       const id:string="e941641a-0ac9-48e5-b035-58eecdc5c9cb"
       const request=  new NextRequest(`http://localhost:3000/api/crianca/${id}`, {
        method:"DELETE",
        
       })
       const resposta= await DELETE(request,{params:Promise.resolve({id:id})})
       const corpo =await resposta?.json()
       expect(resposta?.status).toBe(200)
      expect(corpo.mensagem).toBe("Exclução feita com sucesso")
         
    })
       
       

})