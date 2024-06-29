import PartForm from "@/components/Part/PartForm";
import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";
import { Box, Center } from "@mantine/core";

const AddPart = () => {
  return (
    <Layout title="Add Part" description="Add Part">
      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          marginLeft: "10pc",
          width: "80%",
        }}
      >
        <PartForm action="add" redirect />
      </Center>
    </Layout>
  );
};

export default withAuth(AddPart, ["Coordinator", "TL", "Management"]);
