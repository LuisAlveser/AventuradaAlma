import { url } from "inspector"
import Stripe from "stripe"

export const  stripekey= process.env.CHAVE_STRIPE_SECRETA || "sk_test_placeholder_key_for_build"

export const stripe = new Stripe(stripekey, {
  httpClient: Stripe.createFetchHttpClient()
})
export const getStripeCustomer=async(email:string)=>{
 const customer= await stripe.customers.list({email})
 return customer.data[0]
}

export const createCustumer=async(data:{email:string,name?:string})=>{
    const customer= await getStripeCustomer(data.email)
    if(customer) return customer

    return stripe.customers.create({
        email:data.email,
        name:data.name
    })
}
export const createPlanoBasico=async(usuario_id:string,email:string,plano:string)=>{
     try {
        const customer= await createCustumer({email:email})
        const sessao= await stripe.checkout.sessions.create({
            payment_method_types:["card","boleto"],
            mode:"payment",
            client_reference_id:usuario_id,
            customer:customer.id,
           success_url: "https://aventuradaalma.vercel.app/home?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://aventuradaalma.vercel.app/home",
            tax_id_collection:{
                enabled:true
            },
            billing_address_collection:"required",
            line_items:[
                {
                   quantity:1,
                   price:plano==="BASICO"?process.env.PLANO_BASICO_CHAVE:process.env.PLANO_PRO_CHAVE 
                }
            ]
        })
        return ({url:sessao.url})
     } catch (error) {
        console.log(error)
     }

}