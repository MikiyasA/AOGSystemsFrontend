import Layout from "@/hocs/Layout";
import { Paper, Loader, Group, Tabs, Center } from "@mantine/core";
import {
  useGetAllActiveCoreFollowupQuery,
  useGetAllCoreFollowupQuery,
} from "./api/apiSlice";
import { FollowupTable } from "@/components/AOGFollowup/FollowupTable";
import { CoreFollowupTable } from "@/components/Core/CoreFollowupTable";
import { IconChecklist } from "@tabler/icons-react";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";

var coreTable = [
  { key: "poNo", value: "PO" },
  { key: "poCreatedDate", value: "Created Date" },
  { key: "aircraft", value: "A/C" },
  { key: "partNumber", value: "PN" },
  { key: "description", value: "Description" },
  { key: "stockNo", value: "Stock No" },
  { key: "vendor", value: "Vendor" },
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
  const { data: allCoreFp, isLoading: isLoadingCoreFp } =
    useGetAllCoreFollowupQuery("");

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
            <Group>
              <CoreFollowupTable
                data={allCoreFp}
                table={coreTable}
                tableTitle="All Core Followup Table"
              />
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Layout>
  );
};

export default CoreFollowup;
