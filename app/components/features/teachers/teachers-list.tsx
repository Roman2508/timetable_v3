import { Button } from "~/components/ui/common/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/common/table";
import { ArrowUp, Ellipsis } from "lucide-react";
import { TeacherActionsDropdown } from "./teacher-actions-dropdown";

const invoices = [
  {
    invoice: "1",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "2",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "3",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "4",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "5",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "6",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "7",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const TeachersList = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">№</TableHead>

          <TableHead>
            <div className="flex items-center gap-1">
              ПІБ
              <ArrowUp className="w-4 cursor-pointer" />
            </div>
          </TableHead>

          <TableHead>
            <div className="flex items-center gap-1">
              Пошта
              <ArrowUp className="w-4 cursor-pointer" />
            </div>
          </TableHead>

          <TableHead>
            <div className="flex items-center gap-1">
              Циклова комісія
              <ArrowUp className="w-4 cursor-pointer" />
            </div>
          </TableHead>

          <TableHead className="text-center">
            <div className="flex items-center gap-1">
              Останній вхід
              <ArrowUp className="w-4 cursor-pointer" />
            </div>
          </TableHead>

          <TableHead className="text-right">
            <div className="flex items-center gap-1">
              Статус
              <ArrowUp className="w-4 cursor-pointer" />
            </div>
          </TableHead>

          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell className="text-right">
              <TeacherActionsDropdown />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { TeachersList };
