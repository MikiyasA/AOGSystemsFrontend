import Layout from "@/hocs/Layout";
import { Paper, Loader, Group, Tabs, Center, Box } from "@mantine/core";
import { IconChecklist } from "@tabler/icons-react";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  useGetActiveCostSavingsQuery,
  useGetAllCostSavingQuery,
} from "./api/apiSlice";
import { CostSavingTable } from "@/components/CostSaving/CostSavingTable";
import { CostSavingFilterForm } from "@/components/CostSaving/CostSavingForm";
import withAuth from "@/hocs/withAuth";

var costSavingTable = [
  { key: "oldPO", value: "Old PO" },
  { key: "newPO", value: "New PO" },
  { key: "issueDate", value: "Issue Date" },
  { key: "cnDate", value: "CN Date" },
  { key: "oldPrice", value: "Old Price" },
  { key: "newPrice", value: "New Price" },
  { key: "priceVariance", value: "Price Variance" },
  { key: "quantity", value: "Quantity" },
  { key: "savingInUSD", value: "Saving In USD" },
  { key: "savingInETB", value: "Saving In ETB" },
  { key: "remark", value: "Remark" },
  { key: "isPurchaseOrder", value: "Is Purchase Order" },
  { key: "isRepairOrder", value: "Is Repair Order" },
  { key: "savedBy", value: "Saved By" },
  { key: "status", value: "Status" },
];

const CostSaving = () => {
  const {
    data: activeCostSaving,
    isLoading: CSloading,
    isSuccess: CSSuccess,
  } = useGetActiveCostSavingsQuery("");

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

  const { data: allCostSaving, isLoading: isLoadingCS } =
    useGetAllCostSavingQuery(queryString);

  return (
    <Layout title="Cost Saving Followup" description="CostSaving Followup">
      {(CSloading || isLoadingCS) && <MyLoadingOverlay />}
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
              Active Cost Saving Followup
            </Tabs.Tab>
            <Tabs.Tab
              color="green"
              value="inactive"
              leftSection={<IconChecklist color="green" />}
            >
              All Cost Saving Followup
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Active">
            <Group>
              <CostSavingTable
                data={activeCostSaving}
                table={costSavingTable}
                tableTitle="Active Cost Saving Table"
                isActive
              />
            </Group>
          </Tabs.Panel>
          <Tabs.Panel value="inactive">
            <Box>
              <CostSavingFilterForm
                form={form}
                handleSubmit={handleSubmit}
                isLoading={isLoadingCS}
              />
              <CostSavingTable
                data={allCostSaving?.data}
                table={costSavingTable}
                tableTitle="All Cost Saving Table"
                metadata={allCostSaving?.metadata}
                form={form}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Layout>
  );
};

export default withAuth(CostSaving, ["Coordinator", "TL", "Management"]);
