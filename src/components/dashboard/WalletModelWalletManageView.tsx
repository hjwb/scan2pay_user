import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { Spinner } from "../ui/spinner";
import { getBalance, setBalance } from "@/store/slices/priceSlice";
import { ArrowRightLeft, CircleDollarSign, Coins, Wallet } from "lucide-react";

const formSchema = z.object({
  walletAddress: z.string().length(42, {
    message: "Wallet address must be of 42 characters.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Amount must be greater than 0." }),
  token: z.enum(["usdt", "usdc"]),
});

type FormSchema = z.infer<typeof formSchema>;

interface WalletModelViewProps {
  setView: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletModelWalletManageView: React.FC<WalletModelViewProps> = ({
  setView,
  setOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);
  const refetchBalance = useSelector(
    (state: RootState) => state?.price?.fetchBalance
  );

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      walletAddress: "",
      amount: undefined as unknown as number,
      token: "usdt",
    },
  });

  const { watch } = form;
  const walletAddress = watch("walletAddress");
  const amount = watch("amount");
  const selectedToken = watch("token");

  const isDisabled =
    loading ||
    !walletAddress ||
    walletAddress.length !== 42 ||
    !amount ||
    Number(amount) <= 0 ||
    !selectedToken;

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/fund-transfer`,
        {
          user_id: userData?.id,
          amount: values.amount,
          type: values.token,
          send_wallet_address: values.walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);
      if (response.data.status == "false") {
        showError("Transaction Failed.", response.data.message);
        setView(0);
        return;
      }
      showSuccess("Transfer Successful", "Funds Transfered Successfully");
      setView(0);
      dispatch(setBalance({ balance: null }));
      dispatch(getBalance({ fetchBalance: !refetchBalance }));
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="">
    //     <FormField
    //       control={form.control}
    //       name="token"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Token</FormLabel>
    //           <FormControl>
    //             <Select
    //               disabled={loading}
    //               onValueChange={field.onChange}
    //               value={field.value}
    //             >
    //               <SelectTrigger className="w-full">
    //                 <SelectValue placeholder="Select token" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="usdt">
    //                   <img src="usdt.svg" className="w-7 aspect-square" /> USDT
    //                 </SelectItem>
    //                 <SelectItem value="usdc">
    //                   <img src="usdc.svg" className="w-7 aspect-square" /> USDC
    //                 </SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="walletAddress"
    //       render={({ field }) => (
    //         <FormItem className="mt-3">
    //           <FormLabel>Wallet Address</FormLabel>
    //           <FormControl>
    //             <Input
    //               disabled={loading}
    //               placeholder="0xab2...9ha6Q"
    //               {...field}
    //             />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="amount"
    //       render={({ field }) => (
    //         <FormItem className="mt-3">
    //           <FormLabel>Amount</FormLabel>
    //           <FormControl>
    //             <Input
    //               disabled={loading}
    //               placeholder="Enter amount"
    //               {...field}
    //             />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     {showModel && (
    //       <div
    //         onClick={() => setShowModel(false)}
    //         className="bg-gray-900/60 flex z-50 justify-center items-center backdrop-blur-lg absolute inset-0 rounded-lg"
    //       >
    //         <div
    //           onClick={(e) => e.stopPropagation()}
    //           className="bg-white rounded-lg px-5 py-3 max-w-md mx-2 w-full"
    //         >
    //           <div className="font-semibold">
    //             Are you sure you want to proceed?
    //           </div>
    //           <div className="text-sm my-2 text-gray-600">
    //             By clicking on the tranfer fund button the funds will be
    //             transfered to the address provided with the provided amount.
    //           </div>
    //           <Button
    //             disabled={loading}
    //             className="w-full mt-3 cursor-pointer bg-[#4D43EF] hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
    //             type="submit"
    //           >
    //             {loading ? <Spinner className="size-6" /> : "Transfer Fund"}
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //     <Button
    //       disabled={isDisabled}
    //       type="button"
    //       onClick={() => {
    //         if (!isDisabled) setShowModel(true);
    //       }}
    //       className="w-full disabled:cursor-not-allowed mt-3 cursor-pointer bg-[#4D43EF] hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
    //     >
    //       Submit
    //     </Button>
    //   </form>
    // </Form>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* --- Token Selection --- */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-700">
                Select Token
              </FormLabel>
              <FormControl>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full h-14 px-4 py-6 bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-[#4D43EF]/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="bg-gray-100 p-1.5 rounded-full">
                        <Coins className="size-4 text-gray-500" />
                      </div>
                      <SelectValue placeholder="Choose asset to transfer" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="p-1">
                    <SelectItem
                      value="usdt"
                      className="cursor-pointer py-3 focus:bg-gray-50 my-1 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src="usdt.svg"
                            alt="USDT"
                            className="w-8 h-8 shadow-sm rounded-full"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-gray-900">
                            USDT
                          </span>
                          <span className="text-xs text-gray-500">
                            Tether USD
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="usdc"
                      className="cursor-pointer py-3 focus:bg-gray-50 my-1 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="usdc.svg"
                          alt="USDC"
                          className="w-8 h-8 shadow-sm rounded-full"
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-gray-900">
                            USDC
                          </span>
                          <span className="text-xs text-gray-500">
                            USD Coin
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Wallet Address --- */}
        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-700">
                Wallet Address
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D43EF] transition-colors">
                    <Wallet className="size-5" />
                  </div>
                  <Input
                    disabled={loading}
                    placeholder="0xab2...9ha6Q"
                    className="pl-12 h-14 bg-white border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-[#4D43EF]/20 focus-visible:border-[#4D43EF] transition-all font-mono text-sm"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Amount --- */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-700">
                Amount
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4D43EF] transition-colors">
                    <CircleDollarSign className="size-5" />
                  </div>
                  <Input
                    disabled={loading}
                    placeholder="0.00"
                    type="number"
                    className="pl-12 h-14 bg-white border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-[#4D43EF]/20 focus-visible:border-[#4D43EF] transition-all text-lg font-medium"
                    {...field}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 uppercase">
                    {form.watch("token") || "USD"}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Confirmation Modal --- */}
        {showModel && (
          <div
            onClick={() => setShowModel(false)}
            className="fixed inset-0 z-50 rounded-lg flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-[#4D43EF]/10 rounded-full">
                    <ArrowRightLeft className="size-8 text-[#4D43EF]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Confirm Transaction
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                      You are about to send{" "}
                      <span className="font-semibold text-gray-900">
                        {form.getValues("amount")}{" "}
                        {form.getValues("token")?.toUpperCase()}
                      </span>{" "}
                      to the provided address. This action cannot be undone.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="w-full bg-gray-50 rounded-lg p-4 mt-2 text-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">To:</span>
                      <span className="font-mono text-gray-700 truncate w-32 text-right">
                        {form.getValues("walletAddress")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-500">Total:</span>
                      <span className="text-[#4D43EF]">
                        {form.getValues("amount")}{" "}
                        {form.getValues("token")?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    disabled={loading}
                    type="button"
                    variant="outline"
                    onClick={() => setShowModel(false)}
                    className="flex-1 cursor-pointer h-11 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="flex-1 cursor-pointer h-11 bg-[#4D43EF] hover:bg-[#4338ca] shadow-lg shadow-indigo-500/30 transition-all duration-300"
                  >
                    {loading ? (
                      <Spinner className="size-5" />
                    ) : (
                      "Confirm Transfer"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Initial Trigger Button --- */}
        <Button
          disabled={isDisabled}
          type="button"
          onClick={() => {
            if (!isDisabled) setShowModel(true);
          }}
          className="w-full cursor-pointer h-12 text-base font-semibold mt-4 bg-[#4D43EF] hover:bg-[#4338ca] shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Preview Transaction
        </Button>
      </form>
    </Form>
  );
};

export default WalletModelWalletManageView;
