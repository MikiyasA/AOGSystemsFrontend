import { AssignmentTable } from "@/components/AssignmentTable"
import Layout from "@/hocs/Layout"
import { Group, Tabs } from "@mantine/core"
import { IconChecklist } from "@tabler/icons-react"
import { useGetActiveAssignmentQuery, useGetAllAssignmentQuery } from "./api/apiSlice"

const assignmentTable = [
    {key: 'title', value: 'Title'} ,
    {key: 'startDate', value: 'Start Date',} ,
    // {key: 'description', value: 'Description' } ,
    {key: 'dueDate', value: 'Due Date'} ,
    {key: 'expectedFinishedDate', value: 'Expected Finished Date' } ,
    {key: 'finishedDate', value: 'Finished Date'},
    {key: 'status', value: 'Status'},
]

const Assignment = ({data}: any) => {

const {data: activeAssignment } = useGetActiveAssignmentQuery('')
const {data: allAssignment} = useGetAllAssignmentQuery('')
return(
    <Layout
    title="Core Followup"
    description="Core Followup"
    >

        <Tabs defaultValue="Active" color='green'>
        <Tabs.List  >
            <Tabs.Tab color='green' value="Active" leftSection={<IconChecklist color='green'/>}>
                Active Assignment
            </Tabs.Tab>
            <Tabs.Tab color='green' value="inactive" leftSection={<IconChecklist color='green'/>}>
                All Assignment
            </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Active">
            <Group>
                <AssignmentTable 
                    data={activeAssignment}
                    table={assignmentTable}
                    tableTitle="Active Assignment"
                    isActive
                />
            </Group>
        </Tabs.Panel>
        <Tabs.Panel value="inactive">
            <Group>
                <AssignmentTable 
                    data={allAssignment}
                    table={assignmentTable}
                    tableTitle="All Assignment"
                />
            </Group>
        </Tabs.Panel>

        </Tabs>
    </Layout>
    )
}

export default Assignment 