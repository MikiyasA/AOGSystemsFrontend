import InvoiceDetail from "@/components/Invoice/InvoiceDetail";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import Layout from "@/hocs/Layout";
import { useGetInvoiceByIDQuery } from "@/pages/api/apiSlice";
import { Box, Center, GridCol, Grid, Title } from "@mantine/core";
import { useRouter } from "next/router";

const InvoiceDetailPage = () => {
  const route = useRouter();

  const { data: invoice, isLoading } = useGetInvoiceByIDQuery(route.query.id);

  return (
    <Layout
      title={`Invoice Detail of ${invoice ? invoice.invoiceNo : ""}`}
      description="Invoice Detail"
    >
      {isLoading && <MyLoadingOverlay />}
      <InvoiceDetail data={invoice} />
    </Layout>
  );
};

export default InvoiceDetailPage;
