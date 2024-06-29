/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  rem,
  Text,
  Accordion,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useAddBuyerRemarkMutation,
  useAddFinanceRemarkMutation,
  useAddInvoiceListMutation,
  useCreateSOAVendorMutation,
  useGetAllUsersQuery,
  useImportInvoiceListMutation,
  useUpdateBuyerRemarkMutation,
  useUpdateFinanceRemarkMutation,
  useUpdateInvoiceListMutation,
  useUpdateSOAVendorMutation,
} from "@/pages/api/apiSlice";
import { Dropzone, MIME_TYPES, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import {
  IconFile,
  IconFilterSearch,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

export const VendorForm = ({ data, action }: any) => {
  const { data: users } = useGetAllUsersQuery("");
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      vendorName: data?.vendorName,
      vendorCode: data?.vendorCode,
      address: data?.address,
      vendorAccountManagerName: data?.vendorAccountManagerName,
      vendorAccountManagerEmail: data?.vendorAccountManagerEmail,
      vendorFinanceContactName: data?.vendorFinanceContactName,
      vendorFinanceContactEmail: data?.vendorFinanceContactEmail,
      creditLimit: data?.creditLimit,
      etFinanceContactName: data?.etFinanceContactName,
      etFinanceContactEmail: data?.etFinanceContactEmail,
      soaHandlerBuyerId: data?.soaHandlerBuyerId,
      soaHandlerBuyerName: data?.soaHandlerBuyerName,
      certificateExpiryDate: data?.certificateExpiryDate,
      assessmentDate: data?.assessmentDate,
      status: data?.status,
      remark: data?.remark,
    },
  });
  useEffect(() => {
    const user = users?.find(
      (x: any) => x.id === form.values.soaHandlerBuyerId
    );
    form.setFieldValue(
      "soaHandlerBuyerName",
      `${user?.firstName} ${user?.lastName}`
    );
  }, [form.values.soaHandlerBuyerId]);
  const [
    addVendor,
    { isLoading: addVisLoading, isSuccess: addVisSuccess, error: addError },
  ] = useCreateSOAVendorMutation();
  const [
    updateVendor,
    {
      isLoading: updateVisLoading,
      isSuccess: updateVisSuccess,
      error: updateError,
    },
  ] = useUpdateSOAVendorMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addVendor(form.values).unwrap();
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Vendor Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message: addReturn?.data?.message || "Error occurs on add Vendor",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateVendor(form.values).unwrap();
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: updateReturn?.message || "Vendor Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message ||
              updateReturn?.data.title ||
              "Error occurs on update Vendor",
            color: "red",
          });
    }
  };

  useEffect(() => {
    addVisSuccess || (updateVisSuccess && modals.closeAll());
  }, [addVisSuccess, updateVisSuccess]);

  const [buyerName, SetBuyerName] = useState();
  return (
    <>
      {(addVisLoading || updateVisLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Vendor Name"
            placeholder="Vendor Name"
            {...form.getInputProps("vendorName")}
            required
          />
          <TextInput
            label="Vendor Code"
            placeholder="Vendor Code"
            {...form.getInputProps("vendorCode")}
            required
          />
          <TextInput
            label="Address"
            placeholder="Address"
            {...form.getInputProps("address")}
            required
          />
          <TextInput
            label="Vendor Account Manager Name"
            placeholder="Vendor Account Manager Name"
            {...form.getInputProps("vendorAccountManagerName")}
          />
          <TextInput
            label="Vendor Account Manager Email"
            placeholder="Vendor Account Manager Email"
            {...form.getInputProps("vendorAccountManagerEmail")}
          />
          <TextInput
            label="Vendor Finance Contact Name"
            placeholder="Vendor Finance Contact Name"
            {...form.getInputProps("etFinanceContactName")}
          />
          <TextInput
            label="Vendor Finance Contact Email"
            placeholder="Vendor Finance Contact Email"
            {...form.getInputProps("vendorFinanceContactEmail")}
          />
          <NumberInput
            label="Credit Limit"
            placeholder="Credit Limit"
            {...form.getInputProps("creditLimit")}
            required
          />
          <TextInput
            label="ET Finance Contact Name"
            placeholder="ET Finance Contact Name"
            {...form.getInputProps("etFinanceContactName")}
          />
          <TextInput
            label="ET Finance Contact Email"
            placeholder="ET Finance Contact Email"
            {...form.getInputProps("etFinanceContactEmail")}
            required
          />
          <Select
            label="SOA Handler"
            placeholder="SOA Handler"
            data={users?.map((c: any) => ({
              value: `${c.id}`,
              label: `${c.firstName} ${c.lastName}`,
            }))}
            searchable
            nothingFoundMessage="Nothing found... Please introduce Part First"
            {...form.getInputProps("soaHandlerBuyerId")}
            required
          />
          <DateInput
            label="Certificate Expiry Date"
            placeholder="Certificate Expiry Date"
            defaultValue={new Date()}
            value={
              form.values.certificateExpiryDate
                ? new Date(form.values.certificateExpiryDate)
                : null
            }
            onChange={(e: any) =>
              form.setValues({
                certificateExpiryDate: e && new Date(e?.toString()),
              })
            }
            error={form.errors.certificateExpiryDate}
            required
            clearable
          />
          <DateInput
            label="Next Assessment Date"
            placeholder="Next Assessment Date"
            defaultValue={new Date()}
            value={
              form.values.assessmentDate
                ? new Date(form.values.assessmentDate)
                : null
            }
            onChange={(e: any) =>
              form.setValues({ assessmentDate: e && new Date(e?.toString()) })
            }
            error={form.errors.assessmentDate}
            required
            clearable
          />

          <TextInput
            label="Remark"
            placeholder="Remark"
            {...form.getInputProps("remark")}
          />
          <Select
            label="Status"
            placeholder="Order Type"
            data={["Created", "Active", "Closed"]}
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
          loading={addVisLoading || updateVisLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export const InvoiceListForm = ({ data, vendorId, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      vendorId: vendorId,
      invoiceNo: data?.invoiceNo,
      poNo: data?.poNo,
      invoiceDate: data?.invoiceDate,
      dueDate: data?.dueDate,
      amount: data?.amount,
      currency: data?.currency,
      underFollowup: data?.underFollowup,
      paymentProcessedDate: data?.paymentProcessedDate,
      popDate: data?.popDate,
      popReference: data?.popReference,
      chargeType: data?.chargeType,
      buyerName: data?.buyerName,
      tlName: data?.tlName,
      managerName: data?.managerName,
      status: data?.status,
    },
  });
  const [
    addInvoiceList,
    { isLoading: addILisLoading, isSuccess: addILisSuccess, error: addError },
  ] = useAddInvoiceListMutation();
  const [
    updateInvoiceList,
    {
      isLoading: updateILisLoading,
      isSuccess: updateILisSuccess,
      error: updateError,
    },
  ] = useUpdateInvoiceListMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addInvoiceList(form.values).unwrap();
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "InvoiceList Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message || "Error occurs on add InvoiceList",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateInvoiceList(form.values).unwrap();
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "InvoiceList Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message ||
              updateReturn?.data.title ||
              "Error occurs on update InvoiceList",
            color: "red",
          });
    }
  };

  useEffect(() => {
    addILisSuccess || (updateILisSuccess && modals.closeAll());
  }, [addILisSuccess, updateILisSuccess]);

  return (
    <>
      {(addILisLoading || updateILisLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Invoice No"
            placeholder="Invoice No"
            {...form.getInputProps("invoiceNo")}
            required
          />
          <TextInput
            label="PO No"
            placeholder="PO No"
            {...form.getInputProps("poNo")}
            required
          />
          <DateInput
            label="Invoice Date"
            placeholder="Invoice Date"
            defaultValue={new Date()}
            value={
              form.values.invoiceDate ? new Date(form.values.invoiceDate) : null
            }
            onChange={(e: any) =>
              form.setValues({
                invoiceDate: e && new Date(e?.toString()),
              })
            }
            error={form.errors.invoiceDate}
            clearable
            required
          />
          <DateInput
            label="Due Date"
            placeholder="Due Date"
            defaultValue={new Date()}
            value={form.values.dueDate ? new Date(form.values.dueDate) : null}
            onChange={(e: any) =>
              form.setValues({
                dueDate: e && new Date(e?.toString()),
              })
            }
            error={form.errors.dueDate}
            clearable
          />
          <NumberInput
            label="Amount"
            placeholder="Amount"
            {...form.getInputProps("amount")}
            required
          />
          <Select
            label="Currency"
            placeholder="Currency"
            data={["USD", "GBP", "EUR", "AED", "ETB", "CAD"]}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("currency")}
            required
          />
          <Select
            label="Under Followup"
            placeholder="Under Followup"
            data={["Buyer", "Finance", "Team Leader", "Manager"]}
            allowDeselect
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("underFollowup")}
            required
          />
          <DateInput
            label="Payment Processed Date"
            placeholder="Payment Processed Date"
            defaultValue={new Date()}
            value={
              form.values.paymentProcessedDate
                ? new Date(form.values.paymentProcessedDate)
                : null
            }
            onChange={(e: any) =>
              form.setValues({
                paymentProcessedDate: e && new Date(e?.toString()),
              })
            }
            error={form.errors.paymentProcessedDate}
            clearable
          />
          <DateInput
            label="POP Date"
            placeholder="POP Date"
            defaultValue={new Date()}
            value={form.values.popDate ? new Date(form.values.popDate) : null}
            onChange={(e: any) =>
              form.setValues({ popDate: e && new Date(e?.toString()) })
            }
            error={form.errors.popDate}
            clearable
          />
          <TextInput
            label="POP Reference"
            placeholder="POP Reference"
            {...form.getInputProps("popReference")}
          />
          <Select
            label="Charge Type"
            placeholder="Charge Type"
            data={[
              "Purchase",
              "Exchange Fee",
              "Core Repair Charge",
              "Late Fee",
            ]}
            allowDeselect
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("chargeType")}
            required
          />
          <TextInput
            label="Buyer Name"
            placeholder="Buyer Name"
            {...form.getInputProps("buyerName")}
            required
          />
          <TextInput
            label="TL Name"
            placeholder="TL Name"
            {...form.getInputProps("tlName")}
          />
          <TextInput
            label="Manager Name"
            placeholder="Manager Name"
            {...form.getInputProps("managerName")}
          />
          <Select
            label="Status"
            placeholder="Order Type"
            data={[
              "Created",
              "Under Process",
              "Paid",
              "Under Dispute",
              "Under Followup",
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
          loading={addILisLoading || updateILisLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export const ImportInvoiceListForm = ({ vendorId }: any) => {
  const form = useForm({
    initialValues: {
      vendorId: vendorId,
    },
  });
  const attached =
    (form as any).values.file && (form as any).values.file[0]?.name;

  const [importInvoiceList, { isLoading, isSuccess, status }] =
    useImportInvoiceListMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const data = await importInvoiceList(form.values).unwrap();

    if (data?.error.length > 0) {
      data?.error.forEach((el: any) => {
        notifications.show({
          title: "Failure",
          message: el,
          color: "red",
        });
      });
    }
    if (data?.success.length > 0) {
      data?.success.forEach((el: any) => {
        notifications.show({
          title: "Success",
          message: el,
          color: "green",
          autoClose: 500,
        });
      });
    }
    if (data?.summery.length > 0) {
      data?.summery.forEach((el: any) => {
        notifications.show({
          title: "Success",
          message: el,
          color: "Green",
        });
      });
      modals.closeAll();
    }
  };
  return (
    <>
      {isLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <Dropzone
          onDrop={(file) => form.setFieldValue("file", file)}
          onReject={(file) => console.log("rejected files", file)}
          maxSize={5 * 1024 ** 2}
          accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
          style={{ border: "dashed 1.5px gray", borderRadius: 10 }}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-blue-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-red-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <Box>
              <Text size="xl" inline>
                Drag file here or click to select files
              </Text>
              <Text size="sm" inline mt={5}>
                Only Excel file with .xlsx or .csv extension is allowed
              </Text>
              {attached && (
                <>
                  <Text size="lg" c="dimmed" inline mt={10}>
                    You Attach
                  </Text>
                  <Group mt={5}>
                    <IconFile />
                    <Text>{attached}</Text>
                  </Group>
                </>
              )}
            </Box>
          </Group>
        </Dropzone>
        <Button
          type="submit"
          mt="sm"
          loading={isLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export const BuyerRemarkForm = ({ invoiceId, message, action, id }: any) => {
  const form = useForm({
    initialValues: {
      id: id,
      invoiceId: invoiceId,
      message: message,
    },
  });
  const [
    addRemark,
    { isLoading: addLoading, isSuccess: addSuccess, error: addError },
  ] = useAddBuyerRemarkMutation();
  const [
    updateRemark,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateBuyerRemarkMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addRemark(form.values).unwrap();
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Buyer Remark Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message || "Error occurs on add Buyer Remark",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateRemark(form.values).unwrap();
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Buyer Remark Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message ||
              updateReturn?.data.title ||
              "Error occurs on update Buyer Remark",
            color: "red",
          });
    }
  };

  (addSuccess || updateSuccess) && modals.closeAll();
  return (
    <>
      {(addLoading || updateLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <TextInput
          label="Message"
          placeholder="Message"
          {...form.getInputProps("message")}
          required
        />
        <Button
          type="submit"
          mt="sm"
          loading={addLoading || updateLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export const FinanceRemarkForm = ({ invoiceId, message, action, id }: any) => {
  const form = useForm({
    initialValues: {
      id: id,
      invoiceId: invoiceId,
      message: message,
    },
  });
  const [
    addRemark,
    { isLoading: addLoading, isSuccess: addSuccess, error: addError },
  ] = useAddFinanceRemarkMutation();
  const [
    updateRemark,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateFinanceRemarkMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addRemark(form.values).unwrap();
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Buyer Remark Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message || "Error occurs on add Buyer Remark",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateRemark(form.values).unwrap();
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Buyer Remark Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message ||
              updateReturn?.data.title ||
              "Error occurs on update Buyer Remark",
            color: "red",
          });
    }
  };

  (addSuccess || updateSuccess) && modals.closeAll();
  return (
    <>
      {(addLoading || updateLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <TextInput
          label="Message"
          placeholder="Message"
          {...form.getInputProps("message")}
          required
        />
        <Button
          type="submit"
          mt="sm"
          loading={addLoading || updateLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export const InvoiceListFilterForm = ({
  form,
  handleSubmit,
  isLoading,
  vendorId,
}: any) => {
  useEffect(() => {
    form.setFieldValue("vendorId", vendorId);
  }, [vendorId]);

  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Invoice List{" "}
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={handleSubmit}>
            <Box>
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 5 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
              >
                <TextInput
                  label="Invoice No"
                  placeholder="Invoice No"
                  {...form.getInputProps("invoiceNo")}
                />
                <TextInput
                  label="PO No"
                  placeholder="PO No"
                  {...form.getInputProps("poNo")}
                />
                <DateInput
                  label="Invoice Date From"
                  placeholder="Invoice Date From"
                  defaultValue={new Date()}
                  value={
                    form.values.invoiceDateFrom
                      ? new Date(form.values.invoiceDateFrom)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      invoiceDateFrom: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.invoiceDate}
                  clearable
                />
                <DateInput
                  label="Invoice Date To"
                  placeholder="Invoice Date To"
                  defaultValue={new Date()}
                  value={
                    form.values.invoiceDateTo
                      ? new Date(form.values.invoiceDateTo)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      invoiceDateTo: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.invoiceDateTo}
                  clearable
                />
                <DateInput
                  label="Due Date From"
                  placeholder="Due Date From"
                  defaultValue={new Date()}
                  value={
                    form.values.dueDateFrom
                      ? new Date(form.values.dueDateFrom)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      dueDateFrom: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.dueDateFrom}
                  clearable
                />
                <DateInput
                  label="Due Date To"
                  placeholder="Due Date To"
                  defaultValue={new Date()}
                  value={
                    form.values.dueDateTo
                      ? new Date(form.values.dueDateTo)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      dueDateTo: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.dueDateTo}
                  clearable
                />
                <DateInput
                  label="POP Date From"
                  placeholder="POP Date From"
                  defaultValue={new Date()}
                  value={
                    form.values.popDateFrom
                      ? new Date(form.values.popDateFrom)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      popDateFrom: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.popDateFrom}
                  clearable
                />
                <DateInput
                  label="POP Date To"
                  placeholder="POP Date To"
                  defaultValue={new Date()}
                  value={
                    form.values.popDateTo
                      ? new Date(form.values.popDateTo)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      popDateTo: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.popDateTo}
                  clearable
                />
                <TextInput
                  label="POP Reference"
                  placeholder="POP Reference"
                  {...form.getInputProps("popReference")}
                />
                <Select
                  label="Under Followup"
                  placeholder="Under Followup"
                  data={["Buyer", "Finance", "Team Leader", "Manager"]}
                  allowDeselect
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("underFollowup")}
                />
                <Select
                  label="Charge Type"
                  placeholder="Charge Type"
                  data={[
                    "Purchase",
                    "Exchange Fee",
                    "Core Repair Charge",
                    "Late Fee",
                  ]}
                  allowDeselect
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("chargeType")}
                />
                <TextInput
                  label="Buyer Name"
                  placeholder="Buyer Name"
                  {...form.getInputProps("buyerName")}
                />
                <TextInput
                  label="TL Name"
                  placeholder="TL Name"
                  {...form.getInputProps("tlName")}
                />
                <TextInput
                  label="Manager Name"
                  placeholder="Manager Name"
                  {...form.getInputProps("managerName")}
                />
                <Select
                  label="Status"
                  placeholder="Order Type"
                  data={[
                    "Created",
                    "Under Process",
                    "Paid",
                    "Under Dispute",
                    "Under Followup",
                    "Closed",
                  ]}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("status")}
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

export const VendorFilterForm = ({ form, handleSubmit, isLoading }: any) => {
  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Invoice List{" "}
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={handleSubmit}>
            <Box>
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 5 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
              >
                <TextInput
                  label="Vendor Name"
                  placeholder="Vendor Name"
                  {...form.getInputProps("vendorName")}
                />
                <TextInput
                  label="Vendor Code"
                  placeholder="Vendor Code"
                  {...form.getInputProps("vendorCode")}
                />
                <TextInput
                  label="Vendor Account Manager Name"
                  placeholder="Vendor Account Manager Name"
                  {...form.getInputProps("vendorAccountManagerName")}
                />
                <TextInput
                  label="Vendor Finance Contact Name"
                  placeholder="Vendor Finance Contact Name"
                  {...form.getInputProps("vendorFinanceContactName")}
                />
                <TextInput
                  label="ET Finance Contact Name"
                  placeholder="ET Finance Contact Name"
                  {...form.getInputProps("etFinanceContactName")}
                />
                <TextInput
                  label="SOA Handler Buyer Name"
                  placeholder="SOA Handler Buyer Name"
                  {...form.getInputProps("soaHandlerBuyerName")}
                />
                <DateInput
                  label="Certificate Expiry Date From"
                  placeholder="Certificate Expiry Date From"
                  defaultValue={new Date()}
                  value={
                    form.values.certificateExpiryDateFrom
                      ? new Date(form.values.certificateExpiryDateFrom)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      certificateExpiryDateFrom: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.certificateExpiryDateFrom}
                  clearable
                />
                <DateInput
                  label="Certificate Expiry Date To"
                  placeholder="Certificate Expiry Date To"
                  defaultValue={new Date()}
                  value={
                    form.values.certificateExpiryDateTo
                      ? new Date(form.values.certificateExpiryDateTo)
                      : null
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      certificateExpiryDateTo: e && new Date(e?.toString()),
                    })
                  }
                  error={form.errors.certificateExpiryDateTo}
                  clearable
                />

                <Select
                  label="Status"
                  placeholder="Order Type"
                  data={["Created", "Active", "Closed"]}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("status")}
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
