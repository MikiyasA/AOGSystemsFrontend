import {
  useAddFollowUpMutation,
  useAddRemarkMutation,
  useGetAllActiveFollowUpsTabsQuery,
  useGetAllPartQuery,
  useGetAllTabsQuery,
} from "@/pages/api/apiSlice";
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { IconFilterSearch } from "@tabler/icons-react";

const FollowUpForm = ({ tab }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      followUpTabsId: tab.id,
      rid: "",
      requestDate: new Date(),
      airCraft: "",
      tailNo: "",
      workLocation: "Home Base",
      aogStation: "",
      customer: "ETH",
      partNumber: "",
      description: "",
      stockNo: "",
      financialClass: "",
      poNumber: "",
      orderType: "",
      quantity: 1,
      uom: "EA",
      vendor: "",
      edd: null,
      status: "Request Received",
      awbNo: "",
      flightNo: "",
      needHigherMgntAttn: false,
      message: "On Quote",
    },
    validate: {
      rid: (v) =>
        v?.length < 3
          ? "RID must be provided and should be 3 character minimum"
          : null,
    },
  });

  const [
    addFollowup,
    {
      isSuccess: isFpSuccess,
      isError,
      error: upFperror,
      isLoading: isFpLoading,
    },
  ] = useAddFollowUpMutation();

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    addFollowup(form.values);
  };
  useEffect(() => {
    isFpSuccess && modals.closeAll();
  }, [isFpSuccess]);

  const {
    data: activeTabs,
    isLoading: tabIsLoading,
    isSuccess: tabIsSuccess,
  } = useGetAllActiveFollowUpsTabsQuery("");

  return (
    <>
      {isFpLoading || (tabIsLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Select
            label="Follow-up Tab"
            placeholder="Select Tab"
            data={activeTabs.map((tab: any) => ({
              value: `${tab.id}`,
              label: `${tab.name}`,
            }))}
            {...form.getInputProps("followUpTabsId")}
            required
          />
          <TextInput
            label="RID"
            placeholder="Request ID"
            {...form.getInputProps("rid")}
            required
          />
          <DateInput
            label="Request Date"
            placeholder="Request Date"
            value={form.values.requestDate && new Date(form.values.requestDate)}
            onChange={(e: any) =>
              form.setValues({ requestDate: new Date(e.toString()) })
            }
            error={form.errors.requestDate}
            required
          />
          <Select
            label="Aircraft Type" //{form.getInputProps('airCraft').value ? "Aircraft Type" : "Select an Option"}
            placeholder="Pick Aircraft"
            data={["A350", "B737", "B777", "B787", "Q400", "B767", "B757"]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("airCraft")}
            required
          />
          <TextInput
            label="Tail No"
            placeholder="Tail No"
            {...form.getInputProps("tailNo")}
            required
          />
          <Select
            label="Work Location"
            placeholder="Work Location"
            data={["Home Base", "Out Station", "Tool"]}
            allowDeselect={false}
            {...form.getInputProps("workLocation")}
            required
          />
          <TextInput
            label="AOG Station"
            placeholder="AOG Station"
            {...form.getInputProps("aogStation")}
            required={form.values.workLocation === "Out Station"}
          />
          <TextInput
            label="Customer"
            placeholder="Customer"
            defaultValue={"ETH"}
            {...form.getInputProps("customer")}
          />
          <TextInput
            label="Part Number"
            placeholder="Part Number"
            {...form.getInputProps("partNumber")}
          />
          <TextInput
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
            required={form.values.partNumber !== ""}
          />
          <TextInput
            label="Stock No"
            placeholder="Stock No"
            {...form.getInputProps("stockNo")}
          />
          <TextInput
            label="PO Number"
            placeholder="PO Number"
            {...form.getInputProps("poNumber")}
          />
          <Select
            label="Order Type" // {form.getInputProps('orderType').value ? "Order Type" : "Select an Option"}
            placeholder="Order Type"
            data={[
              "Purchase",
              "Exchange",
              "CEP",
              "Repair",
              "Warranty",
              "Borrow",
            ]}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("orderType")}
            required={form.values.poNumber !== ""}
          />
          <Group justify="space-between">
            <NumberInput
              styles={{
                wrapper: {
                  width: "120px",
                },
              }}
              label="Quantity"
              placeholder="Quantity"
              defaultValue={1}
              min={1}
              {...form.getInputProps("quantity")}
              required
            />
            <TextInput
              styles={{
                wrapper: {
                  width: "120px",
                },
              }}
              width={"50%"}
              label="UOM"
              placeholder="Unit of measurment"
              defaultValue={"EA"}
              {...form.getInputProps("uom")}
              // data={['EA', 'SH', 'LBS', 'CAN', 'A', 'B']}
            />
          </Group>
          <TextInput
            label="Vendor"
            placeholder="Vendor"
            {...form.getInputProps("vendor")}
            required={form.values.poNumber !== ""}
          />
          <DateInput
            label="EDD"
            placeholder="Estimated Delivey Date"
            value={form.values.edd && new Date(form.values.edd)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ edd: dateValue });
            }}
            error={form.errors.edd}
            clearable
          />
          <Select
            label={
              form.getInputProps("status").value ? "Status" : "Select an Option"
            }
            placeholder="Status"
            data={[
              "Request Received",
              "On Quote",
              "Order Placed",
              "On Hold",
              "Under Shipping",
              "Under Receiving",
              "Partially Received",
              "Received",
              "Received & Advised",
              "Closed",
            ]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("status")}
          />
          <TextInput
            label="AWB"
            placeholder="AWB"
            {...form.getInputProps("awbNo")}
            required={form.values.status === "Under Shipping"}
          />
          <TextInput
            label="Flight No"
            placeholder="Flight No"
            {...form.getInputProps("flightNo")}
            required={form.values.status === "Under Shipping"}
          />
          <TextInput
            label="Remark"
            placeholder="Remark"
            defaultValue={"On Quote"}
            {...form.getInputProps("message")}
          />
          <Group align="end">
            <Checkbox
              label="Need High Managment Attension"
              variant="filled"
              {...form.getInputProps("needHigherMgntAttn")}
            />
          </Group>
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={isFpLoading}>
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export default FollowUpForm;

