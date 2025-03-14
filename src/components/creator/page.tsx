"use client";

import YTCard from "@/components/ui/ytCard";
import AnalyticsCard from "@/components/ui/analyticsCard";

const pendingDatas = [
  {
    id: 1,
    imgURL:
      "https://images.pexels.com/photos/4523001/pexels-photo-4523001.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "",
    title: "I love you man",
  },
  {
    id: 2,
    imgURL:
      "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "",
    title: "hello bro how are you",
  },
  {
    id: 3,
    imgURL:
      "https://images.pexels.com/photos/8801117/pexels-photo-8801117.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "",
    title: "Today we will learn how to go to bed",
  },
];

// Dummy analytics data
const analyticsData = {
  views: {
    value: 150,
    change: 12.5,
    positive: false
  },
  watchTime: {
    value: 150,
    change: 12.5,
    positive: true
  },
  subscribers: {
    value: "15k",
    change: 13,
    positive: true
  },
  earnings: {
    value: "$150",
    change: 12.5,
    positive: false
  },
  viewsLast28Days: 236,
  graphData: [
    { date: '8 March 2021', red: 120, gray: 150 },
    { date: '9 March 2021', red: 100, gray: 170 },
    { date: '10 March 2021', red: 110, gray: 160 },
    { date: '11 March 2021', red: 130, gray: 140 },
    { date: '12 March 2021', red: 140, gray: 130 },
    { date: '13 March 2021', red: 150, gray: 140 },
    { date: '14 March 2021', red: 160, gray: 150 },
    { date: '15 March 2021', red: 170, gray: 160 },
    { date: '16 March 2021', red: 189, gray: 170 },
    { date: '17 March 2021', red: 200, gray: 180 },
    { date: '18 March 2021', red: 210, gray: 190 },
    { date: '19 March 2021', red: 200, gray: 200 },
    { date: '20 March 2021', red: 220, gray: 190 },
    { date: '21 March 2021', red: 230, gray: 180 },
    { date: '22 March 2021', red: 210, gray: 160 },
    { date: '23 March 2021', red: 190, gray: 170 },
  ]
};

export default function CreatorPage() {

  return (
    <div className="min-h-[100vh] p-10 grid grid-rows-2 gap-10 h-full">
      
      {/* Graph section */}
      <div className=" bg-[#212121] rounded-2xl p-4">
        
        {/* Analytics cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <AnalyticsCard 
            title="Views" 
            value={analyticsData.views.value} 
            change={analyticsData.views.change} 
            positive={analyticsData.views.positive} 
          />
          <AnalyticsCard 
            title="Watch time" 
            value={analyticsData.watchTime.value} 
            change={analyticsData.watchTime.change} 
            positive={analyticsData.watchTime.positive} 
          />
          <AnalyticsCard 
            title="Subscribers" 
            value={analyticsData.subscribers.value} 
            change={analyticsData.subscribers.change} 
            positive={analyticsData.subscribers.positive} 
          />
          <AnalyticsCard 
            title="Earnings" 
            value={analyticsData.earnings.value} 
            change={analyticsData.earnings.change} 
            positive={analyticsData.earnings.positive} 
          />
        </div>
        
        {/* Info text */}
        <div className="text-xs text-gray-500 mb-4">
          Your channel got {analyticsData.viewsLast28Days} views in the last 28 days
        </div>
        
        {/* Graph */}
        <div className=" h-56 flex flex-col gap-2 justify-between overflow-hidden">
          {/* SVG Graph */}
          <div className="border w-full antialiased" >
            
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>8 March 2021</span>
            <span>12 March 2021</span>
            <span>16 March 2021</span>
            <span>20 March 2021</span>
            <span>23 March 2021</span>
          </div>
        </div>
      </div>

      {/* Pending projects section */}
      <div className="py-4 flex flex-col gap-5">
        <h3 className="text-lg font-medium font-sans">Pending works</h3>
        <div className="grid grid-cols-3 gap-16">
          {pendingDatas.map((data) => (
            <YTCard
              key={`${data.id}`}
              imageUrl={`${data.imgURL}`}
              // title={`${data.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}