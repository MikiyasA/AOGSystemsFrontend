import CompanyForm from "@/components/Company/CompanyForm";
import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";
import { Box, Center } from "@mantine/core";

const AddCompany = () => {
  return (
    <Layout title="Add Company" description="Add Company">
      {/* <Box style={{marginLeft: '10pc', width: '80%'}}> */}
      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          marginLeft: "10pc",
          width: "80%",
        }}
      >
        <CompanyForm action="add" />
      </Center>
      {/* </Box> */}
    </Layout>
  );
};

export default withAuth(AddCompany, ["Coordinator", "TL", "Management"]);
