
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
interface Imagem{
    id: string;
    conteudo: string;
    historia_id: string;
}

export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){
      try {
           
    const {id}= await params
   
    const historia=await prisma.historia.findFirst({where:{id:id}})
    if(!historia){
        return NextResponse.json({mensagem:"Id não encontrado"},{status:404})
    }
      const imagens:Imagem[]=await prisma.imagem.findMany({where:{historia_id:id}})
      if(!imagens){
        await prisma.historia.delete({where:{id:id}})
        return NextResponse.json({mensagem:"História excluída com sucesso"},{status:200})
      }
       for( const imagem of imagens){
              const { data, error:storageError} = await supabase
                          .storage
                          .from('fotos_perfil')
                          .remove([`${imagem.conteudo}`])
                            if (storageError) {
                          console.log("Erro no storage:",storageError)
                          return NextResponse.json({ error: `Erro na exclução  da imagem: ${storageError.message}` }, { status: 400 })
                        }
                         
                    }
                    await prisma.historia.delete({where:{id:id}})
        return NextResponse.json({mensagem:"História excluída com sucesso"},{status:200})
       

      
 } catch (error) {
    console.log("error",error)
         if(error instanceof Error){
            return NextResponse.json({mensagem:"Erro no servidor",error},{status:500})
         }
      } 
}
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){
      try {
           
    const {id}= await params
   
    const historia=await prisma.historia.findFirst({where:{id:id},include:{imagem:true}})
    
    if(!historia){
      
        return NextResponse.json({mensagem:"Id não encontrado"},{status:404})
    }            
       
        return NextResponse.json({historia:historia},{status:200})
       

      
 } catch (error) {
  
         if(error instanceof Error){
            return NextResponse.json({mensagem:"Erro no servidor",error},{status:500})
         }
      } 
}