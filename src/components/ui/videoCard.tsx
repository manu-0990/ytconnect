import { Clock3 } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

interface CardDataType {
  title: string;
  imgLink?: string;
  projectId: number;
  lastUpdated?: string;
}

//  If image link not given then this fallback image will be shown
const fallBackImage = "/ytconnect-default.png"

export default function VideoCard(cardData: CardDataType) {

  function timeAgo(dateString?: string): string {
    if (!dateString) return 'unknown';

    const now = new Date();
    const updated = new Date(dateString);
    const diff = Math.floor((now.getTime() - updated.getTime()) / 1000); // seconds

    const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'week', seconds: 604800 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff / unit.seconds);
      if (value >= 1) return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`;
    }

    return 'just now';
  };

  return (
    <Link href={`/project/${cardData.projectId}`} className='h-[40vh] rounded-lg p-2 flex flex-col gap-1 cursor-pointer'>

      <div className='border rounded-lg h-[70%] w-full'>
        <img src={`${cardData.imgLink || fallBackImage}`} alt="" className='h-full w-full object-cover object-center rounded-lg' />
      </div>

      <p className='leading-8 tracking-tight text-2xl'>{`${cardData.title}`}</p>

      <span className='flex items-center gap-1 text-xs opacity-60 '>
        <Clock3 size={12} />{timeAgo(cardData.lastUpdated)}
      </span>
    </Link>
  )
}