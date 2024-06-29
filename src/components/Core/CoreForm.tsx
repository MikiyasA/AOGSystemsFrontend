import {
  useAddCoreFollowupMutation,
  useUpdateCoreFollowupMutation,
  useUpdateFollowupMutation,
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
import { IconFilterSearch, IconSelectAll } from "@tabler/icons-react";
import { Input } from "postcss";
import { useEffect } from "react";
import FollowUpForm from "../AOGFollowup/AddFollowUp";
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

const CoreForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      poNo: data?.poNo,
      poCreatedDate: data?.poCreatedDate,
      aircraft: data?.aircraft,
      tailNo: data?.tailNo,
      partNumber: data?.partNumber,
      description: data?.description,
      stockNo: data?.stockNo,
      vendor: data?.vendor,
      partReleasedDate: data?.partReleasedDate || new Date(),
      partReceiveDate: data?.partReceiveDate,
      returnDueDate: data?.returnDueDate,
      returnProcessedDate: data?.returnProcessedDate,
      awbNo: data?.awbNo,
      returnedPart: data?.returnedPart,
      podDate: data?.podDate,
      remark: data?.remark,
      status: data?.status,
    },
    validate: {
      // rid: (v) => (v?.length < 4 ? 'RID must be provided and should be 4 character minimum' : null),
      // requestDate: (v) => (v === null ? 'Request Date is mandatory' : null)
    },
  });
  const [
    addCoreFollowup,
    { isLoading: addCFisLoading, isSuccess: addCFisSuccess, error: addError },
  ] = useAddCoreFollowupMutation();
  const [
    updateCoreFollowup,
    {
      isLoading: updateCFisLoading,
      isSuccess: updateCFisSuccess,
      error: updateError,
    },
  ] = useUpdateCoreFollowupMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addCoreFollowup(form.values).unwrap();
      addReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Core Followup Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.error.message ||
              "Error occurs on add Core Followup",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateCoreFollowup(form.values).unwrap();
      updateReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Core Followup Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.error.message ||
              updateReturn?.data.title ||
              "Error occurs on update Core Followup",
            color: "red",
          });
    }
  };

  useEffect(() => {
    addCFisSuccess || (updateCFisSuccess && modals.closeAll());
  }, [addCFisSuccess, updateCFisSuccess]);

  return (
    <>
      {addCFisLoading || (updateCFisLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="PO No"
            placeholder="Order No"
            {...form.getInputProps("poNo")}
            required
          />
          <DateInput
            label="PO Created Date"
            placeholder="Order Created Date"
            defaultValue={new Date()}
            value={
              form.values.poCreatedDate && new Date(form.values.poCreatedDate)
            }
            onChange={(e: any) =>
              form.setValues({ poCreatedDate: new Date(e.toString()) })
            }
            error={form.errors.poCreatedDate}
            required
          />
          <Select
            label="Aircraft Type"
            placeholder="Pick Aircraft"
            data={["A350", "B737", "B777", "B787", "Q400", "B767", "B757"]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("aircraft")}
            required
          />
          <TextInput
            label="Tail No"
            placeholder="Tail No"
            {...form.getInputProps("tailNo")}
            required
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
            label="Vendor"
            placeholder="Vendor"
            {...form.getInputProps("vendor")}
            required
          />
          <DateInput
            label="Part Released Date"
            placeholder="Part Released Date"
            value={
              form.values.partReleasedDate &&
              new Date(form.values.partReleasedDate)
            }
            onChange={(e: any) =>
              form.setValues({
                partReleasedDate: e ? new Date(e.toString()) : null,
              })
            }
            error={form.errors.partReleasedDate}
            clearable
          />
          <DateInput
            label="Part Receive Date"
            placeholder="Part Receive Date"
            defaultValue={new Date()}
            value={
              form.values.returnProcessedDate
                ? new Date(form.values.returnProcessedDate)
                : null
            }
            onChange={(e: any) =>
              form.setValues({
                partReceiveDate: e ? new Date(e.toString()) : null,
              })
            }
            error={form.errors.partReceiveDate}
            clearable
          />
          <DateInput
            label="Return Due Date"
            placeholder="Return Due Date"
            value={
              form.values.returnDueDate && new Date(form.values.returnDueDate)
            }
            onChange={(e: any) =>
              form.setValues({
                returnDueDate: e ? new Date(e.toString()) : null,
              })
            }
            error={form.errors.returnDueDate}
            clearable
          />
          <DateInput
            label="Return Processed Date"
            placeholder="Return Processed Date"
            defaultValue={new Date()}
            value={
              form.values.returnProcessedDate
                ? new Date(form.values.returnProcessedDate)
                : null
            }
            onChange={(e: any) =>
              form.setValues({
                returnProcessedDate: e ? new Date(e.toString()) : null,
              })
            }
            error={form.errors.returnProcessedDate}
            clearable
          />
          <TextInput
            label="AWB"
            placeholder="AWB"
            {...form.getInputProps("awbNo")}
          />
          <TextInput
            label="Returned Part"
            placeholder="Returned Part"
            {...form.getInputProps("returnedPart")}
          />
          <DateInput
            label="POD Date"
            placeholder="POD Date"
            value={form.values.podDate && new Date(form.values.podDate)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ podDate: dateValue });
            }}
            error={form.errors.podDate}
            clearable
          />
          <Select
            label="Status"
            placeholder="Order Type"
            data={[
              "Part Received",
              "Part Installed",
              "Awaiting Core Unit",
              "Document Sent",
              "Under Shipping",
              "Delivered To Supplier",
              "Closed",
            ]}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("status")}
          />

          <TextInput
            label="Remark"
            placeholder="Remark"
            {...form.getInputProps("remark")}
          />
        </SimpleGrid>
        <Button
          type="submit"
          mt="sm"
          loading={addCFisLoading || updateCFisLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};
