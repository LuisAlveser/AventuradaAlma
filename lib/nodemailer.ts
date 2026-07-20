
import nodemailer from "nodemailer";
import rabbitmq from "amqplib"


const trasport =nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.SENHA
    }
})

const usuario=process.env.EMAIL

export async function enviar_email(email:string){
  
   trasport.sendMail({
    from:`Aventura da Alma<${usuario}>`,
    subject:"Aventura da Alma ",
     to:email,
     html:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha - Aventura da Senha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 0;">
        <tr>
            <td align="center">
               
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    
                 
                    <tr>
                        <td align="center" style="background-color: #4f46e5; padding: 30px 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">
                                🗺️ Aventura da Alma
                            </h1>
                        </td>
                    </tr>

                   
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                                Recuperação de Conta
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Olá! Recebemos um pedido para redefinir a senha da sua conta no <strong>Aventura da Alma</strong>. Se você não fez essa solicitação, pode ignorar este e-mail com segurança. Caso contrário, clique no botão abaixo para escolher uma nova senha.
                            </p>

                            
                            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" style="background-color: #10b981; border-radius: 6px;">
                                        <!-- Substitua o '#' abaixo pela URL real da sua aplicação (ex: process.env.URL_REDEFNIR) -->
                                        <a href='http://localhost:3000/?email=${email}' target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                                            Alterar Minha Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0 0; color: #9ca3af; font-size: 14px;">
                                O link acima expira em 2 horas por motivos de segurança.
                            </p>
                        </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                Este é um e-mail automático, por favor não responda.<br>
                                &copy; 2026 Aventura da Senha. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
`
})
}
