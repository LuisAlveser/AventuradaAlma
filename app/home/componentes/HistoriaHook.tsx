'use client';
import { alfabetizacao, autismo } from '@/generated/prisma/enums';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

interface HistoriaDados {
  crianca: crianca;
  conteudo: string;
}
interface UsuarioToken {
    id: string;
    nome: string;
    email: string;
    plano: string;
    foto_perfil: string | null;
    historias_geradas_no_mes: number;
}

interface HistoriaContextType {
  dados: HistoriaDados | null;
  usuario: UsuarioToken | undefined;
  setDados: (dados: HistoriaDados) => void;
  buscarUsuario: () => Promise<void>;
}


const HistoriaContext = createContext<HistoriaContextType | undefined>(undefined);

export function HistoriaProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<HistoriaDados | null>(null);
  const [usuario,setUsuario]=useState<UsuarioToken>()

  const buscarUsuario = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/api/usuario/info", {
                method: "GET"
            });
            if (resposta.status === 200) {
                const token: UsuarioToken = await resposta.json();
                setUsuario(token);
            }
        } catch (error) {
            console.log("Erro ao buscar usuário no contexto:", error);
        }
    };
   
  return (
    <HistoriaContext.Provider value={{ dados, setDados,buscarUsuario ,usuario}}>
      {children}
    </HistoriaContext.Provider>
  );
}

export const useHistoria = () => {
  const context = useContext(HistoriaContext);
  if (!context) throw new Error("useHistoria deve ser usado dentro de um HistoriaProvider");
  return context;
};
