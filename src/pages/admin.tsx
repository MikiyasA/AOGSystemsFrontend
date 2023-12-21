import { UserTable } from "@/components/UserTable"
import Layout from "@/hocs/Layout"
import { Group } from "@mantine/core"
import { useGetAllUsersQuery } from "./api/apiSlice"

var userTable = [
    {key: 'userName', value: 'User Name'},
    {key: 'firstName', value: 'First Name'} ,
    {key: 'lastName', value: 'Las tName',} ,
    {key: 'email', value: 'Email'},
    {key: 'phoneNumber', value: 'Phone Number' } ,
    {key: 'isActive', value: 'Is Active' } ,
    {key: 'userStatus', value: 'User Status' } ,
    {key: 'roles', value: 'User Roles' } ,
    {key: 'createdAT', value: 'Created At'} ,
]

const Admin = ({data}: any) => {

    const {data: userData, isLoading, isSuccess} = useGetAllUsersQuery('')
    return(
        <Layout
            title="Admin Page"
            description="Admin Page"
        >
            <Group>
                {isSuccess && <UserTable
                    data={userData}
                    table={userTable}
                    tableTitle="All Users"
                    isActive
                />}
            </Group>
        </Layout>
    )
}

export default Admin