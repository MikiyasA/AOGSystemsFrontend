import { Button, Group, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { signOut, useSession } from "next-auth/react";
import UserForm from "./UserForm";
import { useGetUserByUsernameQuery } from "@/pages/api/apiSlice";
import MyLoadingOverlay from "../MyLoadingOverlay";

const UserActionMenu = () => {
  const session: any = useSession();
  const { data: userData, isLoading } = useGetUserByUsernameQuery(
    session?.data?.user?.username
  );
  const fName = session?.data?.user?.firstName;
  const lName = session?.data?.user?.lastName;

  return (
    <Group>
      {isLoading && <MyLoadingOverlay />}
      <Menu width="auto" shadow="md">
        <Menu.Target>
          <Button radius={"50%"} w={45} h={45}>
            {`${fName.charAt(0)}${lName.charAt(0)}`}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              modals.open({
                title: "Update Profile Detail",
                size: "90%",
                children: <UserForm data={userData} action="update" />,
              });
            }}
          >
            <Text>Update Profile</Text>
          </Menu.Item>
          <Menu.Item onClick={() => signOut()}>
            <Text>Log Out</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default UserActionMenu;
