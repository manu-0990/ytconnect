// "use client";

// import YTCard from "@/components/ui/ytCard";
// import AnalyticsCard from "@/components/ui/analyticsCard";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import { after } from "node:test";

// // Hoverlinebar plugins
// const hoverline = {
//   id: "hoverline",
//   afterDatasetDraw: (chart, args, options) => {
//     if (!chart.chartArea) return;
//     const {
//       ctx,
//       tooltip,
//       chartArea: { top, bottom, left, right },
//       scales: { x, y },
//     } = chart;

//     if (tooltip && tooltip.dataPoints && tooltip.dataPoints.length) {
//       const xCoor = x.getPixelForValue(tooltip.dataPoints[0].dataIndex);
//       const yCoor = y.getPixelForValue(tooltip.dataPoints[0].parsed.y);
//       ctx.save();
//       ctx.beginPath();
//       ctx.lineWidth = 1.2;
//       ctx.strokeStyle = "rgba(41, 168, 124, 1)";
//       ctx.setLineDash([2, 6]);
//       ctx.moveTo(xCoor, yCoor);
//       ctx.lineTo(xCoor, bottom);
//       ctx.stroke();
//       ctx.closePath();
//       ctx.setLineDash([]);
//     }
//   },
// };

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   hoverline
// );
// const view = [12, 19, 3, 10, 2, 16, 5, 12, 3, 15];
// const subscribers = [2, 3, 20, 5, 1, 4, 6];
// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// // Tooltip
// const getOrCreateElement = (chart) => {
//   const tooltipEl = document.getElementById("tooltip");
//   if (!tooltipEl) {
//     tooltipEl = document.createElement("div");
//     tooltipEl.style.background = 'rgba(27, 27, 27, 0.95)';
//     tooltipEl.style.borderRadius = '12px';
//     tooltipEl.style.color = 'white';
//     tooltipEl.style.opacity = 1;
//     tooltipEl.style.pointerEvents = 'none';
//     tooltipEl.style.position = 'absolute';
//     tooltipEl.style.transform = 'translate(-50%, -100%)';
//     tooltipEl.style.transition = 'all 0.1s ease';
//     tooltipEl.style.padding = '10px 16px';
//     tooltipEl.style.fontFamily = 'sans-serif';
//     tooltipEl.style.fontSize = '14px';
//     tooltipEl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
//     tooltipEl.style.textAlign = 'center';
//     tooltipEl.style.zIndex = 999;

//     chart.canvas.parentNode.appendChild(tooltipEl);
//   }

//   return tooltipEl;
// };
// const externalTooltipHandler = (context) => {
//   const { chart, tooltip } = context;
//   const tooltipEl = getOrCreateElement(chart);
//   // Hide if no tooltip
//   if (tooltip.opacity === 0) {
//     tooltipEl.style.opacity = 0;
//     return;
//   }

//   if (tooltip.body) {
//     console.log(tooltip);
//     const titleLines = tooltip.title || [];
//     const bodyLines = tooltip.body.map((b) => b.lines);
    
//     // titleLines.forEach(title => {
//     //   const titleHead = document.createElement("div");
//     //   titleHead.innerHTML = title;
//     //   tooltipEl.appendChild(titleHead);


//     // });
//     tooltipEl.innerHTML = `
//       <div style="opacity: 0.7; font-size: 12px;">${titleLines}</div>
//       <div style="font-size: 18px; font-weight: bold; margin-top: 2px;">${bodyLines[0]}</div>
//     `;
//   }
//   const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

//   tooltipEl.style.opacity = 1;
//   tooltipEl.style.width = "9.37rem";
//   // tooltipEl.style.height = "2rem";
//   tooltipEl.style.borderRadius = "15px";
//   tooltipEl.style.background = "rgba(27, 27, 27, 0.9)";
//   tooltipEl.style.color = "white";
//   tooltipEl.style.pointerEvents = "none";
//   tooltipEl.style.position = "absolute";
//   tooltipEl.style.transform = "translate(-50%, 0)";
//   tooltipEl.style.transition = "all .1s ease";
//   tooltipEl.style.padding = "10px 16px";
//   tooltipEl.style.fontSize= "14px";
//   tooltipEl.style.boxShadow = "0px 8px 8px rgba(50, 50, 71, 0.08), 0px 8px 16px rgba(50, 50, 71, 0.06)";
//   tooltipEl.style.left = positionX + tooltip.caretX + 'px';
//   tooltipEl.style.top = positionY + tooltip.caretY + 'px';
//   tooltipEl.style.font = tooltip.options.bodyFont.string;
// };
// // Chart.js Configuration
// const options = {
//   responsive: true, // Make chart responsive
//   maintainAspectRatio: false, // Don't force fixed aspect ratio

//   animation: {
//     easing: "easeInOutBack", // Smooth animation style
//   },

//   interaction: {
//     intersect: false, // Show tooltip even if not exactly on the point
//     axis: "x", // Interaction happens along x-axis
//     // mode: "index"
//   },

//   plugins: {
//     legend: {
//       display: false, // Hide legend
//     },
//     tooltip: {
//       enabled: false,
//       position: "nearest", // Positioning of tooltip
//       external: externalTooltipHandler,
//     },
//     hoverline,
//   },

