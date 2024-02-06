import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { SalesTable } from "@/components/Sales/SalesTable";
import Layout from "@/hocs/Layout";
import { Group, Box } from "@mantine/core";
import { useGetAllActiveSalesOrderQuery } from "../api/apiSlice";

var salesTable = [
  { key: "orderNo", value: "Order No" },
  { key: "customerOrderNo", value: "Customer Order No" },
  { key: "companyId", value: "Customer Name" },
  { key: "orderByName", value: "Order By Name" },
  { key: "orderByEmail", value: "Order By Email" },
  { key: "status", value: "Status" },
  { key: "note", value: "Note" },
  { key: "createdAT", value: "Order Date" },
];

const Sales = () => {
  const {
    data: salesData,
    isLoading,
    isSuccess,
  } = useGetAllActiveSalesOrderQuery("");
  return (
    <Layout title="Active Sales Orders" description="Sales Orders">
      {isLoading && <MyLoadingOverlay />}
      {isSuccess && (
        <SalesTable
          data={salesData}
          table={salesTable}
          tableTitle="All Active Sales Orders"
          isActive
        />
      )}
    </Layout>
  );
};

export default Sales;
