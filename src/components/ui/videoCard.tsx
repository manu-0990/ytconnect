import { Clock3 } from 'lucide-react'
import React from 'react'

interface CardDataType {
  title: string;
  imgLink?: string;
  link: string;
  lastUpdated?: string;
}

export default function VideoCard(cardData: CardDataType) {

  return (
    <a href={`/project/${cardData.link}`} className='bg-zinc-950 rounded-lg h-1/3 w-1/5 p-2 flex flex-col gap-2 cursor-pointer'>

      <div className='border rounded-lg h-[70%] w-full'>

      </div>

      <p className='leading-5 tracking-tight'>{`${cardData.title}`}</p>

      <span className='flex items-center gap-1 text-xs opacity-60'>
        <Clock3 size={12}/>{`${cardData.lastUpdated}`}
      </span>
    </a>
  )
}