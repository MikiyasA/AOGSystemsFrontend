import {
  useAddFollowUpTabMutation,
  useUpdateFollowupTabMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Button,
  ColorInput,
  ColorPicker,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import MyLoadingOverlay from "../MyLoadingOverlay";

const TabForm = ({ data, action }: any) => {
  const [
    addFpTab,
    { isLoading: isFpTabLoading, isSuccess: isFpTabSuccess, error: addError },
  ] = useAddFollowUpTabMutation();
  const [
    updateFpTab,
    {
      isLoading: isUpFpTabLoading,
      isSuccess: isUpFpTabSuccess,
      error: updateError,
    },
  ] = useUpdateFollowupTabMutation();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      name: data?.name,
      color: data?.color,
      status: data?.status || "Active",
    },
    validate: {
      name: (v) =>
        v?.length < 4
          ? "Name must be provided and should be 4 character minimum"
          : null,
      color: (v) => (v === null || v === "" ? "Please pick Tab Color" : null),
    },
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addFpTab(form.values);
      addReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              addReturn?.data?.message || "Followup Tab Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.error?.data?.message ||
              addReturn?.message ||
              (addError as any)?.data?.message ||
              "Error occurs on add Followup Tab",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn: any = await updateFpTab(form.values);
      updateReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.data?.message || "Followup Tab Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.error?.data?.message ||
              updateReturn?.message ||
              (updateError as any)?.data.message ||
              "Error occurs on add Followup Tab",
            color: "red",
          });
    }
  };

  (isFpTabSuccess || isUpFpTabSuccess) && modals.closeAll();

  return (
    <Box>
      {isFpTabLoading || (isUpFpTabLoading && <MyLoadingOverlay />)}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Name"
            placeholder="Tab Name"
            {...form.getInputProps("name")}
            required
          />
          <Select
            label="Status"
            placeholder="Tab Status"
            data={["Active", "Closed"]}
            {...form.getInputProps("status")}
            required
          />
          <ColorInput
            label="Pick Tab color"
            placeholder="Pick Tab color"
            format="hexa"
            swatches={[
              "#25262b",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
            {...form.getInputProps("color")}
          />
        </SimpleGrid>
        <Button
          type="submit"
          mt="sm"
          loading={isFpTabLoading || isUpFpTabLoading}
        >
          {" "}
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TabForm;
