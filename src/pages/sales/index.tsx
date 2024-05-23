import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { SalesTable } from "@/components/Sales/SalesTable";
import Layout from "@/hocs/Layout";
import { Group, Box, Center, Tabs } from "@mantine/core";
import {
  useGetAllActiveSalesOrderQuery,
  useGetAllSalesOrderQuery,
} from "../api/apiSlice";
import { IconChecklist } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { SalesFilterForm } from "@/components/Sales/SalesForm";
import { useEffect, useState } from "react";
import withAuth from "@/hocs/withAuth";

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

  const form = useForm();
  const queryStr = Object.keys(form.values)
    .map(
      (key) =>
        form.values[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(
          (form as any).values[key]
        )}`
    )
    .join("&");

  const [queryString, SetQueryString] = useState(queryStr);

  useEffect(() => {
    form.values?.page && SetQueryString(queryStr);
  }, [queryStr, form.values?.page]);

  const handleSubmit = (e: any) => {
    e?.preventDefault();
    SetQueryString(queryStr);
  };

  const { data: allSales, isLoading: allLoading } =
    useGetAllSalesOrderQuery(queryString);

  return (
    <Layout title="Active Sales Orders" description="Sales Orders">
      {isLoading && <MyLoadingOverlay />}
      {isSuccess && (
        <Center
          style={{
            placeContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Tabs defaultValue="Active" color="green">
            <Tabs.List>
              <Tabs.Tab
                color="green"
                value="Active"
                leftSection={<IconChecklist color="green" />}
              >
                Active Sales Orders
              </Tabs.Tab>
              <Tabs.Tab
                color="green"
                value="inactive"
                leftSection={<IconChecklist color="green" />}
              >
                All Sales Orders
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Active">
              <Box>
                <SalesTable
                  data={salesData}
                  table={salesTable}
                  tableTitle="Active Sales Orders"
                  isActive
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="inactive">
              <Box>
                <SalesFilterForm
                  form={form}
                  handleSubmit={handleSubmit}
                  isLoading={allLoading}
                />
                <SalesTable
                  data={allSales?.data}
                  table={salesTable}
                  tableTitle="All Sales Orders"
                  metadata={allSales?.metadata}
                  form={form}
                />
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Center>
      )}
    </Layout>
  );
};

export default withAuth(Sales, ["Coordinator", "TL", "Management"]);
