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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import axios from "axios";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { getBalance, setBalance } from "@/store/slices/priceSlice";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, { message: "Amount must be greater than 0." }),
  token: z.enum(["usdt", "usdc"]),
});

type FormSchema = z.infer<typeof formSchema>;

interface BuyModelProps {
  setView: React.Dispatch<React.SetStateAction<number>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  currency: string;
}

const Buy: React.FC<BuyModelProps> = ({ setCurrency, currency, setView }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);
  const userData = useSelector((state: RootState) => state.user.userData);
  const refetchBalance = useSelector(
    (state: RootState) => state?.price?.fetchBalance
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      amount: undefined as unknown as number,
      token: "usdt",
    },
  });

  const { watch } = form;
  const amount = watch("amount");
  const selectedToken = watch("token");

  const isDisabled =
    loading || !amount || Number(amount) <= 0 || !selectedToken;

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/buy`,
        {
          user_id: userData?.id ?? "",
          amount: values?.amount ?? "",
          wallet_address: "0x6fdd0f90e8d74e876c59fc24d044e9f2bae13b53",
          transaction_hash: "xaidfiuay9a7dy9yf32yr2c9297c4ynp924nyc",
          type: values?.token ?? "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data.status.toLowerCase() !== "success") {
        showError(
          "Buy failed.",
          `Something went wrong while buying ${values.token}.`
        );
        setView(0);
        return;
      }
      showSuccess(
        "Buy successful.",
        `You bought $${values.amount} of ${values.token} successfully.`
      );
      setView(0);
      dispatch(setBalance({ balance: null }));
      dispatch(getBalance({ fetchBalance: !refetchBalance }));
    } catch (error) {
      showError(
        "Buy failed.",
        `Something went wrong while buying ${values.token}.`
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCurrency(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdt">
                        <img src="usdt.svg" className="w-7 aspect-square" />{" "}
                        USDT
                      </SelectItem>
                      <SelectItem value="usdc">
                        <img src="usdc.svg" className="w-7 aspect-square" />{" "}
                        USDC
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full disabled:cursor-not-allowed mt-3 cursor-pointer bg-[#4D43EF] hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
          >
            {loading ? (
              <Spinner className="size-6 mx-auto" />
            ) : (
              `Buy ${currency.toUpperCase()}`
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Buy;
