import {
  useAddCoreFollowupMutation,
  useCreateCostSavingMutation,
  useUpdateCoreFollowupMutation,
  useUpdateCostSavingMutation,
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
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconFilterSearch, IconSelectAll } from "@tabler/icons-react";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
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

const CostSavingForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      oldPO: data?.oldPO,
      newPO: data?.newPO,
      issueDate: data?.issueDate,
      cnDate: data?.cnDate,
      oldPrice: data?.oldPrice,
      newPrice: data?.newPrice,
      quantity: data?.quantity || 1,
      savingInUSD: data?.savingInUSD,
      savingInETB: data?.savingInETB,
      isPurchaseOrder: data?.isPurchaseOrder || false,
      isRepairOrder: data?.isRepairOrder || false,
      savedBy: data?.savedBy,
      remark: data?.remark,
      status: data?.status,
    },
    validate: {
      // rid: (v) => (v?.length < 4 ? 'RID must be provided and should be 4 character minimum' : null),
      // requestDate: (v) => (v === null ? 'Request Date is mandatory' : null)
    },
  });
  const [
    addCostSaving,
    { isLoading: addCSisLoading, isSuccess: addCSisSuccess, error: addError },
  ] = useCreateCostSavingMutation();
  const [
    updateCostSaving,
    {
      isLoading: updateCSisLoading,
      isSuccess: updateCSisSuccess,
      error: updateError,
    },
  ] = useUpdateCostSavingMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addCostSaving(form.values).unwrap();
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "CostSaving Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message || "Error occurs on add CostSaving",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateCostSaving(form.values).unwrap();
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: updateReturn?.message || "CostSaving Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message ||
              updateReturn?.data.title ||
              "Error occurs on update CostSaving",
            color: "red",
          });
    }
  };

  useEffect(() => {
    addCSisSuccess || (updateCSisSuccess && modals.closeAll());
  }, [addCSisSuccess, updateCSisSuccess]);

  return (
    <>
      {(addCSisLoading || updateCSisLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Old PO"
            placeholder="Old PO"
            {...form.getInputProps("oldPO")}
          />
          <TextInput
            label="New PO"
            placeholder="New PO"
            {...form.getInputProps("newPO")}
            required
          />
          <DateInput
            label="Issue Date"
            placeholder="Issue Date"
            defaultValue={new Date()}
            value={
              form.values.issueDate ? new Date(form.values.issueDate) : null
            }
            onChange={(e: any) =>
              form.setValues({ issueDate: e && new Date(e?.toString()) })
            }
            error={form.errors.issueDate}
            required={form.values.isPurchaseOrder}
            clearable
          />
          <DateInput
            label="CN Date"
            placeholder="CN Date"
            defaultValue={new Date()}
            value={form.values.cnDate ? new Date(form.values.cnDate) : null}
            onChange={(e: any) =>
              form.setValues({ cnDate: e && new Date(e?.toString()) })
            }
            error={form.errors.cnDate}
            required={form.values.isRepairOrder}
            clearable
          />
          <NumberInput
            label="Old Price"
            placeholder="Old Price"
            {...form.getInputProps("oldPrice")}
            required
          />
          <NumberInput
            label="New Price"
            placeholder="New Price"
            {...form.getInputProps("newPrice")}
            required
          />
          <NumberInput
            label="Quantity"
            placeholder="Quantity"
            min={1}
            {...form.getInputProps("quantity")}
            required
          />
          <NumberInput
            label="Saving In USD"
            placeholder="Saving In USD"
            value={
              (form.values.oldPrice - form.values.newPrice) *
              form.values.quantity
            }
            disabled
            // {...form.getInputProps("savingInUSD")}
          />
          <NumberInput
            label="Saving In ETB"
            placeholder="Saving In ETB"
            {...form.getInputProps("savingInETB")}
          />
          <Group>
            <Checkbox
              label="Is Purchase Order"
              variant="filled"
              {...form.getInputProps("isPurchaseOrder")}
              checked={form.values.isPurchaseOrder}
              disabled={form.values.isRepairOrder}
            />
            <Checkbox
              label="Is Repair Order"
              variant="filled"
              {...form.getInputProps("isRepairOrder")}
              checked={form.values.isRepairOrder}
              disabled={form.values.isPurchaseOrder}
            />
          </Group>
          <TextInput
            label="Remark"
            placeholder="Remark"
            {...form.getInputProps("remark")}
          />
          <Select
            label="Status"
            placeholder="Order Type"
            data={[
              "Created",
              "Saved",
              "Reported",
              "Accepted",
              "Rejected",
              "Wrong",
              "Closed",
            ]}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("status")}
            required
          />
        </SimpleGrid>
        <Button
          type="submit"
          mt="sm"
          loading={addCSisLoading || updateCSisLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};
export default CostSavingForm;

export const CostSavingFilterForm = ({
  form,
  handleSubmit,
  isLoading,
}: any) => {
  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Cost Saving
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
                  label="Old PO"
                  placeholder="Old PO to search"
                  {...form.getInputProps("oldPO")}
                />
                <TextInput
                  label="NewPO"
                  placeholder="New PO to search"
                  {...form.getInputProps("newPO")}
                />
                <DateInput
                  label="Issue Date From"
                  placeholder="Issue Date From"
                  value={
                    form.values.issueDateFrom &&
                    new Date(form.values.issueDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      issueDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.issueDateFrom}
                  clearable
                />
                <DateInput
                  label="Issue Date To"
                  placeholder="Issue Date To"
                  value={
                    form.values.issueDateTo && new Date(form.values.issueDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      issueDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.issueDateTo}
                  clearable
                />
                <DateInput
                  label="CN Date From"
                  placeholder="CN Date From"
                  value={
                    form.values.CNDateFrom && new Date(form.values.CNDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      CNDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.CNDateFrom}
                  clearable
                />
                <DateInput
                  label="CN Date To"
                  placeholder="CN Date To"
                  value={form.values.CNDateTo && new Date(form.values.CNDateTo)}
                  onChange={(e: any) =>
                    form.setValues({
                      CNDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.CNDateTo}
                  clearable
                />
                <Group>
                  <Checkbox
                    label="Is Purchase Order"
                    variant="filled"
                    {...form.getInputProps("isPurchaseOrder")}
                    checked={form.values.isPurchaseOrder}
                    disabled={form.values.isRepairOrder}
                  />
                  <Checkbox
                    label="Is Repair Order"
                    variant="filled"
                    {...form.getInputProps("isRepairOrder")}
                    checked={form.values.isRepairOrder}
                    disabled={form.values.isPurchaseOrder}
                  />
                </Group>
                <TextInput
                  label="SavedBy"
                  placeholder="SavedBy to search"
                  {...form.getInputProps("savedBy")}
                />
                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Created",
                    "Saved",
                    "Reported",
                    "Accepted",
                    "Rejected",
                    "Wrong",
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
