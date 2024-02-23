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
  Tooltip,
} from "@mantine/core";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useAddPartListMutation,
  useCreateSalesOrderMutation,
  useGetAllCompaniesQuery,
  useGetAllPartQuery,
  useShipSalesMutation,
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
import PartForm from "../Part/PartForm";
import CompanyForm from "../Company/CompanyForm";

const SalesForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      orderNo: data?.orderNo,
      companyId: data?.companyId,
      orderByName: data?.orderByName,
      orderByEmail: data?.orderByEmail,
      customerOrderNo: data?.customerOrderNo,
      shipToAddress: data?.shipToAddress,
      status: data?.status || "Created",
      note: data?.note,
      salesId: data?.salesId,
      quantity: data?.quantity || 1,
      uom: data?.uom,
      unitPrice: data?.unitPrice,
      currency: data?.currency,
    },
    validate: {
      companyId: (v) => (v?.length < 1 ? "Company must be selected" : null),
    },
  });

  const partListForm = useForm({
    initialValues: {
      salesId: data?.salesId,
      quantity: data?.quantity || 1,
      uom: data?.uom || "EA",
      unitPrice: data?.unitPrice,
      currency: data?.currency || "USD",
    },
  });

  const [
    createSales,
    { isLoading: addIsLoading, isSuccess: addIsSuccess, error: addError },
  ] = useCreateSalesOrderMutation();
  const [
    updateSales,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateSalesOrderMutation();

  const [
    addPartList,
    { isLoading: isLoadingPartList, isSuccess: isSuccessPartList },
  ] = useAddPartListMutation();

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
      const createReturn = await createSales(form.values).unwrap();
      if (createReturn.isSuccess) {
        partListForm.setFieldValue("salesId", createReturn?.salesId);
        const addReturn = await addPartList(partListForm.values).unwrap();
        if (addReturn.isSuccess) {
          notifications.show({
            title: "Success",
            message: addReturn?.message || "Sales Order Creatd Successfully 👍",
            color: "green",
          });
        }
      } else {
        notifications.show({
          title: "Failure",
          message: addError?.message || "Error occurs on add Part",
          color: "red",
        });
      }
    } else if (action === "update") {
      const updateReturn = await updateSales(form.values).unwrap();
      updateReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Sales Order Update Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message: updateError?.data.message || "Error occurs on add Part",
            color: "red",
          });
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
                    children: <CompanyForm action="add" closeModal={false} />,
                  });
                }}
              />
            </Tooltip>
          </Group>
          <TextInput
            label="Order By Name"
            placeholder="Order By Name"
            {...form.getInputProps("orderByName")}
            required
          />
          <TextInput
            label="Order By Email"
            placeholder="Order By Email Address"
            {...form.getInputProps("orderByEmail")}
            required
          />
          <TextInput
            label="Customer Order No"
            placeholder="Customer Order Number"
            {...form.getInputProps("customerOrderNo")}
            required
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
                  min={1}
                  {...partListForm.getInputProps("quantity")}
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
                  {...partListForm.getInputProps("uom")}
                  required
                />
              </Group>
              <NumberInput
                label="Unit Price"
                placeholder="Unit Price"
                min={1}
                {...partListForm.getInputProps("unitPrice")}
              />
              <Select
                label="Currency"
                placeholder="Select Currency"
                data={["USD", "BIR", "EUR", "GBP", "CNY", "INR", "AUD", "CAD"]}
                withAsterisk
                {...partListForm.getInputProps("currency")}
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

export default SalesForm;

export const LineItemForm = ({ data, salesId, action }: any) => {
  const partListForm = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      salesId: salesId,
      partId: data?.partId,
      quantity: data?.quantity || 1,
      uom: data?.uom || "EA",
      unitPrice: data?.unitPrice,
      currency: data?.currency || "USD",
      rid: data?.rid,
      serialNo: data?.serialNo,
    },
    validate: {
      quantity: (x: any) => (x < 1 ? "Quantity must be grater than one" : null),
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
  ] = useUpdatePartListMutation();

  const [addPartList, { isLoading: addIsLoading, isSuccess: addIsSuccess }] =
    useAddPartListMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn = await addPartList(partListForm.values).unwrap();
      addReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Part List Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addError?.data.message || "Error occurs on Part List Added",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn = await updatePartList(partListForm.values).unwrap();
      updateReturn.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Part List Update Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateError?.data.message || "Error occurs on update Part List",
            color: "red",
          });
    }
  };

  return (
    <Box w={"100%"} px={50}>
      {updateIsLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
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
              {...partListForm.getInputProps("partId")}
              required
              disabled={data?.isInvoiced}
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
          <NumberInput
            label="Unit Price"
            placeholder="Unit Price"
            min={1}
            {...partListForm.getInputProps("unitPrice")}
            required
            disabled={data?.isInvoiced}
          />
          <Select
            label="Currency"
            placeholder="Select Currency"
            data={["USD", "BIR", "EUR", "GBP", "CNY", "INR", "AUD", "CAD"]}
            withAsterisk
            {...partListForm.getInputProps("currency")}
            required
            disabled={data?.isInvoiced}
          />
          <NumberInput
            label="Quantity"
            placeholder="Quantity"
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

          <TextInput
            label="RID"
            placeholder="RID"
            {...partListForm.getInputProps("rid")}
            disabled={data?.isInvoiced}
          />
          <TextInput
            label="Serial No"
            placeholder="Serial No"
            {...partListForm.getInputProps("serialNo")}
            disabled={data?.isInvoiced}
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={updateIsLoading}>
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
            placeholder="Part Received Date by Customer"
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

export const SalesFilterForm = ({ form, handleSubmit, isLoading }: any) => {
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
                  {...form.getInputProps("orderByName")}
                />
                <TextInput
                  label="Order By Email"
                  placeholder="Order By Email "
                  {...form.getInputProps("orderByEmail")}
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
                <TextInput
                  label="AWB Number"
                  placeholder="AWB Number "
                  {...form.getInputProps("awbNo")}
                />
                <DateInput
                  label="Ship Date From"
                  placeholder="Ship Date From"
                  value={
                    form.values.shipDateFrom &&
                    new Date(form.values.shipDateFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      shipDateFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.shipDateFrom}
                  clearable
                />
                <DateInput
                  label="Ship Date To"
                  placeholder="Ship Date To"
                  value={
                    form.values.shipDateTo && new Date(form.values.shipDateTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      shipDateTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.shipDateTo}
                  clearable
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
