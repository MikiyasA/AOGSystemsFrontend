import Layout from "@/hocs/Layout";
import {
  Box,
  Button,
  Group,
  SimpleGrid,
  Title,
  Center,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import AssignmentForm, { ReassignForm } from "./AssignmentForm";
import { formatDate, getUserNameById } from "@/config/util";
import {
  useStartAssignmentMutation,
  useFinishAssignmentMutation,
  useGetAllUsersQuery,
  useReopenAssignmentMutation,
  useCloseAssignmentMutation,
} from "@/pages/api/apiSlice";
import MyLoadingOverlay from "../MyLoadingOverlay";

const AssignmentDetail = ({ data, detailData }: any) => {
  const [
    startAssignment,
    { isLoading: startLoading, isSuccess: startSuccess },
  ] = useStartAssignmentMutation();
  const [
    finishAssignment,
    { isLoading: finishLoading, isSuccess: finishSuccess },
  ] = useFinishAssignmentMutation();

  const [
    closeAssignment,
    { isLoading: closeLoading, isSuccess: closeSuccess },
  ] = useCloseAssignmentMutation();
  const [
    reopenAssignment,
    { isLoading: reopenLoading, isSuccess: reopenSuccess },
  ] = useReopenAssignmentMutation();

  const { data: users, isLoading } = useGetAllUsersQuery("");

  return (
    <Center
      style={{
        placeContent: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {(reopenLoading ||
        closeLoading ||
        finishLoading ||
        startLoading ||
        isLoading) && <MyLoadingOverlay />}
      <Box>
        <Title order={3} my={30}>
          Assignment Detail
        </Title>
        <Group my={20}>
          <Button
            onClick={() => {
              modals.open({
                title: "Update Assignment",
                size: "90%",
                children: <AssignmentForm data={data} action="update" />,
              });
            }}
          >
            Update
          </Button>

          {data?.status === "Created" && (
            <Button
              onClick={() => {
                modals.openConfirmModal({
                  title: `Start Assignment ${data?.title}`,
                  labels: { confirm: "Confirm", cancel: "Cancel" },
                  children: <Text>Are you sure to start the assignment</Text>,
                  onConfirm() {
                    startAssignment({ id: data?.id });
                  },
                });
              }}
            >
              Start
            </Button>
          )}

          {(data?.status === "In-work" || data?.status === "Re-Assigned") && (
            <Button
              onClick={() => {
                modals.openConfirmModal({
                  title: `Finish Assignment ${data?.title}`,
                  labels: { confirm: "Confirm", cancel: "Cancel" },
                  children: <Text>Are you sure to finish the assignment</Text>,
                  onConfirm() {
                    finishAssignment({ id: data?.id });
                  },
                });
              }}
            >
              Finish
            </Button>
          )}

          {data?.status === "In-work" && (
            <Button
              onClick={() => {
                modals.open({
                  title: `Reassign Assignment ${data?.title}`,
                  children: <ReassignForm data={data} users={users} />,
                });
              }}
            >
              Reassign
            </Button>
          )}

          {(data?.status === "Finished" || data?.status === "Re-opened") && (
            <Button
              onClick={() => {
                modals.openConfirmModal({
                  title: `Close Assignment ${data?.title}`,
                  labels: { confirm: "Confirm", cancel: "Cancel" },
                  children: <Text>Are you sure to Close the assignment</Text>,
                  onConfirm() {
                    closeAssignment({ id: data?.id });
                  },
                });
              }}
            >
              Close
            </Button>
          )}

          {data?.status === "Closed" && (
            <Button
              onClick={() => {
                modals.openConfirmModal({
                  title: `Reopen Assignment ${data?.title}`,
                  labels: { confirm: "Confirm", cancel: "Cancel" },
                  children: <Text>Are you sure to Reopen the assignment</Text>,
                  onConfirm() {
                    reopenAssignment({ id: data?.id });
                  },
                });
              }}
            >
              Reopen
            </Button>
          )}
        </Group>
        <hr />
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
          mb={20}
        >
          {detailData?.map((d: any, i: any) => {
            return (
              <Group
                key={i}
                display={"grid"}
                w={"max-content"}
                gap={2}
                style={{ alignContent: "baseline" }}
              >
                {d.key !== "description" && (
                  <Title order={5} fw={600}>
                    {d.value}
                  </Title>
                )}
                <Title order={6} fw={"normal"} pl={10}>
                  {d.key === "startDate" ||
                  d.key === "dueDate" ||
                  d.key === "expectedFinishedDate" ||
                  d.key === "reAssignedAt" ||
                  d.key === "reOpenedAt" ||
                  d.key === "finishedDate" ? (
                    formatDate(data && data[d.key])
                  ) : d.key === "description" ? (
                    <> </>
                  ) : d.key === "finishedBy" ||
                    d.key === "assignedTo" ||
                    d.key === "reAssignedTo" ||
                    d.key === "reAssignedBy" ||
                    d.key === "reOpenedBy" ? (
                    getUserNameById(users, data[d.key])
                  ) : (
                    data && data[d.key]
                  )}
                </Title>
              </Group>
            );
          })}
        </SimpleGrid>
        <Box mt={10}>
          {detailData?.map(
            (d: any) =>
              d.key === "description" && (
                <>
                  <Title order={5} fw={600}>
                    {d.value}
                  </Title>
                  <div
                    style={{
                      borderRadius: "10px",
                      padding: "20px",
                      width: "100%",
                    }}
                    dangerouslySetInnerHTML={{ __html: data[d.key] }}
                  ></div>
                </>
              )
          )}
        </Box>
      </Box>
    </Center>
  );
};

export default AssignmentDetail;
