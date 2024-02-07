import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/hocs/Layout";
import { FollowupTable } from "@/components/AOGFollowup/FollowupTable";
import {
  useGetAllActiveFollowUpsQuery,
  useGetAllActiveFollowUpsTabsQuery,
  useGetPartByIdQuery,
} from "./api/apiSlice";
import { Box, Button, Group, Tabs, Center } from "@mantine/core";
import {
  IconChecklist,
  IconCirclePlus,
  IconEyeCheck,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import TabForm from "@/components/AOGFollowup/TabForm";
import TabActionMenu from "@/components/AOGFollowup/TabActionMenu";
import Link from "next/link";
import { API_URL } from "@/config";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  var { data, isSuccess, isLoading } = useGetAllActiveFollowUpsQuery("");

  var homeBaseTable = [
    { key: "rid", value: "RID" },
    { key: "requestDate", value: "Request Date" },
    { key: "airCraft", value: "A/C" },
    { key: "customer", value: "Customer" },
    { key: "partNumber", value: "PN" },
    { key: "description", value: "Description" },
    { key: "stockNo", value: "STK#" },
    { key: "poNumber", value: "PO" },
    { key: "orderType", value: "Type" },
    { key: "quantity", value: "Qty" },
    { key: "vendor", value: "Vendor" },
    { key: "edd", value: "EDD" },
    { key: "awbNo", value: "AWB No" },
    { key: "remarks", value: "Remarks" },
  ];

  var outStationTable = [
    { key: "aogStation", value: "AOG Station" },
    ...homeBaseTable,
  ];

  var receivingTable = [
    { key: "rid", value: "RID" },
    { key: "airCraft", value: "A/C" },
    { key: "customer", value: "Customer" },
    { key: "partNumber", value: "PN" },
    { key: "description", value: "Description" },
    { key: "poNumber", value: "PO" },
    { key: "quantity", value: "Qty" },
    { key: "vendor", value: "Vendor" },
    { key: "awbNo", value: "AWB No" },
    { key: "flightNo", value: "Flight No" },
    { key: "edd", value: "EDD" },
    { key: "status", value: "Status" },
    { key: "remarks", value: "Remarks" },
  ];

  const needHigherMgntAttnData = data?.filter(
    (w: any) => w.needHigherMgntAttn === true
  );

  const underReceiving = data?.filter(
    (w: any) =>
      w.status === "Under Receiving" ||
      w.status === "Received" ||
      w.status === "Received & Advised"
  );

  const {
    data: activeTabs,
    isLoading: tabIsLoading,
    isSuccess: tabIsSuccess,
  } = useGetAllActiveFollowUpsTabsQuery("");

  const handleExport = () => {
    fetch(`${API_URL}/AOGFollowUp/ExportAOGFPTOExcel`) // Adjust the endpoint URL
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const today = new Date();
        const date = today.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const hour = today.getHours();
        const shift =
          hour < 3 ? "Evening" : hour < 9 ? "Night" : hour < 18 ? "Day" : "";
        link.download = `AOG Part Status For ${date} ${shift} Shift.xlsx`; // Use the same filename as in the handler
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        // Handle errors
      });
  };

  return (
    <Layout title="AOG Follow Up" description="Follow Up table ">
      {isLoading || (tabIsLoading && <MyLoadingOverlay />)}

      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Tabs defaultValue="Main Follow-up" color="green">
          {tabIsSuccess && (
            <Tabs.List>
              <Tabs.Tab
                color="green"
                value="needHigherMgntAttn"
                leftSection={<IconEyeCheck color="green" />}
              >
                Needs High Mgnt Attention
              </Tabs.Tab>
              {activeTabs.map((tab: any, index: any) => (
                <Group key={index}>
                  <Tabs.Tab
                    key={index}
                    color={tab.color}
                    value={tab.name}
                    leftSection={<IconChecklist color={tab.color} />}
                  >
                    {tab.name}
                  </Tabs.Tab>

                  <TabActionMenu data={tab} />
                </Group>
              ))}
              <IconCirclePlus
                color="green"
                cursor={"pointer"}
                onClick={() =>
                  modals.open({
                    size: "60%",
                    title: "Followup Detail",
                    children: <TabForm action="add" />,
                  })
                }
              />
              <Button onClick={handleExport} ml={30}>
                Export Followup
              </Button>
            </Tabs.List>
          )}

          <Tabs.Panel value="needHigherMgntAttn">
            <FollowupTable
              data={needHigherMgntAttnData}
              table={homeBaseTable}
              tableTitle="Followups Needs High Management Attention"
            />
          </Tabs.Panel>
          {activeTabs?.map((tab: any, index: any) => (
            <Tabs.Panel key={index - 1} value={tab.name}>
              <Group mt={30}>
                {isSuccess && (
                  <>
                    {tab.name === "Main Follow-up" ? (
                      <>
                        <FollowupTable
                          tab={tab}
                          data={tab?.followUps.filter(
                            (w: any) =>
                              w.workLocation === "Out Station" &&
                              w.status !== "Under Receiving"
                          )}
                          table={outStationTable}
                          tableTitle="Out Station Followup"
                        />
                        <FollowupTable
                          tab={tab}
                          data={tab?.followUps.filter(
                            (w: any) =>
                              w.workLocation === "Home Base" &&
                              w.status !== "Under Receiving"
                          )}
                          table={homeBaseTable}
                          tableTitle="Home Base Followup"
                        />
                        <FollowupTable
                          tab={tab}
                          data={underReceiving}
                          table={receivingTable}
                          tableTitle="Part Under Receiving"
                        />
                      </>
                    ) : (
                      <FollowupTable
                        tab={tab}
                        data={tab?.followUps}
                        table={homeBaseTable}
                        tableTitle={tab.name}
                      />
                    )}
                  </>
                )}
              </Group>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Center>
    </Layout>
  );
}
