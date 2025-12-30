import React from "react";

interface TabsProps {
  setView: React.Dispatch<React.SetStateAction<number>>;
}

const Tabs: React.FC<TabsProps> = ({ setView }) => {
  return (
    <>
      <div
        onClick={() => {
          setView(1);
        }}
        className="flex items-center mt-5 gap-3 md:gap-5 border border-gray-300 p-3 rounded-lg hover:bg-gray-300 transition ease-in-out duration-300 cursor-pointer"
      >
        <img src="usdt.svg" className="aspect-square w-10" />
        <div>
          <div className="font-semibold">Withdraw USDT</div>
          <div className="text-sm txt text-gray-700">
            Withdraw USDT from your in app wallet (BEP-20)
          </div>
        </div>
      </div>

      {/* <div
        onClick={() => {
          setView(2);
        }}
        className="flex items-center mt-5 gap-3 md:gap-5 border border-gray-300 p-3 rounded-lg hover:bg-gray-300 transition ease-in-out duration-300 cursor-pointer"
      >
        <img src="usdc.svg" className="aspect-square w-10" />
        <div>
          <div className="font-semibold">Withdraw USDC</div>
          <div className="text-sm txt text-gray-700">
            Withdraw USDC from your in app wallet
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Tabs;
