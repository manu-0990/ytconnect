type YTCardType = {
  imageUrl?: string;
  title?: string;
  onClick?: () => void;
}

const YTCard = ({ imageUrl, title, onClick }: YTCardType) => {
  return (
    <div onClick={onClick} className="hover:bg-[#212121] cursor-pointer p-3 rounded-lg overflow-hidden flex flex-col gap-5 h-88">
      <img className="max-h-60 object-cover object-center rounded-lg" src={imageUrl} alt="" />
      <p className="overflow-hidden text-ellipsis line-clamp-2 font-sans font-normal tracking-tight">{title}</p>
    </div>
  );
};

export default YTCard;
