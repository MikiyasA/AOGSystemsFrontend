import { formatDate } from "@/config/util";
import Layout from "@/hocs/Layout";
import {
  useGetAttachmentLinkByEntityIdQuery,
  useGetCompanyByIDQuery,
} from "@/pages/api/apiSlice";
import { Box, Group, SimpleGrid, Title } from "@mantine/core";
import AttachmentTable from "../Attachment/AttachmentTable";

const LoanDetail = ({ data, detailData }: any) => {
  const { data: companyData, isLoading } = useGetCompanyByIDQuery(
    data.companyId
  );
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "Loan",
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
                {d.key === "createdAT" || d.key === "updatedAT"
                  ? formatDate(data[d.key])
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
        entityType="Loan"
      />
    </>
  );
};

export default LoanDetail;
