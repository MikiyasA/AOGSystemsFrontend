import InvoiceDetail from "@/components/Invoice/InvoiceDetail";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";
import { useGetInvoiceByIDQuery } from "@/pages/api/apiSlice";
import { Box, Center, GridCol, Grid, Title } from "@mantine/core";
import { useRouter } from "next/router";

const InvoiceDetailPage = () => {
  const route = useRouter();

  const { data: invoice, isLoading } = useGetInvoiceByIDQuery(route.query.id);

  return (
    <>
      {isLoading && <MyLoadingOverlay />}
      <InvoiceDetail data={invoice} location="print" />
    </>
  );
};

export default withAuth(InvoiceDetailPage, ["Coordinator", "TL", "Management"]);
