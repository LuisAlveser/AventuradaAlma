import { test, expect } from '@playwright/test';

/*test.describe("Home Page",()=>{
   test.describe("Login do Usuário",()=>{
         test("deve fazer o login do usuário corretamente", async ({page})=>{
            await page.goto("/")
            await page.getByRole("button",{name:"Login"}).click()
            await page.getByRole("textbox",{name:"Email"}).fill(`${process.env.EMAIL}`)
            await page.getByRole("textbox",{name:"Senha"}).fill(`${process.env.USUARIO_SENHA}`)
            await page.getByRole("button",{name:"Entrar"}).click()
              await page.goto("/home")

         })
            
         test("não deve fazer o login do usuário caso o login seja incorreto", async ({page})=>{
            await page.goto("/")
            await page.getByRole("button",{name:"Login"}).click()
            await page.getByRole("textbox",{name:"Email"}).fill(`${process.env.EMAIL}`)
            await page.getByRole("textbox",{name:"Senha"}).fill(`sggigiodfig`)
            await page.getByRole("button",{name:"Entrar"}).click()
            await page.getByText("Email ou Senha inválidos",{exact:true})
         })
            

   
        
    })
    })
*/


 /* test.describe("Cadastro da Crianças ",()=>{
   test.describe("deve cadastrar a criança com dados corretos ",()=>{
         test("deve fazer o login do usuário corretamente e o cadastro da criança", async ({page})=>{
            await page.goto("/")
            await page.getByRole("button",{name:"Login"}).click()
            
            await page.getByRole("textbox",{name:"Email"}).fill(`${process.env.EMAIL}`)
            await page.getByRole("textbox",{name:"Senha"}).fill(`${process.env.USUARIO_SENHA}`)
          
            await page.getByRole("button",{name:"Entrar"}).click()
          
            await page.getByRole('link', { name: 'Adicionar Criança' }).click();

           await page.getByPlaceholder("Nome da criança").fill("Lucas Silva");
      await page.getByPlaceholder("Ex: 6 anos").fill("6 anos"); 
      
      
      await page.locator('select[name="nivel_autismo"]').selectOption("NIVEL_1");
      await page.locator('select[name="nivel_alfabetizacao"]').selectOption("SILABICO_ALFABETICA");
      await page.getByPlaceholder("Ex: Dinossauros").fill("Espaço e Planetas"); 
      
      await page.getByPlaceholder("Ex: Maria e João").fill("Ana e Roberto"); 
      await page.getByPlaceholder("Ex: Avó Ana").fill("Vovô Carlos"); 
      await page.getByPlaceholder("Ex: Gato").fill("Cachorro Bob"); 
      await page.getByPlaceholder("Ex: Pedro, Lucas e Clara").fill("Gabriel e Mariana");

         })
         
            
         
            

   
        
    })
    })
    */
test("Exclusão de criança ",async ({page})=>{
      await page.goto("/")
            await page.getByRole("button",{name:"Login"}).click()
            
            await page.getByRole("textbox",{name:"Email"}).fill(`${process.env.EMAIL}`)
            await page.getByRole("textbox",{name:"Senha"}).fill(`${process.env.USUARIO_SENHA}`)
          
            await page.getByRole("button",{name:"Entrar"}).click()

            await page.getByRole('link', { name: 'Crianças Salvas' }).click(); 

            await page.getByRole("button",{name:"Excluir"}).click()
})

