import { describe,it ,expect,vi,beforeEach} from 'vitest';
import {POST} from "@/app/api/(livre)/usuario/cadastro/route"
import { NextRequest } from 'next/server';
import jwt from "jsonwebtoken"


interface UsuarioToken{
    id:string,
    nome:string,
    email:string,
    plano:string,
    foto:string|null,
    historias_geradas_no_mes:number,
    iat?: number; 
    exp?: number;

}
describe("Rota de Cadastro de Usuário", ()=>{
  /* it("deve verificar com sucesso o cadastro  ",async ()=>{
      const formData= new FormData()

    formData.append("nome","Luis")
    formData.append("email","luis@gmail.com")
    formData.append("senha","12345678")

    const request= new NextRequest("http://localhost:3000/api/usuario/cadastro",{
     method:"POST",
     body:formData
    })
    const resposta= await POST(request)
    const corpo=  await resposta?.json()

    expect(resposta?.status).toBe(201)
   
   
    expect(corpo.mensagem).toBe("Cadastro Realizado com sucesso")
    
    const cookieHeader = resposta!.headers.get("Set-Cookie");
    expect(cookieHeader).toContain("auth_token=");
    expect(cookieHeader).toContain("HttpOnly");

    const tokenPartes= cookieHeader!.split("auth_token=")
    const token=tokenPartes[1].split(";")[0]
    const usuario:UsuarioToken= jwt.decode(token!)as UsuarioToken
 
    expect(usuario.nome).toBe("Luis")
     expect(usuario.email).toBe("luis@gmail.com")
    expect(usuario.plano).toBe("FREE")
    expect(usuario.historias_geradas_no_mes).toBe(3)
   })
  */
  it("deve verificar erro caso o email já esteja cadastrado no banco de dados  ",async ()=>{
      const formData= new FormData()

    formData.append("nome","Luis")
    formData.append("email","luis@gmail.com")
    formData.append("senha","12345678")

    const request= new NextRequest("http://localhost:3000/api/usuario/cadastro",{
     method:"POST",
     body:formData
    })
    const resposta= await POST(request)
    const corpo=  await resposta?.json()

    expect(resposta?.status).toBe(404)
   
   
    expect(corpo.mensagem).toBe("Esse usuário já existe")
    
    
   })
   
})