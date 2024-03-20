import { formatDate } from "@/config/util";
import { Box, Group, SimpleGrid, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEditCircle } from "@tabler/icons-react";
import RemarkForm from "./RemarkForm";
import WithComponentAuth from "@/hocs/WithComponentAuth";
import AttachmentTable from "../Attachment/AttachmentTable";
import { useGetAttachmentLinkByEntityIdQuery } from "@/pages/api/apiSlice";

const FollowupDetail = ({ data, detailData }: any) => {
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "Followup",
  });
  return (
    <Group>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 5 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
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
              <Title order={5} fw={600}>
                {d.value}
              </Title>
              {d.key === "remarks" ? (
                <Group>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>No</Table.Th>
                        <Table.Th>Remark</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {data[d.key].map((r: any, i: any) => {
                        // console.log({ r });
                        const today = new Date().getTime();
                        const updatedTime = r.updatedBy
                          ? new Date(r.updatedBy).getTime()
                          : new Date(r.createdAT).getTime();
                        const updatedBefore = today - updatedTime;
                        const fourHoursInMillis = 4 * 60 * 60 * 1000;

                        const canBeEdited =
                          Math.abs(updatedBefore) < fourHoursInMillis;
                        return (
                          <>
                            <Table.Tr key={i}>
                              <Table.Td>{i + 1}</Table.Td>
                              <Table.Td style={{ maxWidth: "40pc" }}>
                                {r.message}
                              </Table.Td>
                              <Table.Td>
                                {formatDate(r.updateAT || r.createdAT)}
                              </Table.Td>
                              {canBeEdited && (
                                <Table.Td>
                                  <WithComponentAuth
                                    allowedRoles={["Coordinator", "TL"]}
                                  >
                                    <IconEditCircle
                                      color="green"
                                      cursor={"pointer"}
                                      onClick={() =>
                                        modals.open({
                                          title: `Update Remark`,
                                          size: "50%",
                                          children: (
                                            <RemarkForm
                                              id={r.id}
                                              aOGFollowUpId={r.aogFollowUpId}
                                              remark={r.message}
                                              action="update"
                                            />
                                          ),
                                        })
                                      }
                                    />
                                  </WithComponentAuth>
                                </Table.Td>
                              )}
                            </Table.Tr>
                          </>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </Group>
              ) : (
                <Title order={6} fw={"normal"} pl={10}>
                  {d.key === "poCreatedDate" ||
                  d.key === "partReceiveDate" ||
                  d.key === "returnDueDate" ||
                  d.key === "edd" ||
                  d.key === "requestDate"
                    ? formatDate(data[d.key])
                    : data[d.key]}
                </Title>
              )}
            </Group>
          );
        })}
      </SimpleGrid>
      <AttachmentTable
        attachments={attachments}
        entityId={data?.id}
        entityType="Followup"
      />
    </Group>
  );
};

export default FollowupDetail;
