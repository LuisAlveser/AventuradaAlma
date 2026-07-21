import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; 
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// URL local de teste: http://localhost:3000/api/stripe
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !endpointSecret) {
            return NextResponse.json({ error: "Assinatura ou Secret ausente" }, { status: 400 });
        }
  
        let event: Stripe.Event;

       
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    
        console.log("Evento recebido do Stripe:", event.type);
   
        if (event.type === "checkout.session.completed"|| event.type === "checkout.session.async_payment_succeeded") {
            const session = event.data.object as Stripe.Checkout.Session;
          if (session.payment_status !== "paid") {
                return NextResponse.json({ recebido: true, status: "Aguardando compensação do boleto" }, { status: 200 });
            }
           
            const usuarioId = session.client_reference_id;
            const customerId = session.customer as string;
            const totalPago = session.amount_total; 

            if (!usuarioId) {
                return NextResponse.json({ error: "client_reference_id ausente na sessão" }, { status: 400 });
            }

            
            const usuario = await prisma.usuario.findUnique({
                where: { id: usuarioId }
            });
           
            if (!usuario) {
                 return NextResponse.json({ mensagem: "Usuario não encontrado" }, { status: 404 });
            }

         //Baico valor 2990 teste valor 100
            const plano: "BASICO" | "PRO" = totalPago === 2990 ? "BASICO" : "PRO";
            
           
            const novosDados = plano === "BASICO" 
                ? { plano: "BASICO" as const, historias_geradas_no_mes: 20, historias_salvas: 10 }
                : { plano: "PRO" as const, historias_geradas_no_mes: 100, historias_salvas: 100 };

           
            await prisma.usuario.update({ 
                where: { id: usuario.id },
                data: {
                    ...novosDados,
                    stripe_customer_id: customerId 
                }
            });
           
            return NextResponse.json({ recebido: true }, { status: 200 });
        }

        return NextResponse.json({ recebido: true, status: "Ignorado voluntariamente" }, { status: 200 });

    } catch (err: any) {
        console.error(`Erro no Webhook: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
}