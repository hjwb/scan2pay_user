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
import { Link } from "react-router";

interface Transaction {
  amount: number; //
  inr_amount: number;
  type: string; //
  income_id: string; //
  transaction_type: "USDT" | "USDC";
  transaction_hash: string;
  payment_method: string;
}
const WalletModelTransactionView: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  async function fetchTransactions() {
    try {
      setloading(true);
      const response = await axios.post(
        `${baseUrl}/transactions-list`,
        {
          user_id: userData?.id,
          count: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);

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
  }, []);

  return (
    <div className={`flex flex-col gap-2 overflow-hidden`}>
      {loading ? (
        <div className="h-full flex justify-center items-center gap-2">
          <Spinner className="size-6" /> Loading...
        </div>
      ) : transaction.length == 0 ? (
        <div className="h-full flex justify-center items-center gap-2">
          No Data Found.
        </div>
      ) : (
        <div className="max-h-120 overflow-y-auto overflow-x-auto">
          <Table>
            <TableCaption>
              A list of your recent transactions. To see more{" "}
              <Link
                to="/transaction"
                className="text-[#4D43EF] font-semibold cursor-pointer"
              >
                click here.
              </Link>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Trx Id</TableHead>
                <TableHead>Trx Type</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>INR Amt</TableHead>
                <TableHead className="text-center">Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className="odd:bg-[#4D43EF]/10 hover:bg-gray-100 cursor-pointer"
                  >
                    <TableCell>{item?.income_id ?? "-"}</TableCell>
                    <TableCell>
                      {item?.payment_method?.toString()?.toUpperCase() ?? "-"}
                    </TableCell>
                    <TableCell>
                      {item?.type[0].toUpperCase() + item?.type.slice(1)}
                    </TableCell>
                    <TableCell>${item?.amount.toFixed(4) ?? "-"}</TableCell>
                    <TableCell>₹{item?.inr_amount.toFixed(4) ?? "-"}</TableCell>
                    <TableCell className="flex items-center gap-1 cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300">
                      {item?.transaction_hash && <ExternalLink size={14} />}
                      {item?.transaction_hash ? (
                        item?.transaction_hash.slice(0, 4) +
                        "..." +
                        item?.transaction_hash.slice(-4)
                      ) : (
                        <p className="text-center w-full">-</p>
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

export default WalletModelTransactionView;
