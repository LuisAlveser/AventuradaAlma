import * as z from "zod"; 
 const planos=["FREE","BASICO","PRO"] as const


export const UsuarioModelo = z.object({ 
  nome: z.string()
    .min(1, "O nome deve ter no mínimo 1 caracter"),
    

 
  email: z.string().email("Email incorreto"), 

  senha: z.string().min(5, "A senha deve ter mais dígitos"),

  historias_salvas: z.number().int().default(2).optional(), 
  
  plano: z.enum(planos).default("FREE").optional(),
  
  
  historias_geradas_no_mes: z.number().int().default(5).optional(), 
  
  data_proxima_renovacao: z.date().optional(),
  
  foto_perfil: z.string().optional(),
  
  
  mes_referencia: z.date().default(()=>new Date()).optional()
});

export const UsuarioLogin = z.object({ 
  email: z.string().email("Email incorreto"), 
  senha: z.string().min(5, "A senha deve ter mais dígitos"),
});

export  const CriancaCadastro =z.object({
  nome: z.string().min(1, "O nome deve ter no mínimo 1 caracter"),
  idade:z.string().max(3,"Idade inválida"),
  nivel_autismo :z.string(),
  hiperfoco:z.string().min(3, "O hiperfoco deve ter no mínimo 1 caracter"),
  animais_estimacao :z.string().default("null").optional(),
  amigos_nomes :z.string().default("null").optional(),
  pais :z.string(),
  parentes :z.string().default("null").optional(),
  foto_perfil :z.any().default("null").optional(),
  nivel_alfabetizacao :z.string(),
})

export const UsuarioAtualizacao=z.object({
  nome: z.string().min(1, "O nome deve ter no mínimo 1 caracter"),
  email: z.string().email("Email incorreto"), 
})