
export default function VideoDetails({ params }: {params : { project: string }}) {
    const videoId = params.project[1];

    return (
        <div className="border h-full w-full p-10 flex flex-col gap-3">
            <div className="border text-xl font-semibold font-sans">Today, 20th Mar</div>

            {/* Whole container */}
            <div className="border border-red-700 h-full w-full flex">

                {/* Video part */}
                <div className="border border-teal-700 w-4/5 p-2">

                    {/* Video div */}
                    <div className="border border-cyan-400 h-4/6"></div>
                    {/* Title div */}
                    <div className="border border-cyan-400 h-1/6 p-3">Hi guys hello</div>
                    {/* Description div */}
                    <div className="border border-cyan-400 h-1/6"></div>
                </div>
                
                {/* Thumbnail part */}
                <div className="border border-purple-500 w-1/5 p-2">
                    
                </div>
            </div>

            {/* All buttons */}
            <div className="border border-yellow-500 h-20">
                buttons
            </div>
        </div>
    )
}