export default CoreForm;

export const CoreFilterForm = ({ form, handleSubmit, isLoading }: any) => {
  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Core Followups{" "}
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
                  label="PO"
                  placeholder="PO to search"
                  {...form.getInputProps("poNo")}
                />
                <DateInput
                  label="Created Date From"
                  placeholder="Created Date From"
                  value={
                    form.values.poCreatedDateFrom &&
                    new Date(form.values.poCreatedDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      poCreatedDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.poCreatedDateFrom}
                  clearable
                />
                <DateInput
                  label="Created Date To"
                  placeholder="Created Date To"
                  value={
                    form.values.poCreatedDateTo &&
                    new Date(form.values.poCreatedDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      poCreatedDateTo: e
                        ? new Date(e).toISOString()
                        : undefined,
                    })
                  }
                  error={form.errors.poCreatedDateTo}
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
                <TextInput
                  label="Part Number"
                  placeholder="Part Number to search"
                  {...form.getInputProps("partNumber")}
                />
                <TextInput
                  label="Stock No"
                  placeholder="Stock No to search"
                  {...form.getInputProps("stockNo")}
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
                  label="Returned Part"
                  placeholder="Returned Part to search"
                  {...form.getInputProps("returnedPart")}
                />
                <DateInput
                  label="POD Date From"
                  placeholder="POD Date From"
                  value={
                    form.values.PODDateFrom && new Date(form.values.PODDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      PODDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.PODDateFrom}
                  clearable
                />
                <DateInput
                  label="POD Date To"
                  placeholder="POD Date To"
                  value={
                    form.values.PODDateTo && new Date(form.values.PODDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      PODDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.PODDateTo}
                  clearable
                />
                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Created",
                    "In-work",
                    "Re-Assigned",
                    "Finished",
                    "Closed",
                    "Re-opened",
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
            <Button
              type="submit"
              mt="sm"
              loading={isLoading}
              disabled={!form.isValid()}
            >
              {" "}
              Filter
            </Button>
          </form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
