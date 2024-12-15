import { Transaction } from "../types/types";
import {
  calculateTotalOwed,
  calculateTransactionTotals,
  calculateTotalExpenses,
} from "../utils/calculations";
import { formatIndianRupee } from "../utils/format";
import { IndianRupee } from "lucide-react";

interface TotalBalanceProps {
  transactions: Transaction[];
}

export function TotalBalance({ transactions }: TotalBalanceProps) {
  const totalOwed = calculateTotalOwed(transactions);
  const { totalGiven, totalReceived } =
    calculateTransactionTotals(transactions);
  const isPositive = totalOwed > 0;
  const totalExpenses = calculateTotalExpenses(transactions);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <IndianRupee className="text-blue-600" />
        Total Balance
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-red-600">
          <div className="text-sm font-medium">Total Given</div>
          <div className="text-lg font-semibold mt-1">
            {formatIndianRupee(totalGiven)}
          </div>
        </div>
        <div className="text-green-600">
          <div className="text-sm font-medium">Total Received</div>
          <div className="text-lg font-semibold mt-1">
            {formatIndianRupee(totalReceived)}
          </div>
        </div>
        <div
          className={`${
            isPositive
              ? "text-green-600"
              : totalOwed < 0
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          <div className="text-sm font-medium">Net Balance</div>
          <div className="text-lg font-semibold mt-1 flex items-center gap-1">
            {isPositive ? "+" : ""}
            {formatIndianRupee(totalOwed)}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {totalOwed > 0
          ? "Total amount friends owe you"
          : totalOwed < 0
          ? "Total amount you owe to friends"
          : "All settled up!"}
      </p>
      <hr className="my-6" />

      <div className="text-orange-600">
        <div className="text-sm font-medium">
          Total Expense : {formatIndianRupee(totalExpenses)}
        </div>
      </div>
    </div>
  );
}
