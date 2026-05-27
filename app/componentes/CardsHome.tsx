import Image from "next/image"
import { IconType } from "react-icons/lib"

interface Props {
  titulo_card: string
  texto_card: string
  icone: IconType
}

export function CardsHome({ titulo_card, texto_card, icone: Icone }: Props) {
  return (
    <div className="bg-white border border-blue-100 flex flex-col w-full max-w-sm rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-blue-100 rounded-2xl">
          <Icone size={24} className="text-blue-600" /> 
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {titulo_card}
        </h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {texto_card}
      </p>
    </div>
  )
}