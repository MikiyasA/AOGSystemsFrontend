import {
  useAssignUserToRoleMutation,
  useCreateNewRoleMutation,
  useGetAllRolesQuery,
  useUnassignUserToRoleMutation,
  useUpdateUserMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import MyLoadingOverlay from "../MyLoadingOverlay";

const UserForm = ({ data, action }: any) => {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: data?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    },
    validate: {
      firstName: (value) =>
        value.length < 3 ? "First name must have at least 3 letters" : null,
      lastName: (value) =>
        value.length < 3 ? "Last name must have at least 3 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phoneNumber: (value) =>
        /^\+\d+$/.test(value)
          ? null
          : "Phone number should be provided in form of +xxx---",
    },
  });

  const [updateUser, { isLoading, isSuccess, error }] = useUpdateUserMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const { data: updateReturn }: any = await updateUser(form.values);
    updateReturn?.isSuccess
      ? notifications.show({
          title: "Success",
          message: updateReturn?.message || "User updated Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            updateReturn?.data.message ||
            updateReturn?.data?.title ||
            "Error occurs on update Assignment",
          color: "red",
        });
  };

  useEffect(() => {
    isSuccess && modals.closeAll();
  }, [isSuccess]);
  return (
    <>
      {isLoading && <MyLoadingOverlay />}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <TextInput
            label="First Name"
            placeholder="Your First Name"
            required
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Your Last Name"
            required
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Email"
            placeholder="Your Email"
            required
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Phone No"
            placeholder="Your Phone No"
            required
            {...form.getInputProps("phoneNumber")}
          />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={isLoading}
            disabled={!form.isValid()}
          >
            {action == "update" ? "Update" : "Register"}
          </Button>
        </SimpleGrid>
      </form>
    </>
  );
};
export default UserForm;

export function RoleForm({ data }: any) {
  const form = useForm({
    initialValues: {
      userName: data?.userName,
      role: "",
    },
  });
  const [assignRole, { isLoading, isSuccess, error }] =
    useAssignUserToRoleMutation();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const assignReturn: any = await assignRole(form.values).unwrap();
    assignReturn?.succeeded
      ? notifications.show({
          title: "Success",
          message: assignReturn?.message || "Role assigned  Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            assignReturn?.errors[0]?.description ||
            assignReturn?.data?.message ||
            assignReturn?.data?.title ||
            "Error occurs on Role assignment",
          color: "red",
        });
  };
  isSuccess && modals.closeAll();

  const { data: roles } = useGetAllRolesQuery("");
  return (
    <Group mb={20} style={{ display: "flex", justifyContent: "center" }}>
      {isLoading && <MyLoadingOverlay />}
      <form onSubmit={handleSubmit}>
        <Select
          label="Roles"
          placeholder="Select one Role"
          data={roles
            ?.filter((r: any) => !data?.roles.includes(r.name))
            .map((r: any) => r.name)}
          searchable
          nothingFoundMessage="Nothing found..."
          {...form.getInputProps("role")}
          required
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={isLoading}
          disabled={!form.isValid()}
        >
          Assign
        </Button>
      </form>
    </Group>
  );
}

export function UnassignRoleForm({ data }: any) {
  const form = useForm({
    initialValues: {
      userName: data?.userName,
      role: data?.role,
    },
  });

  const [unassignRole, { isLoading, isSuccess, error }] =
    useUnassignUserToRoleMutation();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const assignReturn: any = await unassignRole(form.values).unwrap();
    assignReturn?.succeeded
      ? notifications.show({
          title: "Success",
          message: assignReturn?.message || "Role unassigned  Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            assignReturn?.errors[0]?.description ||
            assignReturn?.data?.message ||
            assignReturn?.data?.title ||
            "Error occurs when Role unassigned",
          color: "red",
        });
  };

  isSuccess && modals.closeAll();

  return (
    <Group mb={20} style={{ display: "flex", justifyContent: "center" }}>
      {isLoading && <MyLoadingOverlay />}
      <form onSubmit={handleSubmit}>
        <Select
          label="Roles"
          placeholder="Select one Role"
          data={data?.roles}
          searchable
          nothingFoundMessage="Nothing found..."
          {...form.getInputProps("role")}
          required
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={isLoading}
          disabled={!form.isValid()}
        >
          Unassign
        </Button>
      </form>
    </Group>
  );
}

export function CreateRoleForm({ data }: any) {
  const form = useForm({
    initialValues: {
      role: data?.userName,
    },
  });

  const [createRole, { isSuccess, isLoading }] = useCreateNewRoleMutation();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const createReturn: any = await createRole(form.values).unwrap();
    createReturn?.succeeded
      ? notifications.show({
          title: "Success",
          message: createReturn?.message || "Role Created  Successfully 👍",
          color: "green",
        })
      : notifications.show({
          title: "Failure",
          message:
            createReturn?.errors[0]?.description ||
            createReturn?.data?.message ||
            createReturn?.data?.title ||
            "Error occurs when Role creating",
          color: "red",
        });
  };

  isSuccess && modals.closeAll();

  return (
    <Box>
      {isLoading && <MyLoadingOverlay />}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Role Name"
          placeholder="The name of Role"
          required
          {...form.getInputProps("role")}
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={isLoading}
          disabled={!form.isValid()}
        >
          Create Role
        </Button>
      </form>
    </Box>
  );
}
