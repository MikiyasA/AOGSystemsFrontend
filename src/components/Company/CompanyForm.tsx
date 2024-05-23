import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/pages/api/apiSlice";
import { Box, Button, SimpleGrid, TextInput, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import React from "react";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

const CompanyForm = ({ data, action, closeModal }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      name: data?.name,
      code: data?.code,
      address: data?.address,
      city: data?.city,
      country: data?.country,
      phone: data?.phone,
      shipToAddress: data?.shipToAddress,
      billToAddress: data?.billToAddress,
      paymentTerm: data?.paymentTerm,
    },
  });

  const [
    addCompany,
    { isLoading: addIsLoading, isSuccess: addIsSuccess, error: addError },
  ] = useCreateCompanyMutation();
  const [
    updateCompany,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateCompanyMutation();

  const route = useRouter();
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addCompany(form.values);
      if (addReturn?.data?.isSuccess) {
        route.push(`/company/detail/${addReturn?.data?.data?.id}`);
        notifications.show({
          title: "Success",
          message: addReturn?.message || "Company Created Successfully 👍",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Failure",
          message:
            addReturn?.error?.data?.message ||
            addReturn?.message ||
            "Error occurs when Company Created",
          color: "red",
        });
      }
    } else if (action === "update") {
      const updateReturn: any = await updateCompany(form.values);
      updateReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.error?.data.message ||
              updateReturn?.message ||
              "Company update Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data.message || "Error occurs on Company updated",
            color: "red",
          });
    }
  };
  addIsSuccess && closeModal && modals.closeAll();
  (updateIsSuccess || addIsSuccess) && modals.closeAll();
  return (
    <Box w={"100%"}>
      {addIsLoading || (updateIsLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <Title order={4} my={30}>
          Add Company
        </Title>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Company Name"
            placeholder="Company Name"
            {...form.getInputProps("name")}
            required
          />
          <TextInput
            label="Company Code"
            placeholder="Company Code"
            {...form.getInputProps("code")}
            required
          />
          <TextInput
            label="Address"
            placeholder="Address"
            {...form.getInputProps("address")}
          />
          <TextInput
            label="City"
            placeholder="City"
            {...form.getInputProps("city")}
          />
          <TextInput
            label="Country"
            placeholder="Country"
            {...form.getInputProps("country")}
          />
          <TextInput
            label="Contact Phone No"
            placeholder="Contact Phone No"
            {...form.getInputProps("phone")}
          />
          <TextInput
            label="Ship To Address"
            placeholder="Ship To Address"
            {...form.getInputProps("shipToAddress")}
          />
          <TextInput
            label="Bill To Address"
            placeholder="Bill To Address"
            {...form.getInputProps("billToAddress")}
          />
          <TextInput
            label="Payment Term"
            placeholder="Payment Term"
            {...form.getInputProps("paymentTerm")}
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
export default CompanyForm;
