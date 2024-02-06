import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { SalesTable } from "@/components/Sales/SalesTable";
import Layout from "@/hocs/Layout";
import { Group, Box } from "@mantine/core";
import {
  useGetAllActiveLoanQuery,
  useGetAllActiveSalesOrderQuery,
} from "../api/apiSlice";
import { LoanTable } from "@/components/Loan/LoanTable";

var loanTable = [
  { key: "orderNo", value: "Order No" },
  { key: "customerOrderNo", value: "Customer Order No" },
  { key: "companyId", value: "Customer Name" },
  { key: "orderedByName", value: "Order By Name" },
  { key: "orderedByEmail", value: "Order By Email" },
  { key: "status", value: "Status" },
  { key: "note", value: "Note" },
  { key: "createdAT", value: "Order Date" },
];

const Sales = () => {
  const { data: loanData, isLoading, isSuccess } = useGetAllActiveLoanQuery("");
  return (
    <Layout title="Active Sales Orders" description="Sales Orders">
      {isLoading && <MyLoadingOverlay />}
      {isSuccess && (
        <LoanTable
          data={loanData}
          table={loanTable}
          tableTitle="All Active Loan Orders"
          isActive
        />
      )}
    </Layout>
  );
};

export default Sales;
