'use client';

import { useRouter } from 'next/navigation';

export default function GlobalNotFound() {
  const rota = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col p-8 w-100 h-50 bg-blue-300 rounded-2xl border-2 justify-center items-center gap-2">
        <h1 className="text-4xl md:text-4xl text-black font-bold leading-tight">
          Página não encontrada
        </h1>

        <button
          onClick={() => {
            rota.back();
          }}
          type="button"
          className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs tracking-wide shadow-md"
        >
          Clique aqui para voltar
        </button>
      </div>
    </div>
  );
}