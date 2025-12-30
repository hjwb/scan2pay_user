import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchBalanceThunk } from "@/store/slices/priceSlice";
import { Skeleton } from "@/components/ui/skeleton";
interface Balance {
  total_usdt: string;
  total_inr: string;
}
const Balance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { balance, loading } = useSelector((state: RootState) => state.price);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state?.user?.token);
  const refetchBalance = useSelector(
    (state: RootState) => state?.price?.fetchBalance
  );

  useEffect(() => {
    if (userData?.id && token && baseUrl) {
      dispatch(
        fetchBalanceThunk({ baseUrl, userId: userData.id.toString(), token })
      );
    }
  }, [dispatch, baseUrl, userData, token, refetchBalance]);

  // useEffect(() => {
  //   console.log("Loading:", loading);
  //   console.log("Balance:", balance);
  //   console.log("Error:", error);
  // }, [loading, balance, error]);

  if (!balance || loading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="txt text-lg font-semibold text-gray-700">
          Available Balance
        </div>
        <div className="font-extrabold flex items-center gap-1 text-5xl">
          {" "}
          $<Skeleton className="h-12 bg-[#5728A6]/30 w-40" />
        </div>
        <div className="font-semibold flex items-center gap-1 text-lg">
          ~ ₹<Skeleton className="h-5 bg-[#5728A6]/30 w-[100px]" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="txt text-lg font-semibold text-gray-700">
        Available Balance
      </div>
      <div className="font-bold text-5xl">
        {" "}
        ${Number(balance?.total_usdt ?? 0).toFixed(2)}{" "}
      </div>
      <div className="font-semibold text-lg">
        ~ ₹{Number(balance?.total_inr ?? 0).toFixed(2)}{" "}
      </div>
    </div>
  );
};

export default Balance;
