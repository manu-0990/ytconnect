"use client";

import YTCard from "@/components/ui/ytCard";
import AnalyticsCard from "@/components/ui/analyticsCard";
import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const view = [12, 19, 3, 10, 2, 16, 5, 12, 3, 15];
const subscribers = [2, 3, 20, 5, 1, 4, 6];
const labels = ["January", "February", "March", "April", "May", "June", "July"];
const highlightDate = new Date("2021-03-19");

const options = {
  responsive: true,
  animation: {
    easing: "easeInOutBack",
  },
  plugins: {
    legend: {
      // legend is the text that appears and top side of the graph
      display: false,
    },
    tooltip: {
      // A Chart Tooltip is a small pop-up box that appears when you hover your mouse over a point, line, or bar in a chart or graph. It shows extra details about that specific data point.
      boxWidth: 60,
      boxHeight: 50,
    },
  },
  elements: {
    // elements are the points and lines in the graph
    point: {
      // point is the circle that appears on the graph
      hoverRadius: 5,
      hitRadius: 1,
      borderWidth: 1,
    },
    line: {
      // line is the line that appears on the graph
      borderWidth: 4,
      tension: 0.4,
      pointBorderWidth: 10,
      pointHoverRadius: 10,
      pointHoverBorderWidth: 1,
    },
  },
  scales: {
    // scales are the x and y axis and use for modifying the axis of the graph
    x: {
      // type: 'time',
      // x axis for x axis of the graph and tell that what you want to show on x axis
      grid: {
        // grid is the background of the graph
        display: false,
      },
      ticks: {
        stepSize: 50,
      },
    },
    y: {
      // type: 'timeseries',
      // y axis for y axis of the graph and tell that what you want to show on y axis
      grid: {
        // grid is the background of the graph
        color: "#3D3C41",
        zeroLineColor: "transparent",
        lineWidth: 2.5,

        // borderWidth: 3,
        // drawOnChartArea: false,
        // tickLength: 0,
        border: {
          display: true,
        },
        // offset: false,
        // borderDash: [5, 5],
      },
      // type: 'timeseries',
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
      // weight: 1,
    },
  },
  maintainAspectRatio: false, // maintainAspectRatio is used to maintain the aspect ratio of the graph
};

const data = {
  labels,
  datasets: [
    {
      data: view,
      borderColor: "#F76E6E",
      fill: true,
      // backgroundColor: "red",
      pointBackgroundColor: "#F76E6E",
    },
    {
      data: subscribers,
      borderColor: "gray",
    },
  ],
};
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
    positive: false,
  },
  watchTime: {
    value: 150,
    change: 12.5,
    positive: true,
  },
  subscribers: {
    value: "15k",
    change: 13,
    positive: true,
  },
  earnings: {
    value: "$150",
    change: 12.5,
    positive: false,
  },
  viewsLast28Days: 236,
  graphData: [
    { date: "8 March 2021", red: 120, gray: 150 },
    { date: "9 March 2021", red: 100, gray: 170 },
    { date: "10 March 2021", red: 110, gray: 160 },
    { date: "11 March 2021", red: 130, gray: 140 },
    { date: "12 March 2021", red: 140, gray: 130 },
    { date: "13 March 2021", red: 150, gray: 140 },
    { date: "14 March 2021", red: 160, gray: 150 },
    { date: "15 March 2021", red: 170, gray: 160 },
    { date: "16 March 2021", red: 189, gray: 170 },
    { date: "17 March 2021", red: 200, gray: 180 },
    { date: "18 March 2021", red: 210, gray: 190 },
    { date: "19 March 2021", red: 200, gray: 200 },
    { date: "20 March 2021", red: 220, gray: 190 },
    { date: "21 March 2021", red: 230, gray: 180 },
    { date: "22 March 2021", red: 210, gray: 160 },
    { date: "23 March 2021", red: 190, gray: 170 },
  ],
};

export default function CreatorPage() {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(168, 41, 41, 0.3)"); // starting color with transparency
      gradient.addColorStop(0.358, "rgba(0, 0, 0, 0)"); // fading out to transparent
      setGradient(gradient);
    }
  }, []);

  const data = {
    labels,
    datasets: [
      {
        data: view,
        borderColor: "#F76E6E",
        fill: true,
        backgroundColor: gradient,
        pointBackgroundColor: "#F76E6E",
      },
      {
        data: subscribers,
        borderColor: "gray",
      },
    ],
  };

  return (
    <div className="min-h-[100vh] p-10  grid-rows-2 gap-10 h-full">
      {/* Graph section */}
      <div className=" bg-[#212121] rounded-2xl p-4 flex flex-col ">
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
          Your channel got {analyticsData.viewsLast28Days} views in the last 28
          days
        </div>

        {/* Graph */}
          {/* SVG Graph */}
          <div className="w-full antialiased h-full">
            <Line ref={chartRef} data={data} options={options} />
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
