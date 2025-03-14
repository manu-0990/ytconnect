type AnalyticsCardType =  {
    title: string;
    value: string | number;
    change: number;
    positive: boolean;
}

const AnalyticsCard = ({ title, value, change, positive }: AnalyticsCardType) => {
  return (
    <div className="border border-slate-800 px-5 py-3 rounded-lg flex flex-col">
      <span className="text-sm text-gray-400">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-medium">{value}</span>
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
