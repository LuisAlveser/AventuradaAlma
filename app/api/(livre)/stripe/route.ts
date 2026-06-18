import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; 
import { prisma } from "@/lib/prisma";
import { serialize } from 'cookie'
import jwt  from "jsonwebtoken"


export async function POST(request: NextRequest) {
    
    try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature") as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  
    let event;

     
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
    
      console.log(" Evento recebido do Stripe:", event.type);
   
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

       
        const usuarioId = session.client_reference_id;
        const customerId = session.customer;
        const totalPago = session.amount_total;

        const plano:string=totalPago===2990?"BASICO":"PRO"
        console.log("Informação Usuario",usuarioId,customerId,totalPago,plano)
        const usuario= await prisma.usuario.findFirst({where:{stripe_customer_id:customerId}})
        if(!usuario){
             return NextResponse.json({ mensagem:"Usuario não encontrado" }, { status: 404 });
        }
        let  usuario_atualizado
        if(plano==="BASICO"){

         usuario_atualizado = await prisma.usuario.update({ 
            where: { id: usuario.id },
             data: { plano:"BASICO",historias_geradas_no_mes:20,historias_salvas:10,} })
        }else{

            usuario_atualizado = await prisma.usuario.update({ 
            where: { id: usuario.id},
             data: { plano:"PRO",historias_geradas_no_mes:100,historias_salvas:100} })
        }
        if(!usuario){
            return NextResponse.json({ recebido: true }, { status: 404 });
        }
       
       
        return NextResponse.json({ recebido: true }, { status: 200});
        
    }
      return NextResponse.json({ recebido: true, status: "Ignorado voluntariamente" }, { status: 200 })
   } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
}
