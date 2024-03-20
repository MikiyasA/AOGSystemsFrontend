import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import CompanyDetail from "@/components/Company/CompanyDetail";
import Layout from "@/hocs/Layout";
import {
  useGetCompanyByIDQuery,
  useGetPartByIdQuery,
  useGetPartByPNQuery,
} from "@/pages/api/apiSlice";
import { Box, Group } from "@mantine/core";
import { useRouter } from "next/router";
import PartDetail from "@/components/Part/PartDetail";
import withAuth from "@/hocs/withAuth";

const Detail = () => {
  const route = useRouter();
  const { data: part, isLoading } = useGetPartByIdQuery(route?.query.id);

  return (
    <Layout
      title={`Part Detail of ${part ? part.partNumber : ""}`}
      description="Part Detail"
    >
      {isLoading && <MyLoadingOverlay />}
      <Box w={"100%"} style={{ placeContent: "center" }}>
        <PartDetail part={part} />
      </Box>
    </Layout>
  );
};
export default withAuth(Detail, ["Coordinator", "TL", "Management"]);
