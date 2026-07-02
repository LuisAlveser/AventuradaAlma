import { describe,it ,expect} from 'vitest';
import {  ZodError } from 'zod';

import {
  UsuarioModelo,
  UsuarioLogin,
  UsuarioAtualizacao,
  UsuarioAtualizacaoSenha,
  UsuarioEnvioEmail

} from "@/app/modelos"
describe("Testes para  Usuário",()=>{

       it("deve validar com sucesso um usuário com dados corretos",()=>{
    const usuario={
        nome:"Luis",
        email:"luis@gmail.com",
        senha:"1722633"

      
    }
    const objeto =UsuarioModelo.parse(usuario)
    expect(objeto.nome).toBe("Luis")
    expect(objeto.email).toBe("luis@gmail.com")
    expect(objeto.senha).toBe("1722633")
    expect(objeto.historias_geradas_no_mes).toBe(5)
    expect(objeto.historias_salvas).toBe(2)
    expect(objeto.plano).toBe("FREE")
     
    
})
it("deve validar  erro  um usuário com email com formato incorreto",()=>{
     const usuario={
        nome:"Luis",
        email:"luisgmail.com",
        senha:"1722633"

      
    }
    
    expect(()=>UsuarioModelo.parse(usuario)).toThrow(ZodError)
})
it("deve validar  erro um usuário com dados obrigatórios  faltando",()=>{
     const usuario={
        nome:"Luis",
       
        senha:"1722633"

      
    }
  expect(()=>UsuarioModelo.parse(usuario)).toThrow(ZodError)
})
describe("Login Usuario",()=>{
    it("deve verificar com sucesso os campos de login com dados corretos",()=>{
          const usuario={
        senha:"123456",
        email:"luis@gmail.com"
    }
    const objeto =UsuarioLogin.parse(usuario)
      expect(objeto.email).toBe("luis@gmail.com")
      expect(objeto.senha).toBe("123456")
    })
      it("deve verificar erro o campo de email com formato incorreto",()=>{
          const usuario={
        senha:"123456",
        email:"luis_gmail.com",
    }
     
      expect(()=>UsuarioLogin.parse(usuario).email).toThrow(ZodError)
    })
    it("deve verificar erro para campos vazios ",()=>{
          const usuario={
        senha:"123456",
        email:"",
    }
     
      expect(()=>UsuarioLogin.parse(usuario)).toThrow(ZodError)
    })
})
describe("Atualização de Usuário",()=>{
      it("dever verificar com sucesso os campos para a atualização de usuário",()=>{
         const usuario={
        nome:"Luis",
        email:"luis@gmail.com",
    }
    const objeto=UsuarioAtualizacao.parse(usuario)
       expect(objeto.nome).toBe("Luis")
       expect(objeto.email).toBe("luis@gmail.com")
      })

 it("deve verificar com erro a falta de dados para a atualização de usuário",()=>{
         const usuario={
        
        email:"luis@gmail.com",
    }
   
       expect(()=>UsuarioAtualizacao.parse(usuario)).toThrow(ZodError)
      
      })
      it("deve verificar com erro caso o formato do email seja incorreto ",()=>{
         const usuario={
        
        email:"luis@gmail.com",
    }
   
       expect(()=>UsuarioAtualizacao.parse(usuario)).toThrow(ZodError)
      
      })
      
})
  describe("Envio de email para Usuário",()=>{
    it("dever verificar com sucesso para os campos de envio de email",()=>{
      const usuario={
        email:"luis@gmail.com"
      }
      const objeto=UsuarioEnvioEmail.parse(usuario)
      expect(objeto.email).toBe("luis@gmail.com")
    })
    it("deve verificar com erro o email incorreto",()=>{
      const usuario={
        email:"luisgmail.com"
      }
     
      expect(()=> UsuarioEnvioEmail.parse(usuario)).toThrow(ZodError)
    })
  })

})


