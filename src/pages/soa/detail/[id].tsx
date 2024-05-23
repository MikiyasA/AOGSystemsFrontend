import { InvoiceListFilterForm, VendorForm } from "@/components/SOA/SOAForms";
import { SOATable } from "@/components/SOA/SOATable";
import { VendorDetailBatch } from "@/components/SOA/VendorBatch";
import { formatDate } from "@/config/util";
import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";
import {
  useGetSOAVendorByIDActiveQuery,
  useGetSOAVendorByIDAllQuery,
} from "@/pages/api/apiSlice";
import {
  Badge,
  Box,
  Text,
  Center,
  Group,
  NumberFormatter,
  SimpleGrid,
  Title,
  Grid,
  Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconAt,
  IconChecklist,
  IconCircleArrowUpRight,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

var tableCols = [
  { key: "invoiceNo", value: "Invoice No " },
  { key: "poNo", value: "PO No" },
  { key: "invoiceDate", value: "Invoice Date" },
  { key: "dueDate", value: "Due Date" },
  { key: "amount", value: "Amount" },
  { key: "underFollowup", value: "Under Followup" },
  { key: "paymentProcessedDate", value: "Payment Processed Date" },
  { key: "popDate", value: "POP Date" },
  { key: "popReference", value: "POP Reference" },
  { key: "chargeType", value: "Charge Type" },
  { key: "buyerName", value: "Buyer Name" },
  { key: "tlName", value: "TL Name" },
  { key: "managerName", value: "Manager Name" },
  { key: "buyerRemarks", value: "Buyer Remarks" },
  { key: "financeRemarks", value: "Finance Remarks" },
  { key: "status", value: "Status" },
];

export const SOADetail = ({}: any) => {
  var route = useRouter();
  const { id } = route.query;

  const { data } = useGetSOAVendorByIDActiveQuery(id);

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
  const { data: allSoA, isLoading: allLoading } = useGetSOAVendorByIDAllQuery({
    vendorId: id,
    query: queryString,
  });
  // form.setFieldValue("vendorId", data.id);

  return (
    <Layout title={`SOA Detail ${data?.vendorName}`} description="SOA Detail">
      {/* {data && ( */}
      <Grid m={20}>
        <Grid.Col span="content">
          <VendorDetailBatch data={data} />
        </Grid.Col>
        <Grid.Col span={"auto"}>
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
                <SOATable
                  data={data?.invoiceLists}
                  vendorId={data?.id}
                  table={tableCols}
                  tableTitle="List Active of Invoices"
                  isActive
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="inactive">
              <Box>
                <InvoiceListFilterForm
                  vendorId={data?.id}
                  form={form}
                  handleSubmit={handleSubmit}
                  isLoading={allLoading}
                />
                <SOATable
                  data={allSoA?.data}
                  vendorId={data?.id}
                  table={tableCols}
                  tableTitle="List All of Invoices"
                  metadata={allSoA?.metadata}
                  form={form}
                />
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
      {/* )} */}
    </Layout>
  );
};

export default withAuth(SOADetail, [
  "Coordinator",
  "TL",
  "Management",
  "Buyer",
  "Finance",
]);
