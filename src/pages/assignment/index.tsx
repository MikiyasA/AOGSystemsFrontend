import { AssignmentTable } from "@/components/Assignment/AssignmentTable";
import Layout from "@/hocs/Layout";
import { Group, Tabs, Center, Box } from "@mantine/core";
import { IconChecklist } from "@tabler/icons-react";
import {
  useGetActiveAssignmentQuery,
  useGetAllAssignmentQuery,
} from "../api/apiSlice";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { useForm } from "@mantine/form";
import { AssignmentFilterForm } from "@/components/Assignment/AssignmentForm";
import { useEffect, useState } from "react";

const assignmentTable = [
  { key: "title", value: "Title" },
  { key: "startDate", value: "Start Date" },
  { key: "startBy", value: "Start By" },
  { key: "dueDate", value: "Due Date" },
  { key: "expectedFinishedDate", value: "Expected Finished Date" },
  { key: "assignedTo", value: "Assigned To" },
  { key: "reAssignedTo", value: " ReAssigned To" },
  { key: "reAssignedBy", value: "ReAssigned By" },
  { key: "reAssignedAt", value: "ReAssigned At" },
  { key: "finishedDate", value: "Finished Date" },
  { key: "finishedBy", value: "Finished By" },
  { key: "closedBy", value: "Closed By" },
  { key: "closedAt", value: "Closed At" },
  { key: "status", value: "Status" },
];

const Assignment = ({ data }: any) => {
  const { data: activeAssignment, isLoading } = useGetActiveAssignmentQuery("");

  const form = useForm();
  const queryStr = Object.keys(form.values)
    .map(
      (key) =>
        form.values[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(form.values[key])}`
    )
    .join("&");

  const [queryString, SetQueryString] = useState(queryStr);

  useEffect(() => {
    form.values?.page && SetQueryString(queryStr);
  }, [queryStr, form.values?.page]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    SetQueryString(queryStr);
  };
  const { data: allAssignment, isLoading: assignmentIsLoading } =
    useGetAllAssignmentQuery(queryString);

  return (
    <Layout title="Assignments" description="Assignments">
      {isLoading || (assignmentIsLoading && <MyLoadingOverlay />)}

      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Tabs defaultValue="Active" color="green">
          <Tabs.List>
            <Tabs.Tab
              color="green"
              value="Active"
              leftSection={<IconChecklist color="green" />}
            >
              Active Assignment
            </Tabs.Tab>
            <Tabs.Tab
              color="green"
              value="inactive"
              leftSection={<IconChecklist color="green" />}
            >
              All Assignment
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Active">
            <Box>
              <AssignmentTable
                data={activeAssignment}
                table={assignmentTable}
                tableTitle="Active Assignment"
                isActive
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="inactive">
            <Box>
              <AssignmentFilterForm
                form={form}
                handleSubmit={handleSubmit}
                isLoading={assignmentIsLoading}
              />
              <AssignmentTable
                data={allAssignment?.data}
                table={assignmentTable}
                tableTitle="All Assignment"
                metadata={allAssignment?.metadata}
                form={form}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Layout>
  );
};

export default Assignment;