//   elements: {
//     point: {
//       pointStyle: "rectRounded",
//       pointBorderColor: '#ffffff',
//       pointRadius: 0,
//       hoverRadius: 5, // Circle size on hover
//       hitRadius: 1, // Clickable area size
//       backgroundColor: "rgba(41, 168, 124, 1)",
//       hoverBorderWidth: 2.5,
//     },
//     line: {
//       borderWidth: 3.125, // Line thickness
//       tension: 0.4, // Line curve smoothness (0 = straight lines)
//     },
//   },

//   scales: {
//     x: {
//       grid: {
//         display: false, // Hide vertical grid lines
//       },
//       ticks: {
//         stepSize: 50, // Distance between x-axis labels (optional)
//       },
//     },
//     y: {
//       grid: {
//         color: "#3D3C41", // Horizontal grid line color
//         lineWidth: 2, // Grid line thickness
//         border: {
//           // display: true,    // Show left y-axis border
//         },
//       },
//       ticks: {
//         display: false, // Hide y-axis numbers
//         stepSize: 8, // Control number of grid lines
//       },
//       border: {
//         display: false, // Hide y-axis border (redundant but clear)
//       },
//     },
//   },
// };

// // Chart Data
// const data = {
//   labels, // X-axis labels
//   datasets: [
//     {
//       data: view,
//       borderColor: "#F76E6E",
//       fill: true, // Fill area under line
//     },
//     {
//       data: subscribers,
//       borderColor: "gray",
//     },
//   ],
// };

// const pendingDatas = [
//   {
//     id: 1,
//     imgURL:
//       "https://images.pexels.com/photos/4523001/pexels-photo-4523001.jpeg?auto=compress&cs=tinysrgb&w=600",
//     videoId: "",
//     title: "I love you man",
//   },
//   {
//     id: 2,
//     imgURL:
//       "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600",
//     videoId: "",
//     title: "hello bro how are you",
//   },
//   {
//     id: 3,
//     imgURL:
//       "https://images.pexels.com/photos/8801117/pexels-photo-8801117.jpeg?auto=compress&cs=tinysrgb&w=600",
//     videoId: "",
//     title: "Today we will learn how to go to bed",
//   },
// ];

// // Dummy analytics data
// const analyticsData = {
//   views: {
//     value: 150,
//     change: 12.5,
//     positive: false,
//   },
//   watchTime: {
//     value: 150,
//     change: 12.5,
//     positive: true,
//   },
//   subscribers: {
//     value: "15k",
//     change: 13,
//     positive: true,
//   },
//   earnings: {
//     value: "$150",
//     change: 12.5,
//     positive: false,
//   },
//   viewsLast28Days: 236,
// };

// export default function CreatorPage() {
//   const chartRef = useRef(null);
//   const lineRef = useRef(null);
//   const [gradient, setGradient] = useState(null);
//   useEffect(() => {
//     if (chartRef.current) {
//       const ctx = chartRef.current.ctx;
//       const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//       gradient.addColorStop(0, "rgba(168, 41, 41, 0.390)"); // starting color with transparency
//       gradient.addColorStop(0.358, "rgba(0, 0, 0, 0)"); // fading out to transparent
//       setGradient(gradient);
//     }
//   }, []);

//   const data = {
//     labels,
//     datasets: [
//       {
//         data: view,
//         borderColor: "#F76E6E",
//         fill: true,
//         backgroundColor: gradient,
//       },
//       {
//         data: subscribers,
//         borderColor: "gray",
//       },
//     ],
//   };

//   return (
//     <div className="min-h-[100vh] p-10  grid-rows-2 gap-10 h-full">
//       {/* Graph section */}
//       <div className=" bg-[#212121] rounded-2xl p-4 flex flex-col ">
//         {/* Analytics cards */}
//         <div className="grid grid-cols-4 gap-4 mb-4">
//           <AnalyticsCard
//             title="Views"
//             value={analyticsData.views.value}
//             change={analyticsData.views.change}
//             positive={analyticsData.views.positive}
//           />
//           <AnalyticsCard
//             title="Watch time"
//             value={analyticsData.watchTime.value}
//             change={analyticsData.watchTime.change}
//             positive={analyticsData.watchTime.positive}
//           />
//           <AnalyticsCard
//             title="Subscribers"
//             value={analyticsData.subscribers.value}
//             change={analyticsData.subscribers.change}
//             positive={analyticsData.subscribers.positive}
//           />
//           <AnalyticsCard
//             title="Earnings"
//             value={analyticsData.earnings.value}
//             change={analyticsData.earnings.change}
//             positive={analyticsData.earnings.positive}
//           />
//         </div>

//         {/* Info text */}
//         <div className="text-xs text-gray-500 mb-4">
//           Your channel got {analyticsData.viewsLast28Days} views in the last 28
//           days
//         </div>

//         {/* Graph */}
//         {/* SVG Graph */}
//         <div className="w-full antialiased h-full">
//           <div id="tooltip"></div>
//           <Line ref={chartRef} data={data} options={options} />
//         </div>
//       </div>

//       {/* Pending projects section */}
//       <div className="py-4 flex flex-col gap-5">
//         <h3 className="text-lg font-medium font-sans">Pending works</h3>
//         <div className="grid grid-cols-3 gap-16">
//           {pendingDatas.map((data) => (
//             <YTCard
//               key={`${data.id}`}
//               imageUrl={`${data.imgURL}`}
//               // title={`${data.title}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



function CreatorPage() {
  return (
    <div>Creator Page</div>
  )
}

export default CreatorPage