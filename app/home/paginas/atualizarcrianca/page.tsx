'use client'
import { useForm } from "react-hook-form";
import z, { string } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { SetStateAction, Suspense, useEffect, useState } from "react";
import { CriancaCadastro } from "@/app/modelos";
import { 
  FaUser, FaCalendarAlt, FaStar, FaPaw, FaAward, 
  FaBookOpen, FaUsers, FaHeart, FaCamera 
} from "react-icons/fa";
import { strict } from "assert";
import { toast } from "sonner"
import { useSearchParams } from "next/navigation";
import { alfabetizacao, autismo } from "@/generated/prisma/enums";
import {useRouter} from "next/navigation"
import Carregando from "@/app/Carregando";
interface crianca{
      id: string;
    nome: string;
    foto_perfil: string | null;
    idade: string;
    nivel_autismo: autismo;
    hiperfoco: string;
    animais_estimacao: string | null;
    amigos_nomes: string | null;
    pais: string;
    parentes: string;
    nivel_alfabetizacao: alfabetizacao;
    usuario_id: string;
}

interface dados{
    crianca:crianca,
    status:number,
}
type CriancaCadastroEsquema = z.infer<typeof CriancaCadastro>

function FormularioAtualizarCriancaConteudo() {
    
    const [carregando, setCarregando] = useState(false);
     const searchParams = useSearchParams();
     const id = searchParams.get('id')
     const rota=useRouter()
     const [crianca,setcriança]=useState<crianca>()

     useEffect(()=>{
        
       const  buscar=async ()=>{
            try {
             const resposta=await fetch(`http://localhost:3000/api/crianca/${id}`,{
        method:"GET",
         
      })
        if(resposta.status==200){
            const dados:dados= await resposta.json()
          
           setcriança(dados.crianca)
        }
         } catch (error) {
           toast.error("Erro insperado")
         }
        }
         buscar()
     },[id])

   

    const { register, handleSubmit,reset, formState: { errors } } = useForm<CriancaCadastroEsquema>({
        resolver: zodResolver(CriancaCadastro),
        
    });
      useEffect(() => {
    if (crianca) {
       
        reset({
            nome: crianca.nome,
            idade: crianca.idade,
            nivel_autismo: crianca.nivel_autismo,
            hiperfoco: crianca.hiperfoco,
            pais: crianca.pais,
            nivel_alfabetizacao: crianca.nivel_alfabetizacao,
            animais_estimacao: crianca.animais_estimacao ?? "",
            amigos_nomes: crianca.amigos_nomes ?? "",
            parentes: crianca.parentes ?? ""
        });
    }
}, [crianca, reset]);

    const onSubmit = async (data: CriancaCadastroEsquema) => {
        try {  
        setCarregando(true);
        const formData= await new FormData()
    formData.append("nome", data.nome);
    formData.append("idade", data.idade);
    formData.append("nivel_autismo", data.nivel_autismo);
    formData.append("hiperfoco", data.hiperfoco);
    formData.append("pais", data.pais);
    formData.append("nivel_alfabetizacao", data.nivel_alfabetizacao);
    data.animais_estimacao? formData.append("animais_estimacao", data.animais_estimacao):null;
    data.amigos_nomes ?formData.append("amigos_nomes", data.amigos_nomes):null;
    data.parentes ?formData.append("parentes", data.parentes):null;

    if (data.foto_perfil && data.foto_perfil.length > 0) {
        formData.append("foto_perfil", data.foto_perfil[0]); 
    }
        setCarregando(true)
      const resposta=await fetch(`/api/crianca/${id}`,{
        method:"PATCH",
        body:formData
      })
      if(resposta.status===200){
         
          rota.back()
          toast.success("Criança Atualizada com sucesso")
      }
      if(resposta.status===400){
         
          toast.error("Erro no formulário")
      }

      } catch (error) {
        console.log(error)
        toast.error("Erro no servidor")
           
        }finally{
            setCarregando(false);
        }
    };
    

    return (
       
          <div className="flex justify-center items-center w-full h-full bg-slate-100 p-2 overflow-hidden">
             <Suspense fallback={<Carregando/>}>
               <form 
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-5xl bg-white rounded-xl p-5 shadow-lg border border-slate-100 flex flex-col justify-between max-h-[95vh] overflow-y-auto md:overflow-hidden"
            >
             
                <div className="text-center mb-3">
                    <h2 className="text-gray-800 text-xl font-bold tracking-tight">Editar Perfil da Criança</h2>
                   
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
                    
                  
                    <div className="flex flex-col gap-2 md:border-r md:border-slate-100 md:pr-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">1. Identificação</span>
                        
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Nome completo</label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("nome")} type="text" placeholder="Nome da criança" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                            {errors.nome && <span className="text-red-500 text-[10px] font-medium">{errors.nome.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Idade</label>
                            <div className="relative flex items-center">
                                <FaCalendarAlt className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("idade")} type="text" placeholder="Ex: 6 anos" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                            {errors.idade && <span className="text-red-500 text-[10px] font-medium">{errors.idade.message}</span>}
                        </div>

                       
                            <label className="font-medium text-slate-600"> Foto de Perfil (Opcional)</label>
                            <div className="relative flex items-center">
                                <FaCamera className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("foto_perfil")} type="file" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                       
                    </div>

                   
                    <div className="flex flex-col gap-2 md:border-r md:border-slate-100 md:px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">2. Perfil Cognitivo</span>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Nível de Autismo</label>
                            <div className="relative flex items-center">
                                <FaAward className="absolute left-3 text-slate-400 text-sm z-10" />
                                <select {...register("nivel_autismo")} defaultValue="" className="w-full bg-slate-50 text-gray-800 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs appearance-none cursor-pointer transition-all">
                                    <option value="" disabled>Selecione</option>
                                    <option value="NIVEL_1">Nível 1 (Leve)</option>
                                    <option value="NIVEL_2">Nível 2 (Moderado)</option>
                                    <option value="NIVEL_3">Nível 3 (Severo)</option>
                                </select>
                            </div>
                            {errors.nivel_autismo && <span className="text-red-500 text-[10px] font-medium">{errors.nivel_autismo.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Alfabetização</label>
                            <div className="relative flex items-center">
                                <FaBookOpen className="absolute left-3 text-slate-400 text-sm z-10" />
                                <select {...register("nivel_alfabetizacao")} defaultValue="" className="w-full bg-slate-50 text-gray-800 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs appearance-none cursor-pointer transition-all">
                                    <option value="" disabled>Selecione</option>
                                    <option value="PRE_SILABICA">Pré-Silábica</option>
                                    <option value="SILABICA">Silábica</option>
                                    <option value="SILABICO_ALFABETICA">Silábico-Alfabética</option>
                                    <option value="ALFABETICA">Alfabética</option>
                                    <option value="ORTOGRAFICA">Ortográfica</option>
                                </select>
                            </div>
                            {errors.nivel_alfabetizacao && <span className="text-red-500 text-[10px] font-medium">{errors.nivel_alfabetizacao.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Hiperfoco principal</label>
                            <div className="relative flex items-center">
                                <FaStar className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("hiperfoco")} type="text" placeholder="Ex: Dinossauros" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                            {errors.hiperfoco && <span className="text-red-500 text-[10px] font-medium">{errors.hiperfoco.message}</span>}
                        </div>
                    </div>

                   
                    <div className="flex flex-col gap-2 md:pl-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">3. Convivência</span>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Pais / Responsáveis</label>
                            <div className="relative flex items-center">
                                <FaHeart className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("pais")} type="text" placeholder="Ex: Maria e João" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                            {errors.pais && <span className="text-red-500 text-[10px] font-medium">{errors.pais.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Outros Parentes</label>
                            <div className="relative flex items-center">
                                <FaHeart className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("parentes")} type="text" placeholder="Ex: Avó Ana" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                            {errors.parentes && <span className="text-red-500 text-[10px] font-medium">{errors.parentes.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-slate-600">Animais de Estimação (Op.)</label>
                            <div className="relative flex items-center">
                                <FaPaw className="absolute left-3 text-slate-400 text-sm" />
                                <input {...register("animais_estimacao")} type="text" placeholder="Ex: Gato" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                            </div>
                        </div>
                    </div>

                </div>

              
                <div className="flex flex-col gap-1 text-xs mt-2.5">
                    <label className="font-medium text-slate-600">Nomes dos Amigos Próximos (Opcional)</label>
                    <div className="relative flex items-center">
                        <FaUsers className="absolute left-3 text-slate-400 text-sm" />
                        <input {...register("amigos_nomes")} type="text" placeholder="Ex: Pedro, Lucas e Clara" className="w-full bg-slate-50 text-gray-800 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-xs transition-all" />
                    </div>
                </div>

               
                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={carregando}
                        className=" cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
                    >
                        {carregando ? "Editando..." : "Atualizar"}
                    </button>
                </div>
            </form>
            </Suspense>
            
           
        </div>
        
    );
}
export default function FormularioAtualizarCrianca() {
  return (
    <div className="flex justify-center items-center w-full h-full bg-slate-100 p-2 overflow-hidden">
      <Suspense fallback={<Carregando />}>
        <FormularioAtualizarCriancaConteudo />
      </Suspense>
    </div>
  );
}