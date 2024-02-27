import {
  useUpdateAttachmentMutation,
  useUploadAttachmentMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Group,
  Text,
  rem,
  SimpleGrid,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import MyLoadingOverlay from "../MyLoadingOverlay";
import { IconUpload, IconPhoto, IconX, IconFile } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export const AttachmentForm = ({ entityId, entityType, action }: any) => {
  const form = useForm({
    initialValues: {
      file: {},
      fileName: "",
      entityId: entityId,
      entityType: entityType,
    },
  });
  const attached = form.values.file[0]?.name;
  console.log(form.values);
  const [
    addAttachment,
    { isLoading: addLoading, isSuccess: addSuccess, error: addError },
  ] = useUploadAttachmentMutation();
  const [
    updateAttachment,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateAttachmentMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const { data: addReturn }: any = await addAttachment(form.values);
      addReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Attachment Added Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addError?.data?.message || "Error occurs on add Assignment",
            color: "red",
          });
    } else if (action === "update") {
      const { data: updateReturn }: any = await updateAttachment(form.values);
      updateReturn?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.message || "Attachment updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateError?.data.message ||
              updateError?.data.title ||
              "Error occurs on update Assignment",
            color: "red",
          });
    }
  };

  return (
    <>
      {(addLoading || updateLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <Box m={20}>
          <TextInput
            my={20}
            w={"80%"}
            label="File Name"
            placeholder="File Name"
            {...form.getInputProps("fileName")}
            required
          />
          <Dropzone
            onDrop={(file) => form.setFieldValue("file", file)}
            onReject={(file) => console.log("rejected files", file)}
            maxSize={5 * 1024 ** 2}
            //   accept={IMAGE_MIME_TYPE}
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
        </Box>
        <Button type="submit" mt="sm" loading={addLoading || updateLoading}>
          {" "}
          Submit
        </Button>
      </form>
    </>
  );
};

export default AttachmentForm;
