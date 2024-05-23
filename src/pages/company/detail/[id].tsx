import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import CompanyDetail from "@/components/Company/CompanyDetail";
import Layout from "@/hocs/Layout";
import {
  useGetCompanyByIDQuery,
  useGetPartByPNQuery,
} from "@/pages/api/apiSlice";
import { Box, Group } from "@mantine/core";
import { useRouter } from "next/router";
import withAuth from "@/hocs/withAuth";

const Detail = () => {
  const route = useRouter();
  const { data: company, isLoading } = useGetCompanyByIDQuery(route?.query.id);

  return (
    <Layout
      title={`Company Detail of ${company ? company.name : ""}`}
      description="Company Detail"
    >
      {isLoading && <MyLoadingOverlay />}
      <Box w={"100%"} style={{ placeContent: "center" }}>
        <CompanyDetail data={company} />
      </Box>
    </Layout>
  );
};
export default withAuth(Detail, ["Coordinator", "TL", "Management"]);
