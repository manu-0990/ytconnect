import { Clock3 } from 'lucide-react'
import React from 'react'

interface CardDataType {
  title: string;
  imgLink?: string;
  link: string;
  lastUpdated?: string;
}

//  If image link not given then this fallback image will be shown
const fallBackImage = process.env.NEXT_PUBLIC_FALLBACK_THUMBNAIL

export default function VideoCard(cardData: CardDataType) {

  return (
    <a href={`/project/${cardData.link}`} className='h-[40vh] rounded-lg p-2 flex flex-col gap-1 cursor-pointer'>

      <div className='border rounded-lg h-[70%] w-full'>
        <img src={`${cardData.imgLink || fallBackImage}`} alt="" className='h-full w-full object-cover object-center rounded-lg' />
      </div>

      <p className='leading-8 tracking-tight text-2xl'>{`${cardData.title}`}</p>

      <span className='flex items-center gap-1 text-xs opacity-60 '>
        <Clock3 size={12}/>{`${cardData.lastUpdated}`}
      </span>
    </a>
  )
}