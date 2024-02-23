import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Tooltip,
} from "@mantine/core";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useAddLoanPartListMutation,
  useAddOfferMutation,
  useAddPartListMutation,
  useCreateLoanMutation,
  useCreateSalesOrderMutation,
  useGetAllCompaniesQuery,
  useGetAllPartQuery,
  useShipSalesMutation,
  useUpdateLoanMutation,
  useUpdateLoanPartListMutation,
  useUpdateOfferMutation,
  useUpdatePartListMutation,
  useUpdateSalesOrderMutation,
} from "@/pages/api/apiSlice";
import { modals } from "@mantine/modals";
import {
  IconCirclePlus,
  IconEditCircle,
  IconFilterSearch,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { hasValue } from "@/config/util";
import CompanyForm from "../Company/CompanyForm";
import PartForm from "../Part/PartForm";

const LoanForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      companyId: data?.companyId,
      orderNo: data?.orderNo,
      customerOrderNo: data?.customerOrderNo,
      orderedByName: data?.orderedByName,
      orderedByEmail: data?.orderedByEmail,
      shipToAddress: data?.shipToAddress,
      status: data?.status,
      note: data?.note,
      partId: data?.partId,
      quantity: data?.quantity || 1,
      uom: data?.uom || "EA",
      currency: data?.currency || "USD",
      description: [],
      basePrice: data?.basePrice,
      unitPrice: data?.unitPrice,
    },
    validate: {
      companyId: (v) => (v?.length < 1 ? "Company must be selected" : null),
    },
  });
  console.log({ form });
  const [
    createLoan,
    { isLoading: addIsLoading, isSuccess: addIsSuccess, error: addError },
  ] = useCreateLoanMutation();
  const [
    updateLoan,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateLoanMutation();

  const {
    data: companyData,
    isLoading: isLoadingCompany,
    isSuccess: isSuccessCompany,
  } = useGetAllCompaniesQuery("");

  const {
    data: partData,
    isLoading: isLoadingPart,
    isSuccess: isSuccessPart,
  } = useGetAllPartQuery("");

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const createReturn = await createLoan(form.values).unwrap();
      if (createReturn.isSuccess) {
        notifications.show({
          title: "Success",
          message:
            createReturn?.message || "Sales Order Created Successfully 👍",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Failure",
          message:
            createReturn?.message ||
            addError?.message ||
            "Error occurs on add Part",
          color: "red",
        });
      }
    } else if (action === "update") {
      const updateReturn = await updateLoan(form.values).unwrap();
      if (updateReturn.isSuccess) {
        notifications.show({
          title: "Success",
          message:
            updateReturn?.message || "Sales Order Updated Successfully 👍",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Failure",
          message:
            updateReturn?.message ||
            addError?.message ||
            "Error occurs on add Part",
          color: "red",
        });
      }
    }
  };

  addIsSuccess && modals.closeAll();
  updateIsSuccess && modals.closeAll();

  return (
    <Box w={"100%"}>
      {addIsLoading || (updateIsLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Group>
            <Select
              label="Company"
              placeholder="Select Company"
              data={companyData?.map((c: any) => ({
                value: `${c.id}`,
                label: `${c.name}`,
              }))}
              searchable
              nothingFoundMessage="Nothing found... Please introduce Company First"
              {...form.getInputProps("companyId")}
              required
            />
            <Tooltip label="Add Company">
              <IconCirclePlus
                color="green"
                cursor={"pointer"}
                onClick={() => {
                  modals.open({
                    title: "Add Company",
                    size: "80%",
                    children: <CompanyForm action="add" />,
                  });
                }}
              />
            </Tooltip>
          </Group>
          <TextInput
            label="Customer Order No"
            placeholder="Customer Order Number"
            {...form.getInputProps("customerOrderNo")}
          />
          <TextInput
            label="Order By Name"
            placeholder="Order By Name"
            {...form.getInputProps("orderedByName")}
            required
          />
          <TextInput
            label="Order By Email"
            placeholder="Order By Email Address"
            {...form.getInputProps("orderedByEmail")}
            required
          />
          <TextInput
            label="Ship to Address"
            placeholder="Ship to Address"
            {...form.getInputProps("shipToAddress")}
          />

          {action == "add" && (
            <>
              <Group>
                <Select
                  label="Part"
                  placeholder="Select Part"
                  data={partData?.map((c: any) => ({
                    value: `${c.id}`,
                    label: `${c.partNumber}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found... Please introduce Part First"
                  {...form.getInputProps("partId")}
                  required
                />
                <Tooltip label="Add Part">
                  <IconCirclePlus
                    color="green"
                    cursor={"pointer"}
                    onClick={() => {
                      modals.open({
                        title: "Add Part",
                        size: "80%",
                        children: <PartForm action="add" redirect={false} />,
                      });
                    }}
                  />
                </Tooltip>
              </Group>
              <Group justify="space-between">
                <NumberInput
                  styles={{
                    wrapper: {
                      width: "80px",
                    },
                  }}
                  label="Quantity"
                  placeholder="Quantity"
                  defaultValue={1}
                  min={1}
                  {...form.getInputProps("quantity")}
                />
                <Select
                  styles={{
                    wrapper: {
                      width: "100px",
                    },
                  }}
                  label="Unit of Measurement"
                  placeholder="Select Unit of Measurement"
                  data={["EA", "LB", "CN", "ST", "KG", "M", "KM"]}
                  searchable
                  withAsterisk
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("uom")}
                  required
                />
              </Group>
              <Select
                label="Currency"
                placeholder="Select Currency"
                data={["USD", "BIR", "EUR", "GBP", "CNY", "INR", "AUD", "CAD"]}
                withAsterisk
                {...form.getInputProps("currency")}
              />
              <MultiSelect
                label="Offer Description"
                placeholder="Select Offer Description"
                data={[
                  "Availability charge (One time)",
                  "Loan charge (from 1st - 10th Day)",
                  "Loan charge (from 11th - 30th Day)",
                  "Loan charge (from 31st - 45th Day)",
                  "Administrative charge (One time)",
                ]}
                clearable
                hidePickedOptions
                searchable
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps("description")}
              />
              <NumberInput
                label="Base Price"
                placeholder="Base Price"
                min={1}
                {...form.getInputProps("basePrice")}
              />
              <NumberInput
                label="Unit Price"
                placeholder="Unit Price"
                min={1}
                {...form.getInputProps("unitPrice")}
              />
            </>
          )}
          <TextInput
            label="Ship to Address"
            placeholder="Ship to Address"
            {...form.getInputProps("shipToAddress")}
          />
          <Select
            label="Status"
            placeholder="Status"
            data={[
              "Created",
              "Part Requested",
              "Part Issued",
              "Part Sent",
              "Received by Customer",
              "Payment Requested",
              "Invoice Sent To Customer",
              "Payment Received",
              "Closed",
            ]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("status")}
          />
          <TextInput
            label="Note"
            placeholder="Note"
            {...form.getInputProps("note")}
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={addIsLoading || updateIsLoading}>
          {" "}
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default LoanForm;

export const AddLineItemForm = ({ data, loanId }: any) => {
  const partListForm = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      loanId: loanId,
      partId: data?.partId,
      quantity: data?.quantity || 1,
      uom: data?.uom || "EA",
      description: data?.description,
      basePrice: data?.basePrice,
      unitPrice: data?.unitPrice,
      currency: data?.currency || "USD",
    },
    validate: {
      quantity: (x: any) => (x < 1 ? "Quantity must be grater than one" : null),
    },
  });
  console.log({ loanId });
  const {
    data: partData,
    isLoading: isLoadingPart,
    isSuccess: isSuccessPart,
  } = useGetAllPartQuery("");

  const [addPartList, { isLoading: addIsLoading, isSuccess: addIsSuccess }] =
    useAddLoanPartListMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const addReturn = await addPartList(partListForm.values).unwrap();
    addReturn.isSuccess
      ? notifications.show({
          title: "Success",
          message: addReturn?.message || "Part List Added Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message: addError?.data.message || "Error occurs on Part List Added",
          color: "red",
        });
  };

  return (
    <Box w={"100%"} px={50}>
      {addIsLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Select
            label="Part"
            placeholder="Select Part"
            data={partData?.map((c: any) => ({
              value: `${c.id}`,
              label: `${c.partNumber}`,
            }))}
            searchable
            nothingFoundMessage="Nothing found... Please introduce Part First"
            {...partListForm.getInputProps("partId")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Base Price"
            placeholder="Base Price"
            min={1}
            {...partListForm.getInputProps("basePrice")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Unit Price"
            placeholder="Unit Price"
            min={1}
            {...partListForm.getInputProps("unitPrice")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Quantity"
            placeholder="Quantity"
            defaultValue={1}
            {...partListForm.getInputProps("quantity")}
            required
            disabled={data?.isInvoiced}
          />
          <Select
            label="Unit of Measurement"
            placeholder="Select Unit of Measurement"
            data={["EA", "LB", "CN", "ST", "KG", "M", "KM"]}
            searchable
            withAsterisk
            nothingFoundMessage="Nothing found..."
            {...partListForm.getInputProps("uom")}
            required
            disabled={data?.isInvoiced}
          />

          <TextInput
            label="Total Price"
            placeholder="Total Price"
            value={
              partListForm.getInputProps("unitPrice").value *
              partListForm.getInputProps("quantity").value
            }
            disabled
          />
          <Select
            label="Currency"
            placeholder="Select Currency"
            data={["USD", "BIR", "EUR", "GBP", "CNY", "INR", "AUD", "CAD"]}
            withAsterisk
            {...partListForm.getInputProps("currency")}
          />
          <MultiSelect
            label="Offer Description"
            placeholder="Select Offer Description"
            data={[
              "Availability charge (One time)",
              "Loan charge (from 1st - 10th Day)",
              "Loan charge (from 11th - 30th Day)",
              "Loan charge (from 31st - 45th Day)",
              "Administrative charge (One time)",
            ]}
            clearable
            hidePickedOptions
            searchable
            nothingFoundMessage="Nothing found..."
            {...partListForm.getInputProps("description")}
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={addIsLoading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export const EditPartLine = ({ data, invoiced }: any) => {
  const partListForm = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      partId: data?.partId,
      quantity: data?.quantity || 1,
      uom: data?.uom || "EA",
      serialNo: data?.serialNo,
      rid: data?.rid,
      shipDate: data?.shipDate,
      shippingReference: data?.shippingReference,
      receivedDate: data?.receivedDate,
      receivingReference: data?.receivingReference,
      receivingDefect: data?.receivingDefect,
    },
    validate: {
      quantity: (x: any) => (x < 1 ? "Quantity must be grater than one" : null),
      receivingDefect: (x: any) =>
        x?.length < 30 && x !== null
          ? "Defect Description must be greater than 30 character"
          : null,
    },
  });
  const {
    data: partData,
    isLoading: isLoadingPart,
    isSuccess: isSuccessPart,
  } = useGetAllPartQuery("");

  const [
    updatePartList,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateLoanPartListMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const updateReturn = await updatePartList(partListForm.values).unwrap();
    updateReturn.isSuccess
      ? notifications.show({
          title: "Success",
          message: updateReturn?.message || "Part List Updated Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            updateReturn?.message ||
            updateError?.data.message ||
            "Error occurs on Part List Updated",
          color: "red",
        });
  };

  return (
    <Box w={"100%"} px={50}>
      {updateIsSuccess && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Select
            label="Part"
            placeholder="Select Part"
            data={partData?.map((c: any) => ({
              value: `${c.id}`,
              label: `${c.partNumber}`,
            }))}
            searchable
            nothingFoundMessage="Nothing found... Please introduce Part First"
            {...partListForm.getInputProps("partId")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Quantity"
            placeholder="Quantity"
            defaultValue={1}
            min={1}
            {...partListForm.getInputProps("quantity")}
            required
            disabled={data?.isInvoiced}
          />
          <Select
            label="Unit of Measurement"
            placeholder="Select Unit of Measurement"
            data={["EA", "LB", "CN", "ST", "KG", "M", "KM"]}
            searchable
            withAsterisk
            nothingFoundMessage="Nothing found..."
            {...partListForm.getInputProps("uom")}
            required
            disabled={data?.isInvoiced}
          />
          <TextInput
            label="Serial No"
            placeholder="Serial No"
            {...partListForm.getInputProps("serialNo")}
          />
          <TextInput
            label="RID"
            placeholder="RID"
            {...partListForm.getInputProps("rid")}
          />
          <DateInput
            label="Ship Date"
            placeholder="Part Ship Date"
            value={
              partListForm.values.shipDate &&
              new Date(partListForm.values.shipDate)
            }
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              partListForm.setValues({ shipDate: dateValue });
            }}
            error={partListForm.errors.shipDate}
            maxDate={new Date()}
            clearable
            required={hasValue(partListForm.values.shippingReference)}
          />
          <TextInput
            label="Shipping Reference"
            placeholder="Shipping Reference"
            {...partListForm.getInputProps("shippingReference")}
            required={hasValue(partListForm.values.shipDate)}
          />
          <DateInput
            label="Receive Date"
            placeholder="Part Receive Date"
            value={
              partListForm.values.receivedDate &&
              new Date(partListForm.values.receivedDate)
            }
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              partListForm.setValues({ receivedDate: dateValue });
            }}
            error={partListForm.errors.receivedDate}
            maxDate={new Date()}
            clearable
            required={hasValue(partListForm.values.receivingReference)}
          />
          <TextInput
            label="Receiving Reference"
            placeholder="Receiving Reference"
            {...partListForm.getInputProps("receivingReference")}
            required={hasValue(partListForm.values.receivedDate)}
          />
          <TextInput
            label="Receiving Defect"
            placeholder="Blank if there is no defect"
            {...partListForm.getInputProps("receivingDefect")}
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={updateIsLoading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export const OfferForm = ({ data, action, loanPartListId }: any) => {
  console.log({ data });
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      loanPartListId: loanPartListId,
      description: data?.description,
      basePrice: data?.basePrice,
      quantity: data?.quantity || 1,
      unitPrice: data?.unitPrice,
      totalPrice: data?.totalPrice,
      currency: data?.currency || "USD",
    },
    validate: {
      quantity: (x: any) => (x < 1 ? "Quantity must be grater than one" : null),
      basePrice: (x: any) =>
        x < 1 ? "Base Price must be grater than one" : null,
      unitPrice: (x: any) =>
        x < 1 ? "Unit Price must be grater than one" : null,
    },
  });
  const [
    addOffer,
    { isLoading: addIsLoading, isSuccess: addIsSuccess, error: addError },
  ] = useAddOfferMutation();
  const [
    updateOffer,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateOfferMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addOffer(form.values).unwrap();
      addReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Part List addd Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.message ||
              addError?.data.message ||
              "Error occurs on Part List Updated",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updateOffer(form.values).unwrap();
      updateReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Part List Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.message ||
              updateError?.data.message ||
              "Error occurs on Part List Updated",
            color: "red",
          });
    }
  };

  return (
    <Box w={"100%"} px={50}>
      {updateIsSuccess && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
          />
          <NumberInput
            label="Base Price"
            placeholder="Base Price"
            defaultValue={1}
            {...form.getInputProps("basePrice")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Quantity"
            placeholder="Quantity"
            defaultValue={1}
            min={1}
            {...form.getInputProps("quantity")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Unit Price"
            placeholder="Unit Price"
            defaultValue={1}
            {...form.getInputProps("unitPrice")}
            required
            disabled={data?.isInvoiced}
          />
          <TextInput
            label="Total Price"
            placeholder="Total Price"
            value={
              form.getInputProps("unitPrice").value *
              form.getInputProps("quantity").value
            }
            disabled
          />
          <Select
            label="Currency"
            placeholder="Select Currency"
            data={["USD", "BIR", "EUR", "GBP", "CNY", "INR", "AUD", "CAD"]}
            withAsterisk
            {...form.getInputProps("currency")}
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={addIsLoading || updateIsLoading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export const ShipSalesForm = ({ data, salesId, action }: any) => {
  const form = useForm({
    initialValues: {
      salesId: data?.id,
      isFullyShipped: data?.isFullyShipped,
      awbNo: data?.awbNo,
      shipDate: data?.shipDate,
      receivedByCustomer: data?.receivedByCustomer,
      receivedDate: data?.receivedDate,
    },
  });

  const [
    shipSales,
    { isLoading: shipSalesLoading, isSuccess: shipSalesSuccess, error },
  ] = useShipSalesMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const shipReturn = await shipSales(form.values).unwrap();
    shipReturn.isSuccess
      ? notifications.show({
          title: "Success",
          message:
            shipReturn?.message || " Sale Ordered Part Successfully Shipped 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            error?.data.message || "Error occurs on Sale Ordered Part Shipped",
          color: "red",
        });
  };

  return (
    <Box w={"100%"} px={50}>
      {shipSalesLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="AWB/Rush Tag#"
            placeholder="AWB/Rush Tag#"
            {...form.getInputProps("awbNo")}
            required
          />
          <DateInput
            label="Ship Date"
            placeholder="Part Ship Date"
            value={form.values.shipDate && new Date(form.values.shipDate)}
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ shipDate: dateValue });
            }}
            error={form.errors.shipDate}
            clearable
            required
          />

          <DateInput
            label="Received Date"
            placeholder="Part Received Date"
            value={
              form.values.receivedDate && new Date(form.values.receivedDate)
            }
            onChange={(e: any) => {
              const dateValue = e ? new Date(e?.toString()) : null;
              form.setValues({ receivedDate: dateValue });
            }}
            error={form.errors.receivedDate}
            clearable
          />
          <Group align="end">
            <Checkbox
              label="Received By Customer"
              variant="filled"
              checked={form.values.receivedByCustomer}
              {...form.getInputProps("receivedByCustomer")}
            />
            <Checkbox
              label="Is Part Fully Shipped"
              variant="filled"
              checked={form.values.isFullyShipped}
              {...form.getInputProps("isFullyShipped")}
            />
          </Group>
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={shipSalesLoading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export const LoanFilterForm = ({ form, handleSubmit, isLoading }: any) => {
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
                <Select
                  label="Company"
                  placeholder="Select one Company"
                  data={company?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.name}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("companyId")}
                />
                <TextInput
                  label="Order By Name"
                  placeholder="Order By Name "
                  {...form.getInputProps("orderedByName")}
                />
                <TextInput
                  label="Order By Email"
                  placeholder="Order By Email "
                  {...form.getInputProps("orderedByEmail")}
                />

                <TextInput
                  label="Order Number"
                  placeholder="Order Number "
                  {...form.getInputProps("orderNo")}
                />
                <TextInput
                  label="Customer Order Number"
                  placeholder="Customer Order Number "
                  {...form.getInputProps("customerOrderNo")}
                />

                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Created",
                    "Part Requested",
                    "Part Issued",
                    "Part Sent",
                    "Received by Customer",
                    "Payment Requested",
                    "Invoice Sent To Customer",
                    "Payment Received",
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
