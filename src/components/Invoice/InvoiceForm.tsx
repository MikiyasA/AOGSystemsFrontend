import {
  useCreateInvoiceMutation,
  useGetAllCompaniesQuery,
  useUpdateInvoiceMutation,
} from "@/pages/api/apiSlice";
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconFilterSearch } from "@tabler/icons-react";

const InvoiceForm = ({ data, action, partData, orderType }: any) => {
  const charOrderNo = data?.orderNo?.charAt(0);
  const transactionType =
    charOrderNo === "S" ? "Sales" : charOrderNo === "L" ? "Loan" : null;
  const salesOrderId = charOrderNo === "S" ? data?.id : null;
  const loanOrderId = charOrderNo === "L" ? data?.id : null;

  const form = useForm({
    initialValues: {
      salesOrderId: salesOrderId,
      loanOrderId: loanOrderId,
      transactionType,
      remark: data?.remark,
      partLists: [] as { id?: any }[],
    },
    validate: {
      partLists: (x) =>
        x.length < 0 ? "At least one part should be selected" : null,
    },
  });

  const [
    createInvoice,
    {
      isLoading: createIsLoading,
      isSuccess: createIsSuccess,
      error: createError,
    },
  ] = useCreateInvoiceMutation();
  const [
    updateInvoice,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateInvoiceMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await createInvoice(form.values);
      addReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Invoice Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.error?.data?.message ||
              addReturn?.data.message ||
              "Error occurs on Invoice Added",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn: any = await updateInvoice(form.values).unwrap();
      updateReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message: updateReturn?.message || "Invoice Update Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message || "Error occurs on update Invoice",
            color: "red",
          });
    }
  };

  const header = [
    "Check",
    "Part",
    "Unit Price",
    "Currency",
    "Quantity",
    "UOM",
    "Total Price",
    "RID",
    "SN Shipped",
  ];
  const salesPartListsTBInvoiced = data?.salesPartLists?.filter(
    (x: any) => x.isDeleted === false
  );

  const salesRows = salesPartListsTBInvoiced?.map((el: any, index: any) => {
    const part = partData?.filter((p: any) => p.id === el.partId);

    return (
      <>
        <Table.Tr key={index + "2"}>
          <Table.Td>
            <Tooltip
              label={
                !el.rid && !el.shipDate
                  ? "RID & SN must be filled"
                  : el.isInvoiced
                  ? "Already invoiced"
                  : "Ok to invoice"
              }
            >
              <Checkbox
                aria-label="Select row"
                checked={
                  form.values.partLists.some((x) => x.id == el.id) ||
                  el.isInvoiced
                }
                disabled={el.isInvoiced || (!el.rid && !el.shipDate)}
                onChange={(event) => {
                  const exist = form.values.partLists.some(
                    (x) => x.id == el.id
                  );
                  if (exist) {
                    const i = form.values.partLists.indexOf(el);
                    form.removeListItem("partLists", i);
                  } else {
                    form.insertListItem("partLists", el);
                  }
                }}
              />
            </Tooltip>
          </Table.Td>
          <Table.Td>
            {part && part[0]?.partNumber} ({part && part[0]?.description})
          </Table.Td>
          <Table.Td>{el.unitPrice}</Table.Td>
          <Table.Td>{el.currency}</Table.Td>
          <Table.Td>{el.quantity}</Table.Td>
          <Table.Td>{el.uom}</Table.Td>
          <Table.Td>{el.totalPrice}</Table.Td>
          <Table.Td>{el.rid}</Table.Td>
          <Table.Td>{el.serialNo}</Table.Td>
        </Table.Tr>
      </>
    );
  });

  const loanPartListsTBInvoiced = data?.loanPartLists?.filter(
    (x: any) => x.isDeleted === false
  );

  const loanRows = loanPartListsTBInvoiced?.map((el: any, index: any) => {
    const part = partData?.filter((p: any) => p.id === el.partId);

    (createIsSuccess || updateIsSuccess) && modals.closeAll();

    return (
      <>
        <Table.Tr key={index + "2"}>
          <Table.Td>
            <Tooltip
              label={
                !el.rid && !el.shipDate
                  ? "RID & SN must be filled"
                  : el.isInvoiced
                  ? "Already invoiced"
                  : "Ok to invoice"
              }
            >
              <Checkbox
                aria-label="Select row"
                checked={
                  form.values.partLists.some((x) => x.id == el.id) ||
                  el.isInvoiced
                }
                disabled={el.isInvoiced || (!el.rid && !el.shipDate)}
                onChange={(event) => {
                  const exist = form.values.partLists.some(
                    (x) => x.id == el.id
                  );
                  if (exist) {
                    const i = form.values.partLists.indexOf(el);
                    form.removeListItem("partLists", i);
                  } else {
                    form.insertListItem("partLists", el);
                  }
                }}
              />
            </Tooltip>
          </Table.Td>
          <Table.Td>
            {part && part[0]?.partNumber} ({part && part[0]?.description})
          </Table.Td>
          <Table.Td>{el.unitPrice}</Table.Td>
          <Table.Td>{el.currency}</Table.Td>
          <Table.Td>{el.quantity}</Table.Td>
          <Table.Td>{el.uom}</Table.Td>
          <Table.Td>{el.totalPrice}</Table.Td>
          <Table.Td>{el.rid}</Table.Td>
          <Table.Td>{el.serialNo}</Table.Td>
        </Table.Tr>
      </>
    );
  });

  return (
    <Box w={"100%"} px={50}>
      {createIsLoading || (updateIsLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Remark"
            placeholder="Remark"
            {...form.getInputProps("remark")}
          />
        </SimpleGrid>
        <Box>
          <Table>
            <Table.Thead>
              <Table.Tr>
                {header.map((th: any, i: any) => {
                  return <Table.Th key={i}>{th}</Table.Th>;
                })}
              </Table.Tr>
            </Table.Thead>
            {orderType === "loan" ? (
              <Table.Tbody>{loanRows}</Table.Tbody>
            ) : orderType === "sales" ? (
              <Table.Tbody>{salesRows}</Table.Tbody>
            ) : (
              <Table.Tbody></Table.Tbody>
            )}
          </Table>
        </Box>
        <Button
          type="submit"
          mt="sm"
          loading={createIsLoading || updateIsLoading}
          disabled={!form.isValid()}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default InvoiceForm;

export const UpdateInvoiceForm = ({ data }: any) => {
  const form = useForm({
    initialValues: {
      id: data.id,
      invoiceNo: data.invoiceNo,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      salesOrderId: data.salesOrderId,
      loanOrderId: data.loanOrderId,
      transactionType: data.transactionType,
      isApproved: data.isApproved,
      popReference: data.popReference,
      popDate: data.popDate,
      status: data.status,
      remark: data.remark,
    },
  });
  const [
    updateInvoice,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateInvoiceMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const updateReturn = await updateInvoice(form.values).unwrap();
    updateReturn.isSuccess
      ? notifications.show({
          title: "Success",
          message: updateReturn?.message || "Invoice Update Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            updateReturn?.data.message || "Error occurs on update Invoice",
          color: "red",
        });
  };

  updateIsSuccess && modals.closeAll();

  return (
    <Box w={"100%"} px={50}>
      {updateIsLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <DateInput
            label="Due Date"
            placeholder="Invoice Due Date"
            value={form.values.dueDate && new Date(form.values.dueDate)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ dueDate: dateValue });
            }}
            error={form.errors.dueDate}
          />
          <TextInput
            label="POP Reference"
            placeholder="POP Reference"
            {...form.getInputProps("popReference")}
            required={form.values.popDate}
          />
          <DateInput
            label="POP Date"
            placeholder="Invoice POP Date"
            value={form.values.popDate && new Date(form.values.popDate)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ popDate: dateValue });
            }}
            error={form.errors.popDate}
            clearable
            required={form.values.popReference}
          />
          <Select
            label="Status"
            placeholder="Status"
            data={[
              "Created",
              "Sent To Finance",
              "Invoice Raised",
              "Sent To Customer",
              "To Be Collected By ICH",
              "Payment Settled",
              "POP Requested",
              "Closed",
            ]}
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
          loading={updateIsLoading}
          disabled={!form.isValid()}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export const InvoiceFilterForm = ({ form, handleSubmit, isLoading }: any) => {
  const { data: company } = useGetAllCompaniesQuery("");
  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Sales Orders{" "}
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
                  label="Invoice Number"
                  placeholder="Invoice Number "
                  {...form.getInputProps("invoiceNo")}
                />

                <DateInput
                  label="Invoice Date From"
                  placeholder="Invoice Date From"
                  value={
                    form.values.invoiceDateFrom &&
                    new Date(form.values.invoiceDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      invoiceDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.invoiceDateFrom}
                  clearable
                />
                <DateInput
                  label="Invoice Date To"
                  placeholder="Invoice Date To"
                  value={
                    form.values.invoiceDateTo &&
                    new Date(form.values.invoiceDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      invoiceDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.invoiceDateTo}
                  clearable
                />
                <DateInput
                  label="Due Date From"
                  placeholder="Due Date From"
                  value={
                    form.values.dueDateFrom && new Date(form.values.dueDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      dueDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.dueDateFrom}
                  clearable
                />
                <DateInput
                  label="Due Date To"
                  placeholder="Due Date To"
                  value={
                    form.values.dueDateTo && new Date(form.values.dueDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      dueDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.dueDateTo}
                  clearable
                />
                <TextInput
                  label="Transaction Type"
                  placeholder="Transaction Type "
                  {...form.getInputProps("transactionType")}
                />
                <TextInput
                  label="POP Reference"
                  placeholder="POP Reference "
                  {...form.getInputProps("popReference")}
                />
                <DateInput
                  label="POP Date From"
                  placeholder="POP Date From"
                  value={
                    form.values.popDateFrom && new Date(form.values.popDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      popDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.popDateFrom}
                  clearable
                />
                <DateInput
                  label="POP Date To"
                  placeholder="POP Date To"
                  value={
                    form.values.popDateTo && new Date(form.values.popDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      popDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.popDateTo}
                  clearable
                />
                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Created",
                    "Sent To Finance",
                    "Invoice Raised",
                    "Sent To Customer",
                    "To Be Collected By ICH",
                    "Payment Settled",
                    "POP Requested",
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
