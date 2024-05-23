import VendorBatch from "@/components/SOA/VendorBatch";
import Layout from "@/hocs/Layout";
import { Box, Button, Center, SimpleGrid, Tabs, Title } from "@mantine/core";
import {
  useGetActiveVendorSOAByUserIdQuery,
  useGetAllActiveSOAVendorsQuery,
  useGetAllSOAVendorQuery,
} from "../api/apiSlice";
import { modals } from "@mantine/modals";
import { VendorFilterForm, VendorForm } from "@/components/SOA/SOAForms";
import { IconChecklist } from "@tabler/icons-react";
import VendorList from "@/components/SOA/VendorList";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import withAuth from "@/hocs/withAuth";
import WithComponentAuth from "@/hocs/WithComponentAuth";

const SOA = () => {
  const { data: activeVendors } = useGetAllActiveSOAVendorsQuery("");
  const { data: mySOAVendor } = useGetActiveVendorSOAByUserIdQuery("");
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
    e.preventDefault();
    SetQueryString(queryStr);
  };

  const { data: allVendors, isLoading: allLoading } =
    useGetAllSOAVendorQuery(queryString);
  return (
    <Layout title="SOA" description="SOA">
      <Box w={"100%"} m={20}>
        <WithComponentAuth
          allowedRoles={["Coordinator", "TL", "Management", "Buyer", "Finance"]}
        >
          <Button
            ml={50}
            onClick={() =>
              modals.open({
                title: "Update Vendor",
                size: "80%",
                children: <VendorForm action="add" />,
              })
            }
          >
            Add Vendor
          </Button>
        </WithComponentAuth>
        <Box m={20}>
          <Tabs defaultValue="My" color="green">
            <Tabs.List>
              <Tabs.Tab
                color="green"
                value="My"
                leftSection={<IconChecklist color="green" />}
              >
                My SOA Vendors
              </Tabs.Tab>
              <Tabs.Tab
                color="green"
                value="Active"
                leftSection={<IconChecklist color="green" />}
              >
                Active SOA Vendors
              </Tabs.Tab>
              <Tabs.Tab
                color="green"
                value="inactive"
                leftSection={<IconChecklist color="green" />}
              >
                All SOA Vendors
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="My">
              <Box>
                <VendorList
                  data={mySOAVendor}
                  title="Active SOA Vendors"
                  isActive
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="Active">
              <Box>
                <VendorList
                  data={activeVendors}
                  title="Active Vendors"
                  isActive
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="inactive">
              <Box>
                <VendorFilterForm
                  form={form}
                  handleSubmit={handleSubmit}
                  isLoading={allLoading}
                />
                <VendorList
                  data={allVendors?.data}
                  title="All SOA Vendors"
                  metadata={allVendors?.metadata}
                  form={form}
                />
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Box>
    </Layout>
  );
};
export default withAuth(SOA, [
  "Coordinator",
  "TL",
  "Management",
  "Buyer",
  "Finance",
]);
