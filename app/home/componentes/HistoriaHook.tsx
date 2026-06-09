'use client';
import { alfabetizacao, autismo } from '@/generated/prisma/enums';
import { createContext, useContext, useState, ReactNode } from 'react';

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

interface HistoriaContextType {
  dados: HistoriaDados | null;
  setDados: (dados: HistoriaDados) => void;
}

const HistoriaContext = createContext<HistoriaContextType | undefined>(undefined);

export function HistoriaProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<HistoriaDados | null>(null);
  return (
    <HistoriaContext.Provider value={{ dados, setDados }}>
      {children}
    </HistoriaContext.Provider>
  );
}

export const useHistoria = () => {
  const context = useContext(HistoriaContext);
  if (!context) throw new Error("useHistoria deve ser usado dentro de um HistoriaProvider");
  return context;
};
