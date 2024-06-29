import { FE_LINK } from "@/config";
import {
  useAddPartMutation,
  useUpdatePartMutation,
} from "@/pages/api/apiSlice";
import { Box, Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import MyLoadingOverlay from "../MyLoadingOverlay";

const PartForm = ({ data, action, redirect }: any) => {
  const route = useRouter();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      partNumber: data?.partNumber,
      description: data?.description,
      stockNo: data?.stockNo,
      manufacturer: data?.manufacturer,
      financialClass: data?.financialClass,
      partType: data?.partType,
    },
  });

  const [
    addPart,
    {
      isLoading: addIsLoading,
      isSuccess: addIsSuccess,
      error: addError,
      isError,
    },
  ] = useAddPartMutation();
  const [
    updatePart,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdatePartMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addPart(form.values);
      if (addReturn?.data?.isSuccess) {
        redirect && route.push(`/part/detail/${addReturn?.data?.data?.id}`);
        notifications.show({
          title: "Success",
          message: addReturn?.message || "Part Add Successfully 👍",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Failure",
          message:
            addReturn?.error?.data?.message ||
            addReturn?.message ||
            addReturn?.data?.message ||
            "Error occurs on add Part",
          color: "red",
        });
      }
      isError &&
        notifications.show({
          title: "Failure",
          message:
            addReturn?.message ||
            addReturn?.data?.message ||
            "Error occurs on add Part",
          color: "red",
        });
      addReturn?.data?.isSuccess &&
        redirect &&
        route.push(`/part/detail/${addReturn?.data?.data?.id}`);
    } else if (action === "update") {
      const updateReturn: any = await updatePart(form.values);
      updateReturn?.data.isSuccess
        ? notifications.show({
            title: "Success",
            message: updateReturn?.message || "Part Updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.error?.data.message ||
              updateReturn?.data.message ||
              "Error occurs on add Part",
            color: "red",
          });
      updateReturn?.data.isSuccess &&
        redirect &&
        route.push(`/part/detail/${updateReturn?.data?.data?.id}`);
    }
  };
  if (redirect) {
    addIsSuccess && modals.closeAll();
    updateIsSuccess && modals.closeAll();
  }
  return (
    <Box w={"100%"}>
      {addIsLoading || (updateIsLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
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
            label="Manufacturer"
            placeholder="Manufacturer"
            {...form.getInputProps("manufacturer")}
          />
          <Select
            label="Financial Class"
            placeholder="Financial Class"
            data={["Consumable", "Rotable", "Expense"]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("financialClass")}
          />
          <Select
            label="Part Type"
            placeholder="Part Type"
            data={["Component", "Hardware", "Tool", "Miscellaneous"]}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("partType")}
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

export default PartForm;
