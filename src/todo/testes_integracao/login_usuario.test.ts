import { describe,it ,expect,vi,beforeEach} from 'vitest';
import {POST} from "@/app/api/(livre)/usuario/login/route"
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

describe("Login de Usuário",()=>{
    it("deve verificar sucesso para caso o  email e senha estiverem corretos",async ()=>{
     const usuario={
        email:"luis@gmail.com",
         senha:"12345678"
     }
     const request=  new NextRequest("http://localhost:3000/api/usuario/login",{
         method:"POST",
         body:JSON.stringify(usuario)
     })
      const resposta= await POST(request)
      const corpo= await resposta.json()

      expect(resposta.status).toBe(201)
      expect(corpo.mensagem).toBe("Login Realizado com sucesso")
      
      const cookieshearder= resposta.headers.get("Set-Cookie")
      expect(cookieshearder).toContain("auth_token=")
       expect(cookieshearder).toContain("HttpOnly") 

       const tokenPartes=cookieshearder!.split("auth_token=")
       const token =tokenPartes[1].split(";")[0]
       const usuario_token:UsuarioToken=  jwt.decode(token) as UsuarioToken
        
       expect(usuario_token.nome).toBe("Luis")
       expect(usuario_token.email).toBe("luis@gmail.com")
     })
      it("deve verificar erro para caso a senha estiver incorreto",async ()=>{
     const usuario={
        email:"luis@gmail.com",
         senha:"123456789"
     }
     const request=  new NextRequest("http://localhost:3000/api/usuario/login",{
         method:"POST",
         body:JSON.stringify(usuario)
     })
      const resposta= await POST(request)
      const corpo= await resposta.json()

      expect(resposta.status).toBe(404)
      expect(corpo.mensagem).toBe("Email ao senha incorretos")
      
      

     
     })
     it("deve verificar erro para caso o email estiver incorreto",async ()=>{
     const usuario={
        email:"luis@gmail2.com",
         senha:"12345678"
     }
     const request=  new NextRequest("http://localhost:3000/api/usuario/login",{
         method:"POST",
         body:JSON.stringify(usuario)
     })
      const resposta= await POST(request)
      const corpo= await resposta.json()

      expect(resposta.status).toBe(404)
      expect(corpo.mensagem).toBe("Email ao senha incorretos")
      
     

     
     })
})