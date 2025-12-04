import { MdOutlineCrisisAlert } from "react-icons/md";
import { TbReceiptTax } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";

export const todayTile = [
  {
    icon: MdOutlineCrisisAlert,
    title: "Total Sales",
    key: "todaySales.totalAmount",
    currentTime: "Today",
  },
  {
    icon: TbReceiptTax,
    title: "Total Invoices",
    key: "todaySales.invoiceCount",
    currentTime: "Today",
  },
  {
    icon: GiReturnArrow,
    title: "Total Tax",
    key: "todaySales.totalTax",
    currentTime: "Today",
  }
];

export const monthTile = [
  {
    icon: MdOutlineCrisisAlert,
    title: "Monthly Sales",
    key: "monthlySales.totalAmount",
    currentTime: "Current Month",
  },
  {
    icon: TbReceiptTax,
    title: "Monthly Invoices",
    key: "monthlySales.invoiceCount",
    currentTime: "Current Month",
  },
  {
    icon: GiReturnArrow,
    title: "Monthly Tax",
    key: "monthlySales.totalTax",
    currentTime: "Current Month",
  },
];