export const FollowupFilterForm = ({ form, handleSubmit, isLoading }: any) => {
  const { data: part } = useGetAllPartQuery("");
  const { data: tab } = useGetAllTabsQuery("");

  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Followup{" "}
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={handleSubmit}>
            <Box>
              <SimpleGrid
                cols={{ base: 1, sm: 3, lg: 5 }}
                spacing={{ base: 1, sm: "xl", lg: "sm" }}
                verticalSpacing={{ base: "sm", sm: "sm" }}
              >
                <TextInput
                  label="RID"
                  placeholder="RID to search"
                  {...form.getInputProps("rid")}
                />
                <DateInput
                  label="Request Date From"
                  placeholder="Pick Request Date From"
                  value={
                    form.values.requestDateFrom &&
                    new Date(form.values.requestDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      requestDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.requestDateFrom}
                  clearable
                />
                <DateInput
                  label="Request Date To"
                  placeholder="Pick Request Date To"
                  value={
                    form.values.requestDateTo &&
                    new Date(form.values.requestDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      requestDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.requestDateTo}
                  clearable
                />
                <TextInput
                  label="Aircraft"
                  placeholder="Aircraft to search"
                  {...form.getInputProps("airCraft")}
                />
                <TextInput
                  label="Tail No"
                  placeholder="Tail No to search"
                  {...form.getInputProps("tailNo")}
                />
                <Select
                  label="Work Location"
                  placeholder="Work Location"
                  data={["Home Base", "Out Station", "Tool"]}
                  allowDeselect={false}
                  {...form.getInputProps("workLocation")}
                />
                <TextInput
                  label="AOG Station"
                  placeholder="AOG Station to search"
                  {...form.getInputProps("aogStation")}
                />
                <TextInput
                  label="Customer"
                  placeholder="Customer to search"
                  {...form.getInputProps("customer")}
                />
                <TextInput
                  label="PO Number"
                  placeholder="PO Number to search"
                  {...form.getInputProps("PONumber")}
                />
                <Select
                  label="Order Type"
                  placeholder="Order Type"
                  data={[
                    "Purchase",
                    "Exchange",
                    "CEP",
                    "Repair",
                    "Warranty",
                    "Borrow",
                  ]}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("orderType")}
                />
                <TextInput
                  label="Vendor"
                  placeholder="Vendor to search"
                  {...form.getInputProps("vendor")}
                />
                <TextInput
                  label="AWB No"
                  placeholder="AWB No to search"
                  {...form.getInputProps("awbNo")}
                />
                <TextInput
                  label="Flight No"
                  placeholder="Flight No to search"
                  {...form.getInputProps("flightNo")}
                />
                <Select
                  label="Reassigned To"
                  placeholder="Select one User"
                  data={part?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.partNumber}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("reAssignedBy")}
                />
                <Select
                  label="Reassigned To"
                  placeholder="Select one User"
                  data={tab?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.partNumber}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("reAssignedBy")}
                />
                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Request Received",
                    "On Quote",
                    "Order Placed",
                    "On Hold",
                    "Under Shipping",
                    "Under Receiving",
                    "Partially Received",
                    "Received",
                    "Received & Advised",
                    "Closed",
                  ]}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("status")}
                />
                <NumberInput
                  label="No. Data per page"
                  placeholder="No. Data per page"
                  {...form.getInputProps("pageSize")}
                />
              </SimpleGrid>
            </Box>
            <Button type="submit" mt="sm" loading={isLoading}>
              {" "}
              Filter
            </Button>
          </form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
