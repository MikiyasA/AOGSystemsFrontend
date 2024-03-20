import { useGetAttachmentLinkByEntityIdQuery } from "@/pages/api/apiSlice";
import { Group, SimpleGrid, Table, Text, Title } from "@mantine/core";
import AttachmentTable from "../Attachment/AttachmentTable";

const CoreFollowupDetail = ({ data, detailData }: any) => {
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "CoreFollowup",
  });
  return (
    <>
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
              <Title order={6} fw={"normal"} pl={10}>
                {d.key === "poCreatedDate" ||
                d.key === "partReceiveDate" ||
                d.key === "returnDueDate" ||
                d.key === "returnProcessedDate" ||
                d.key === "podDate"
                  ? (() => {
                      const date = new Date(data[d.key]);
                      const formattedDate = date.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      return formattedDate;
                    })()
                  : data[d.key]}
              </Title>
            </Group>
          );
        })}
      </SimpleGrid>
      <AttachmentTable
        attachments={attachments}
        entityId={data?.id}
        entityType="CoreFollowup"
      />
    </>
  );
};

export default CoreFollowupDetail;
