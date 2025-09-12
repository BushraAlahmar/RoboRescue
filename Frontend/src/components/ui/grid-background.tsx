import React from "react";

function GridBackground() {
    return (
        <div className="fixed inset-0 w-full h-full bg-gray-900 text-white flex items-center justify-center z-0">
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(32,128,32,0.2)_2%,_transparent_3%),_linear-gradient(90deg,transparent_0%,_rgba(32,128,32,0.2)_2%,_transparent_3%)] bg-[length:50px_50px]"></div>
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-800 to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
            </div> */}
        </div>
    );
}

export default GridBackground;
