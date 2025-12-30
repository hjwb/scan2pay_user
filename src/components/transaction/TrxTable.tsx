import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
import { Spinner } from "../ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
interface Transaction {
  amount: number; //
  type: string; //
  income_id: string; //
  transaction_type: "USDT" | "USDC";
  transaction_hash: string;
  payment_method: string;
  updated_at: string;
  inr_amount: number;
  created_at:string
}

const TrxTable: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [count, setCount] = useState(1);
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);
  const navigate = useNavigate();

  async function fetchTransactions() {
    try {
      setloading(true);
      const response = await axios.post(
        `${baseUrl}/transactions-list`,
        {
          user_id: userData?.id,
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ response });

      if (response.data.status == "false") {
        setTransaction([]);
        return;
      }

      setTransaction(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [count]);

  return (
    <div
      className={`flex flex-col  gap-2 overflow-hidden my-15 ${
        transaction.length !== 10 ? "h-fit" : "min-h-118"
      }`}
    >
      {loading ? (
        <div className="h-full flex-1 font-semibold bg-[#4D43EF]/10 rounded-lg flex justify-center items-center gap-2 py-30">
          <Spinner className="size-6" /> Loading...
        </div>
      ) : transaction.length == 0 ? (
        <div className="h-full font-semibold bg-[#4D43EF]/10 flex-1 flex justify-center rounded-lg items-center gap-2 py-30">
          No Data Found.
        </div>
      ) : (
        <div className="max-h-130 border rounded-lg overflow-x-auto">
          <Table className="">
            <TableCaption>
              <div className="flex justify-between mx-1 mb-2">
                <button
                  onClick={() => {
                    setCount((prev) => prev - 1);
                  }}
                  disabled={count == 1}
                  className="border-2 px-3 rounded cursor-pointer border-[#4D43EF] hover:bg-[#4D43EF]/90 hover:border-[#4D43EF]/70 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:border-[#4D43EF] disabled:hover:bg-[#4D43EF] text-white bg-[#4D43EF] transtion ease-in-out duration-300"
                >
                  Prev
                </button>
                <div>A list of your recent transactions.</div>
                <button
                  disabled={transaction.length !== 10}
                  onClick={() => {
                    setCount((prev) => prev + 1);
                  }}
                  className="border-2 px-3 rounded cursor-pointer border-[#4D43EF] hover:bg-[#4D43EF]/90 hover:border-[#4D43EF]/70 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:border-[#4D43EF] disabled:hover:bg-[#4D43EF] text-white bg-[#4D43EF] transtion ease-in-out duration-300"
                >
                  Next
                </button>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Trx Id</TableHead>
                <TableHead>Trx Type</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>INR</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.map((item, index) => {
                return (
                  <TableRow
                    className="odd:bg-[#4D43EF]/10 hover:bg-gray-100 cursor-pointer transition ease-in-out duration-300"
                    onClick={() => {
                      navigate("/order/" + item.income_id);
                    }}
                    key={index}
                  >
                    <TableCell>{item?.income_id ?? "-"}</TableCell>
                    <TableCell className="">
                      {item?.payment_method?.toString()?.toUpperCase() ?? "-"}
                    </TableCell>
                    <TableCell>
                      {item?.type[0].toUpperCase() + item?.type.slice(1)}
                    </TableCell>
                    <TableCell className="">
                      ₹{item?.inr_amount ?? "-"}
                    </TableCell>
                    <TableCell>
                      ${item?.amount?.toFixed(2) ?? "00.00"}
                    </TableCell>
                    <TableCell>
                   {new Date(item.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  </TableCell>
                    {/* <TableCell>
                      {item?.updated_at
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") ?? "00.00"}
                    </TableCell> */}
                    <TableCell className="flex items-center gap-1 hover:text-[#4D43EF] cursor-pointer transition ease-in-out duration-300">
                      {item?.transaction_hash && <ExternalLink size={14} />}
                      {item?.transaction_hash ? (
                        item?.transaction_hash.slice(0, 6) +
                        "..." +
                        item?.transaction_hash.slice(-6)
                      ) : (
                        <p className="w-full text-center">-</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TrxTable;
