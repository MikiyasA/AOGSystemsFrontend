import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { SalesTable } from "@/components/Sales/SalesTable";
import Layout from "@/hocs/Layout";
import { Group, Box, Center, Tabs } from "@mantine/core";
import {
  useGetAllActiveLoanQuery,
  useGetAllActiveSalesOrderQuery,
  useGetAllLoansQuery,
} from "../api/apiSlice";
import { LoanTable } from "@/components/Loan/LoanTable";
import { IconChecklist } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { LoanFilterForm } from "@/components/Loan/LoanForm";
import { useEffect, useState } from "react";
import withAuth from "@/hocs/withAuth";

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
  const form = useForm();
  const queryStr = Object.keys(form.values)
    .map(
      (key) =>
        form.values[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(form.values[key])}`
    )
    .join("&");

  const [queryString, SetQueryString] = useState(queryStr);

  useEffect(() => {
    form.values?.page && SetQueryString(queryStr);
  }, [queryStr, form.values?.page]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    SetQueryString(queryStr);
  };
  const { data: allLoans, isLoading: allLoading } =
    useGetAllLoansQuery(queryString);
  return (
    <Layout title="Loan Orders" description="Sales Orders">
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
                Active Loan Orders
              </Tabs.Tab>
              <Tabs.Tab
                color="green"
                value="inactive"
                leftSection={<IconChecklist color="green" />}
              >
                All Loan Orders
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Active">
              <Box>
                <LoanTable
                  data={loanData}
                  table={loanTable}
                  tableTitle="Active Loan Orders"
                  isActive
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="inactive">
              <Box>
                <LoanFilterForm
                  form={form}
                  handleSubmit={handleSubmit}
                  isLoading={allLoading}
                />
                <LoanTable
                  data={allLoans?.data}
                  table={loanTable}
                  tableTitle="All Loan Orders"
                  metadata={allLoans?.metadata}
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
