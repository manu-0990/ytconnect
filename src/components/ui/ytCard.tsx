import React from 'react';
import Button from './button';

type YTCardType = {
  imageUrl: string;
}

const YTCard = ({ imageUrl }: YTCardType) => {
  return (
    <div className=" border-zinc-600 py-3 rounded-lg overflow-hidden flex flex-col gap-5  h-96">
      <img className="max-h-60 object-cover object-center rounded-lg" src={imageUrl} alt="" />
      <p className=" border-slate-600 overflow-hidden text-ellipsis line-clamp-2 font-sans font-normal tracking-tight">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium inventore ab ducimus magnam fuga vitae fugiat sunt est, eum laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate dolorem provident cumque laborum dignissimos labore inventore culpa vitae quasi cupiditate.</p>
    </div>
  );
};

export default YTCard;
