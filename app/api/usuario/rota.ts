import { prisma } from "@/lib/prima";

 export async function GET(){
    try {
     const response = prisma.usuario.findMany()
      return Response.json({res:response})
    } catch (error) {
        console.log()
    }
 } 