import { TbAntennaBars5 } from "react-icons/tb";
export default function Iphone({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Phone Body */}
      <div className="relative w-[300px] h-[620px] dark:bg-black/70 bg-black/80 rounded-[50px] shadow-2xl p-[10px]">
        {/* Screen */}
        <div className="relative w-full h-full bg-background rounded-[40px] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-full z-10"></div>

          {/* Content */}
          <div className="w-full h-full overflow-hidden ">
            <div className="px-5 py-3 flex justify-between items-center sticky  top-0 left-0 right-0 z-10">
              <p className="text-[13px] font-sans font-bold">10:13</p>
              <div className="flex items-center justify-center">
                <TbAntennaBars5 className="text-[17px] font-sans font-bold" />
                <p className="text-[10px] font-sans font-bold">LTE</p>
                <div className="relative px-1 rounded-md bg-gray-300 ml-1 text-[8px] font-sans font-bold flex items-center justify-center ">
                  <span className="font-sans font-bold z-3 text-black  text-[9px]">
                    41
                  </span>
                  <span className="absolute rounded-l-md left-0 z-2 w-1/2 h-full bg-yellow-500 "></span>
                </div>
              </div>
            </div>
            {children || (
              <div className="flex items-center justify-center h-full text-gray-500">
                Your App UI
              </div>
            )}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[5px] bg-black/30 rounded-full z-10"></div>
        </div>

        {/* Side Buttons */}
        <div className="absolute left-[-4px] top-[110px] w-[3px] h-[18px] bg-gray-700 rounded-l-sm"></div>
        <div className="absolute left-[-4px] top-[150px] w-[4px] h-[50px] bg-gray-700 rounded-l-lg"></div>
        <div className="absolute left-[-4px] top-[206px] w-[4px] h-[50px] bg-gray-700 rounded-l-lg"></div>
        <div className="absolute right-[-4px] top-[160px] w-[4px] h-[60px] bg-gray-700 rounded-r-lg"></div>
      </div>
    </div>
  );
}
