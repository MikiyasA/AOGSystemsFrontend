import { useActivateUserMutation, useAssignUserToRoleMutation, useDeactivateUserMutation, useGetAllRolesQuery } from "@/pages/api/apiSlice"
import { Button, Group, Menu, Select, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconBolt, IconCircleCheck, IconCircleCheckFilled, IconCircleX, IconCircleXFilled, IconEditCircle, IconEye, IconUserCheck, IconUserOff, IconUserX } from "@tabler/icons-react"
import { RoleForm, UnassignRoleForm } from "./UserForm"
import { IconUserPlus } from "@tabler/icons-react"


const UserAction = ({data}: any) => {

  
  // const assignToRole = 

  const [activateUser, {isLoading: activateLoading, isSuccess: activateSuccess}] = useActivateUserMutation()
  const [deactivateUser, {isLoading: deactivateLoading, isSuccess: deactivateSuccess}] = useDeactivateUserMutation()
    console.log({data})
    return(
        <Menu width={200} shadow="md">
                <Menu.Target>
                  <IconBolt color={data?.color} style={{  placeSelf: 'center', margin: '0 20px 0 0'}} />
                </Menu.Target>
                <Menu.Dropdown>
                {data.isActive ? 
                  <Menu.Item  onClick={() => {
                    modals.openConfirmModal({
                      centered: true,
                      title: 'Deactivate User',
                      children: (
                        <Text>Are you sure you want to deactivate this user account?</Text>
                      ),
                      labels: {confirm: 'Deactivate User', cancel: 'Cancel'},
                      confirmProps: {color: 'red'},
                      cancelProps: {color: 'transparent'},
                      onConfirm: async () => {
                        const deactivateReturn: any = await deactivateUser({id: data?.id}).unwrap()
                        deactivateReturn?.isSuccess ? notifications.show({
                          title: 'Success',
                          message:  deactivateReturn?.message || 'User successfully deactivated 👍',
                          color: 'green',
                      }) : notifications.show({
                          title: 'Failure',
                          message:  deactivateReturn?.data?.message || 'Error occurs on user deactivated',
                          color: 'red',
                      })
                      }
                      })}
                  }  leftSection={<IconUserX color='red' />}> Deactivate User
                  </Menu.Item>
                :
                  <Menu.Item  onClick={() => {
                      modals.openConfirmModal({
                      centered: true,
                      title: 'Activate User',
                      children: (
                        <Text>Are you sure you want to activate this user account?</Text>
                      ),
                      labels: {confirm: 'Activate User', cancel: 'Cancel'},
                      confirmProps: {color: 'green'},
                      cancelProps: {color: 'transparent'},
                      onConfirm: async () => {
                        const activateReturn: any = await activateUser({id: data?.id}).unwrap()
                        activateReturn?.isSuccess ? notifications.show({
                          title: 'Success',
                          message:  activateReturn?.message || 'User successfully activated👍',
                          color: 'green',
                      }) : notifications.show({
                          title: 'Failure',
                          message:  activateReturn?.data?.message || 'Error occurs on user activated',
                          color: 'red',
                      })
                      }
                      })}
                  }  leftSection={<IconUserCheck color='green' />}> Active User
                  </Menu.Item>
                }
                
                <Menu.Item  onClick={() => {
                  modals.open({
                    title: "Assign User to Role",
                    children: (
                      <RoleForm data={data} />
                    )
                  })
                }}
                leftSection={<IconUserPlus color='green'/>}> Assign To Role
                </Menu.Item>

                <Menu.Item  onClick={() => {
                  modals.open({
                    title: "Unassign Role",
                    children: (
                      <UnassignRoleForm data={data} />
                    )
                  })
                }}
                leftSection={<IconUserOff color='red'/>} > Unassign Role
                </Menu.Item>

                
            </Menu.Dropdown>
        </Menu>
    )
}
export default UserAction