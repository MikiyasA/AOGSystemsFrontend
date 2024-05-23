import { Button, SimpleGrid, TextInput } from "@mantine/core";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { useForm } from "@mantine/form";
import {
  useAddRemarkMutation,
  useUpdateRemarkMutation,
} from "@/pages/api/apiSlice";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const RemarkForm = ({ remark, aOGFollowUpId, id, action }: any) => {
  const form = useForm({
    initialValues: {
      id: id,
      aOGFollowUpId: aOGFollowUpId,
      message: remark,
    },
  });
  const [
    addRemark,
    { isLoading: addLoading, isSuccess: addSuccess, error: addError },
  ] = useAddRemarkMutation();
  const [
    updateRemark,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateRemarkMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addRemark(form.values);
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Remark Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message ||
              addReturn?.data?.errors?.Description[0] ||
              addReturn?.data?.title ||
              "Error occurs on add Remark",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn: any = await updateRemark(form.values);
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: updateReturn?.message || "Remark updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data?.error.message ||
              updateReturn?.data?.title ||
              "Error occurs on update Remark",
            color: "red",
          });
    }
  };

  (addSuccess || updateSuccess) && modals.closeAll();
  return (
    <>
      {(addLoading || updateLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 1 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="Remark"
            placeholder="Remark"
            {...form.getInputProps("message")}
            required
          />
        </SimpleGrid>
        <Button type="submit" mt="sm" loading={addLoading || updateLoading}>
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export default RemarkForm;
