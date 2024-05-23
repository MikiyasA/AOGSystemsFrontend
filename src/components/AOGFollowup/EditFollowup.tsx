import {
  useAddRemarkMutation,
  useGetAllActiveFollowUpsTabsQuery,
  useGetPartByIdQuery,
  useUpdateFollowupMutation,
} from "@/pages/api/apiSlice";
import {
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
import { IconSelectAll } from "@tabler/icons-react";
import { Input } from "postcss";
import { useEffect } from "react";
import FollowUpForm from "./AddFollowUp";
import { notifications } from "@mantine/notifications";
import { UpdateFollowupRType } from "@/config/type";
import MyLoadingOverlay from "../MyLoadingOverlay";

interface RowData {
  rid: string;
  requestDate: Date;
  airCraft: string;
  tailNo: string;
  workLocation: string;
  aogStation: string;
  customer: string;
  partNumber: string;
  description: string;
  stockNo: string;
  financialClass: string;
  poNumber: string;
  orderType: string;
  quantity: number | any;
  uom: string;
  vendor: string;
  edd: Date | null | undefined;
  status: string;
  awbNo: string;
  needHigherMgntAttn: boolean;
}

const EditFollowup = ({ data, tab }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      followUpTabsId: tab?.id,
      id: data?.id,
      rid: data?.rid,
      requestDate: data?.requestDate,
      airCraft: data?.airCraft,
      tailNo: data?.tailNo,
      workLocation: data?.workLocation,
      aogStation: data?.aogStation,
      customer: data?.customer,
      partNumber: data?.partNumber,
      haveCostSaving: data?.haveCostSaving,
      description: data?.description,
      stockNo: data?.stockNo,
      financialClass: data?.financialClass,
      poNumber: data?.poNumber,
      orderType: data?.orderType,
      quantity: data?.quantity || 1,
      uom: data?.uom,
      vendor: data?.vendor,
      edd: data?.edd,
      flightNo: data?.flightNo,
      status: data?.status,
      awbNo: data?.awbNo,
      needHigherMgntAttn: data?.needHigherMgntAttn,
    },
    validate: {
      rid: (v) =>
        v?.length < 4
          ? "RID must be provided and should be 4 character minimum"
          : null,
      // requestDate: (v) => (v === null ? 'Request Date is mandatory' : null)
    },
  });
  const remarkForm = useForm({
    initialValues: {
      aogFollowUpId: data.id,
      message: data.remarks[0]?.message,
    },
  });

  const [updateFollowup, { isSuccess: isFpSuccess, isLoading: isFpLoading }] =
    useUpdateFollowupMutation();
  const [addRemark, { isLoading }] = useAddRemarkMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    remarkForm.values.message !== data.remarks[0]?.message &&
      addRemark(remarkForm.values);
    const updateReturnData: any = await updateFollowup(form.values);
    updateReturnData?.data?.isSuccess
      ? notifications.show({
          title: "Success",
          message:
            updateReturnData?.data?.message ||
            "Followup updated Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            updateReturnData?.data?.error?.message ||
            "Error occure on followup updated",
          color: "red",
        });
  };
  isFpSuccess && modals.closeAll();

  useEffect(() => {
    remarkForm.setFieldValue(
      "message",
      data.remarks[0]?.message === undefined
        ? "On quote"
        : data.remarks[0]?.message
    );
  }, []);

  const {
    data: activeTabs,
    isLoading: tabIsLoading,
    isSuccess: tabIsSuccess,
  } = useGetAllActiveFollowUpsTabsQuery("");

  return (
    <>
      {isFpSuccess || isLoading || (tabIsLoading && <MyLoadingOverlay />)}

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
            defaultValue={new Date()}
            value={new Date(form.values.requestDate)}
            onChange={(e: any) =>
              form.setValues({ requestDate: new Date(e.toString()) })
            }
            error={form.errors.requestDate}
          />
          <Select
            label={
              form.getInputProps("airCraft").value
                ? "Aircraft Type"
                : "Select an Option"
            }
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
            required
          />
          <TextInput
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
            required
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
            required={form.values.haveCostSaving}
          />
          <Checkbox
            label="Has Cost Saving"
            variant="filled"
            checked={form.values.haveCostSaving}
            {...form.getInputProps("haveCostSaving")}
            style={{ alignSelf: "end", paddingBottom: 10 }}
          />
          <Select
            // label="Order Type"
            label={
              form.getInputProps("orderType").value
                ? "Order Type"
                : "Select an Option"
            }
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
            required={form.values.poNumber}
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
              min={1}
              {...form.getInputProps("quantity")}
            />
            <TextInput
              styles={{
                wrapper: {
                  width: "120px",
                },
              }}
              width={"50%"}
              label="UOM"
              placeholder="Unit of measurement"
              defaultValue={"EA"}
              {...form.getInputProps("uom")}
            />
          </Group>
          <TextInput
            label="Vendor"
            placeholder="Vendor"
            {...form.getInputProps("vendor")}
            required={form.values.poNumber}
          />
          <DateInput
            label="EDD"
            placeholder="Estimated Delivery Date"
            value={form.values.edd && new Date(form.values.edd)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ edd: dateValue });
            }}
            error={form.errors.edd}
            clearable
          />
          <Select
            // label="Status"
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
              "Received",
              "Partially Received",
              "Received & Advised",
              "Closed",
            ]}
            defaultValue="Request Received"
            searchable
            nothingFoundMessage="Nothing found..."
            // allowDeselect={false}
            {...form.getInputProps("status")}
          />
          <TextInput
            label="AWB"
            placeholder="AWB"
            {...form.getInputProps("awbNo")}
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
            {...remarkForm.getInputProps("message")}
          />
          <Group align="end">
            <Checkbox
              label="Need High Managment Attension"
              variant="filled"
              checked={form.values.needHigherMgntAttn}
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
export default EditFollowup;
