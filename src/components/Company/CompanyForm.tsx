import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Button,
  Select,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import React from "react";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { PaymentTerm } from "@/config/constant";

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
      paymentTerm: data?.paymentTerm || "N-30",
    },
    validate: {
      code: (value) => {
        if (value?.includes(" ")) {
          return "Vendor Code cannot contain spaces";
        }
        if (value?.length !== 5) {
          return "Vendor Code must be exactly 5 characters";
        }
        return null;
      },
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
        closeModal &&
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
  if (closeModal) {
    addIsSuccess && modals.closeAll();
    updateIsSuccess && modals.closeAll();
  }
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
            maxLength={5}
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
          <Select
            label="Payment Term"
            placeholder="Payment Term"
            data={PaymentTerm.map((x: string) => x)}
            {...form.getInputProps("paymentTerm")}
          />
        </SimpleGrid>
        <Button
          type="submit"
          mt="sm"
          loading={addIsLoading || updateIsLoading}
          disabled={!form.isValid()}
        >
          {" "}
          Submit
        </Button>
      </form>
    </Box>
  );
};
export default CompanyForm;
