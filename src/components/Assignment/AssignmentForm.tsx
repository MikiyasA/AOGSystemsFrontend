import {
  Accordion,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { IconColorPicker, IconFilterSearch } from "@tabler/icons-react";
import { Color } from "@tiptap/extension-color";
import {
  useAddAssignmentMutation,
  useGetAllUsersQuery,
  useReassignAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/pages/api/apiSlice";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { modals } from "@mantine/modals";
import MyLoadingOverlay from "../MyLoadingOverlay";

const AssignmentForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      dueDate: data?.dueDate,
      expectedFinishedDate: data?.expectedFinishedDate,
      assignedTo: data?.assignedTo,
    },
    validate: {
      title: (v: string) =>
        v?.length < 10
          ? "Title must be provided and should be 10 character minimum"
          : null,
    },
  });
  useEffect(() => {
    form.setFieldValue(
      "status",
      data?.status === undefined ? "Created" : data?.status
    );
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: data?.description,
    onUpdate({ editor }) {
      form.setValues({ description: editor.getHTML() });
    },
  });

  const [
    addAssignment,
    { isLoading: addLoading, error: addError, isSuccess: addSuccess },
  ] = useAddAssignmentMutation();
  const [
    updateAssignment,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateAssignmentMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (action === "add") {
      const addReturn: any = await addAssignment(form.values);
      addReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message: addReturn?.message || "Assignment Add Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              addReturn?.data?.message ||
              addReturn?.data?.errors?.Description[0] ||
              "Error occurs on add Assignment",
            color: "red",
          });
    } else if (action === "update") {
      const updateReturn: any = await updateAssignment(form.values);
      updateReturn?.data?.isSuccess
        ? notifications.show({
            title: "Success",
            message:
              updateReturn?.data?.message ||
              "Assignment updated Successfully 👍",
            color: "green",
          })
        : notifications.show({
            title: "Failure",
            message:
              updateReturn?.data?.error?.message ||
              updateReturn?.data.title ||
              "Error occurs on update Assignment",
            color: "red",
          });
    }
  };

  useEffect(() => {
    addSuccess && modals.closeAll();
    updateSuccess && modals.closeAll();
  }, [addSuccess, updateSuccess]);

  const { data: users } = useGetAllUsersQuery("");

  return (
    <>
      {(addLoading || updateLoading) && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <Box>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            <TextInput
              label="Title"
              placeholder="Title of Task"
              {...form.getInputProps("title")}
              required
              disabled={action === "update"}
            />
            <DateInput
              label="Due Date"
              placeholder="Task Due Date"
              minDate={new Date()}
              value={form.values.dueDate && new Date(form.values.dueDate)}
              onChange={(e: any) =>
                form.setValues({ dueDate: new Date(e.toString()) })
              }
              error={form.errors.dueDate}
              required
              disabled={action === "update"}
            />
            <DateInput
              label="Expected Finished Date"
              placeholder="Task Expected Finished Date"
              minDate={new Date()}
              value={
                form.values.expectedFinishedDate &&
                new Date(form.values.expectedFinishedDate)
              }
              onChange={(e: any) =>
                form.setValues({ expectedFinishedDate: new Date(e.toString()) })
              }
              error={form.errors.expectedFinishedDate}
              disabled={action === "update"}
            />
            <Select
              label="Assign To"
              placeholder="Select one User"
              data={users?.map((u: any) => ({
                value: `${u.id}`,
                label: `${u.firstName} ${u.lastName}`,
              }))}
              searchable
              nothingFoundMessage="Nothing found..."
              {...form.getInputProps("assignedTo")}
              disabled={action === "update"}
            />
            <Select
              label="Status"
              placeholder="Status"
              data={[
                "Created",
                "In-work",
                "Re-Assigned",
                "Finished",
                "Closed",
                "Re-opened",
              ]}
              defaultValue="Created"
              searchable
              nothingFoundMessage="Nothing found..."
              {...form.getInputProps("status")}
              required
              disabled={action === "update"}
            />
          </SimpleGrid>
          <Box mt={20}>
            {" "}
            Task Description
            <Group w={"100%"}>
              <RichTextEditor editor={editor} w={"98%"} mih={"25pc"}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                    <RichTextEditor.H5 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ColorPicker
                    colors={[
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
                  />

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control interactive={false}>
                      <IconColorPicker size="1rem" stroke={1.5} />
                    </RichTextEditor.Control>
                    <RichTextEditor.Color color="#F03E3E" />
                    <RichTextEditor.Color color="#7048E8" />
                    <RichTextEditor.Color color="#1098AD" />
                    <RichTextEditor.Color color="#37B24D" />
                    <RichTextEditor.Color color="#F59F00" />
                  </RichTextEditor.ControlsGroup>

                  {/* <RichTextEditor. */}

                  <RichTextEditor.UnsetColor />
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            </Group>
          </Box>
        </Box>
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

export default AssignmentForm;

export const ReassignForm = ({ data, users }: any) => {
  const [
    reassignAssignment,
    { isLoading: reassignLoading, isSuccess: reassignSuccess },
  ] = useReassignAssignmentMutation();

  const form = useForm({
    initialValues: {
      id: data?.id,
      reAssignedTo: "",
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const reassignReturn: any = await reassignAssignment(form.values);
    reassignReturn?.data?.succeeded
      ? notifications.show({
          title: "Success",
          message:
            reassignReturn?.data?.message ||
            "Assignment reassigned  Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            reassignReturn?.data?.message || "Error occurs on Role assignment",
          color: "red",
        });
  };
  reassignSuccess && modals.closeAll();

  return (
    <Group mb={20} style={{ display: "flex", justifyContent: "center" }}>
      {reassignLoading && <MyLoadingOverlay />}
      <form onSubmit={handleSubmit}>
        <Select
          label="User"
          placeholder="Select one User"
          data={users?.map((u: any) => ({
            value: `${u.id}`,
            label: `${u.firstName} ${u.lastName}`,
          }))}
          searchable
          nothingFoundMessage="Nothing found..."
          {...form.getInputProps("reAssignedTo")}
          required
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={reassignLoading}
          disabled={!form.isValid()}
        >
          Reassign
        </Button>
      </form>
    </Group>
  );
};

export const AssignmentFilterForm = ({
  form,
  handleSubmit,
  isLoading,
}: any) => {
  const { data: users } = useGetAllUsersQuery("");

  return (
    <Accordion mt={20} variant="contained">
      <Accordion.Item value="Filter">
        <Accordion.Control
          icon={<IconFilterSearch color="darkgreen" size={25} />}
          fw={700}
        >
          Filter Assignment{" "}
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={handleSubmit}>
            <Box>
              <SimpleGrid
                cols={{ base: 1, sm: 3, lg: 5 }}
                spacing={{ base: 1, sm: "xl", lg: "sm" }}
                verticalSpacing={{ base: "sm", sm: "sm" }}
              >
                <TextInput
                  label="Title"
                  placeholder="Title to search"
                  {...form.getInputProps("title")}
                />
                <DateInput
                  label="Created Date From"
                  placeholder="Task Expected Finished Date"
                  value={
                    form.values.createdAtFrom &&
                    new Date(form.values.createdAtFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      createdAtFrom: e ? new Date(e).toISOString() : null,
                    })
                  }
                  error={form.errors.createdAtFrom}
                  clearable
                />
                <DateInput
                  label="Created Date To"
                  placeholder="Task Expected Finished Date"
                  value={
                    form.values.createdAtTo && new Date(form.values.createdAtTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      createdAtTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.createdAtTo}
                  clearable
                />

                <Select
                  label="Assign To"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("assignedTo")}
                  required
                />
                <Select
                  label="Started By"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("startedBy")}
                />
                <Select
                  label="Reassigned To"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("reAssignedBy")}
                />
                <DateInput
                  label="Finished Date To"
                  placeholder="Task Expected Finished Date"
                  value={
                    form.values.finishedDate &&
                    new Date(form.values.finishedDate)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      finishedDate: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.finishedDate}
                  clearable
                />

                <Select
                  label="Finished By"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("finishedBy")}
                />
                <Select
                  label="Reopened By"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("reOpenedBy")}
                />

                <Select
                  label="Closed By"
                  placeholder="Select one User"
                  data={users?.map((u: any) => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("closedBy")}
                />
                <DateInput
                  label="Closed At From"
                  placeholder=""
                  value={
                    form.values.closedAtFrom &&
                    new Date(form.values.closedAtFrom)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      closedAtFrom: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.closedAtFrom}
                  clearable
                />
                <DateInput
                  label="Closed At To"
                  placeholder=""
                  value={
                    form.values.closedAtTo && new Date(form.values.closedAtTo)
                  }
                  onChange={(e: any) =>
                    form.setValues({
                      closedAtTo: e ? new Date(e).toISOString() : undefined,
                    })
                  }
                  error={form.errors.closedAtTo}
                  clearable
                />
                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Created",
                    "In-work",
                    "Re-Assigned",
                    "Finished",
                    "Closed",
                    "Re-opened",
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
