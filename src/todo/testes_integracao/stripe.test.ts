import {beforeEach, describe,expect,it,vi} from "vitest"
import {POST} from "@/app/api/(livre)/usuario/info/route"
import { NextRequest } from "next/server"
import { criartoken } from "../utils/criacao_token";

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
describe("Teste para compra de pacote",()=>{
    mockToken=""
    it("Compra de projeto pelo usuário com autenticação",async ()=>{
        const plano:string="PRO"
        const request = new NextRequest("http://localhost:3000/usuario/info",{
            method:"POST",
            body:JSON.stringify(plano),
            headers:{
                'Content-Type': 'application/json',
               'Accept': 'application/json'
            }
        })
        const resposta= await POST(request)
        const corpo= await resposta?.json()
        expect(resposta?.status).toBe(401)
        expect(corpo.mensagem).toBe("Não autorizado")
    })

      beforeEach(async () => {
   
    mockToken = await criartoken();
  });
       it("Compra de projeto pelo usuário sem autenticação",async ()=>{
        
        mockToken = await criartoken();

        const plano={plano:"PRO"}
        const request = new NextRequest("http://localhost:3000/usuario/info",{
            method:"POST",
            body:JSON.stringify(plano),
            headers:{
                'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Cookie': `auth_token=${mockToken}`
            }
        })
        const resposta= await POST(request)
        const corpo= await resposta?.json()
        expect(resposta?.status).toBe(200)
        expect(corpo).toHaveProperty("sessao")
    })
})