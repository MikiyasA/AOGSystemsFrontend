import Layout from "@/hocs/Layout";
import {
  useGetAttachmentLinkByEntityIdQuery,
  useGetCompanyByIDQuery,
} from "@/pages/api/apiSlice";
import { Box, Group, SimpleGrid, Title } from "@mantine/core";
import AttachmentTable from "../Attachment/AttachmentTable";

const SalesDetail = ({ data, detailData }: any) => {
  const { data: companyData, isLoading } = useGetCompanyByIDQuery(
    data.companyId
  );
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "Sales",
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
              {d.key !== "description" && (
                <Title order={5} fw={600}>
                  {d.value}
                </Title>
              )}
              <Title order={6} fw={"normal"} pl={10}>
                {d.key === "createdAT" || d.key === "updatedAT"
                  ? (() => {
                      const date = data[d.key] ? new Date(data[d.key]) : null;
                      const formattedDate = date?.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      return formattedDate;
                    })()
                  : d.key === "companyId"
                  ? companyData?.name
                  : data[d.key]}
              </Title>
            </Group>
          );
        })}
      </SimpleGrid>
      <AttachmentTable
        attachments={attachments}
        entityId={data?.id}
        entityType="Sales"
      />
    </>
  );
};

export default SalesDetail;
