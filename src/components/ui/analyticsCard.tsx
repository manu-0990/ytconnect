type AnalyticsCardType =  {
    title: string;
    value: string | number;
    change: number;
    positive: boolean;
}

const AnalyticsCard = ({ title, value, change, positive }: AnalyticsCardType) => {
  return (
    <div className="px-6 py-4 rounded-lg flex flex-col bg-[#1b1b1b]">
      <span className="text-sm text-gray-400">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <span
          className={`text-xs ${
            positive ? "text-green-500" : "text-red-500"
          } flex items-center`}
        >
          {positive ? "↑" : "↓"} {change}%
        </span>
      </div>
    </div>
  );
};

export default AnalyticsCard;
