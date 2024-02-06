import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";

const InvoiceForm = ({ data, action, partData, orderType }: any) => {
  console.log({ data });
  const carOrderNo = data?.orderNo?.charAt(0);
  const transactionType =
    carOrderNo === "S" ? "Sales" : carOrderNo === "L" ? "Loan" : null;
  const salesOrderId = carOrderNo === "S" ? data?.id : null;
  const loanOrderId = carOrderNo === "L" ? data?.id : 0;

  const form = useForm({
    initialValues: {
      salesOrderId: salesOrderId,
      loanOrderId: loanOrderId,
      transactionType,
      remark: data?.remark,
      partLists: [],
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
      const addReturn = await createInvoice(form.values).unwrap();
      addReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Invoice Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              createError?.data.message || "Error occurs on Invoice Added",
            color: "red",
          });
    } else if (action === "update") {
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
              updateError?.data.message || "Error occurs on update Invoice",
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
            <Checkbox
              aria-label="Select row"
              checked={
                form.values.partLists.some((x) => x.id == el.id) ||
                el.isInvoiced
              }
              disabled={el.isInvoiced}
              onChange={(event) => {
                const exist = form.values.partLists.some((x) => x.id == el.id);
                if (exist) {
                  const i = form.values.partLists.indexOf(el);
                  form.removeListItem("partLists", i);
                } else {
                  form.insertListItem("partLists", el);
                }
              }}
            />
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

    createIsSuccess || (updateIsSuccess && modals.closeAll());

    return (
      <>
        <Table.Tr key={index + "2"}>
          <Table.Td>
            <Checkbox
              aria-label="Select row"
              checked={
                form.values.partLists.some((x) => x.id == el.id) ||
                el.isInvoiced
              }
              disabled={el.isInvoiced}
              onChange={(event) => {
                const exist = form.values.partLists.some((x) => x.id == el.id);
                if (exist) {
                  const i = form.values.partLists.indexOf(el);
                  form.removeListItem("partLists", i);
                } else {
                  form.insertListItem("partLists", el);
                }
              }}
            />
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
            updateError?.data.message || "Error occurs on update Invoice",
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
        <Button type="submit" mt="sm" loading={updateIsLoading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};