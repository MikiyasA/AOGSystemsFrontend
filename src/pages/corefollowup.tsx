import Layout from "@/hocs/Layout";
import { Paper, Loader, Group, Tabs, Center, Box } from "@mantine/core";
import {
  useGetAllActiveCoreFollowupQuery,
  useGetAllCoreFollowupQuery,
} from "./api/apiSlice";
import { FollowupTable } from "@/components/AOGFollowup/FollowupTable";
import { CoreFollowupTable } from "@/components/Core/CoreFollowupTable";
import { IconChecklist } from "@tabler/icons-react";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { CoreFilterForm } from "@/components/Core/CoreForm";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

var coreTable = [
  { key: "poNo", value: "PO" },
  { key: "poCreatedDate", value: "Created Date" },
  { key: "aircraft", value: "A/C" },
  { key: "partNumber", value: "PN" },
  { key: "description", value: "Description" },
  { key: "stockNo", value: "Stock No" },
  { key: "vendor", value: "Vendor" },
  { key: "partReleasedDate", value: "Part Released Date" },
  { key: "partReceiveDate", value: "Part Receive Date" },
  { key: "returnDueDate", value: "Return Due Date" },
  { key: "returnProcessedDate", value: "Return Processed Date" },
  { key: "returnedPart", value: "Returned Part" },
  { key: "awbNo", value: "AWB No" },
  { key: "podDate", value: "POD Date" },
  { key: "remark", value: "Remark" },
];

const CoreFollowup = () => {
  const {
    data: activeCoreFp,
    error,
    isLoading,
  } = useGetAllActiveCoreFollowupQuery("");

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

  const { data: allCoreFp, isLoading: isLoadingCoreFp } =
    useGetAllCoreFollowupQuery(queryString);

  return (
    <Layout title="Core Followup" description="Core Followup">
      {isLoading || (isLoadingCoreFp && <MyLoadingOverlay />)}
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
              Active Core Followup
            </Tabs.Tab>
            <Tabs.Tab
              color="green"
              value="inactive"
              leftSection={<IconChecklist color="green" />}
            >
              All Core Followup
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Active">
            <Group>
              <CoreFollowupTable
                data={activeCoreFp}
                table={coreTable}
                tableTitle="Active Core Followup Table"
                isActive
              />
            </Group>
          </Tabs.Panel>
          <Tabs.Panel value="inactive">
            <Box>
              <CoreFilterForm
                form={form}
                handleSubmit={handleSubmit}
                isLoading={isLoadingCoreFp}
              />
              <CoreFollowupTable
                data={allCoreFp?.data}
                table={coreTable}
                tableTitle="All Core Followup Table"
                metadata={allCoreFp?.metadata}
                form={form}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Layout>
  );
};

export default CoreFollowup;
