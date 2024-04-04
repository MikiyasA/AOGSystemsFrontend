import { formatDate } from "@/config/util";
import { Box, Group, SimpleGrid, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCirclePlus, IconEditCircle } from "@tabler/icons-react";
import { BuyerRemarkForm, FinanceRemarkForm } from "./SOAForms";
import AttachmentTable from "../Attachment/AttachmentTable";

const SOADetail = ({ data, detailData }: any) => {
  return (
    <Box>
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
              gap={2}
              style={{ alignContent: "baseline" }}
            >
              {!(
                d.key === "buyerRemarks" ||
                d.key === "financeRemarks" ||
                d.key === "attachment"
              ) && (
                <Title order={5} fw={600}>
                  {d.value}
                </Title>
              )}
              <Title order={6} fw={"normal"} pl={10}>
                {d.key === "invoiceDate" ||
                d.key === "dueDate" ||
                d.key === "paymentProcessedDate" ||
                d.key === "popDate" ? (
                  (() => {
                    return formatDate(data[d.key]);
                  })()
                ) : d.key === "amount" ? (
                  data[d.key]?.toFixed(2)
                ) : d.key === "buyerRemarks" || d.key === "financeRemarks" ? (
                  <></>
                ) : (
                  data[d.key]
                )}
              </Title>
            </Group>
          );
        })}
      </SimpleGrid>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {detailData?.map((d: any, i: any) => {
          if (d.key === "buyerRemarks" || d.key === "financeRemarks") {
            return (
              <Group
                key={i}
                display={"grid"}
                gap={2}
                style={{ alignContent: "baseline" }}
              >
                {(d.key === "buyerRemarks" || d.key === "financeRemarks") && (
                  <Box>
                    <Title order={5} fw={600}>
                      {d.value}
                    </Title>
                    <Table key={i}>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>No</Table.Th>
                          <Table.Th>
                            Remark
                            <IconCirclePlus
                              color="green"
                              onClick={() =>
                                modals.open({
                                  title: `Add ${d.value}`,
                                  size: "40%",
                                  children:
                                    d.key === "buyerRemarks" ? (
                                      <BuyerRemarkForm
                                        invoiceId={data.id}
                                        action="add"
                                      />
                                    ) : d.key === "financeRemarks" ? (
                                      <FinanceRemarkForm
                                        invoiceId={data.id}
                                        action="add"
                                      />
                                    ) : null,
                                })
                              }
                            />
                          </Table.Th>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Action</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {data[d.key]?.map((r: any, i: any) => {
                          const today = new Date().getTime();
                          const updatedTime = r.updatedAt
                            ? new Date(r.updatedAt).getTime()
                            : new Date(r.createdAT).getTime();
                          const updatedBefore = today - updatedTime;
                          const eightHoursInMillis = 8 * 60 * 60 * 1000;

                          const canBeEdited =
                            Math.abs(updatedBefore) < eightHoursInMillis;
                          return (
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
                                  <IconEditCircle
                                    color="green"
                                    cursor={"pointer"}
                                    onClick={() =>
                                      modals.open({
                                        title: `Update ${d.value} of invoice# ${data.invoiceNo}`,
                                        size: "40%",
                                        children:
                                          d.key === "buyerRemarks" ? (
                                            <BuyerRemarkForm
                                              id={r.id}
                                              invoiceId={data.id}
                                              message={r.message}
                                              action="update"
                                            />
                                          ) : d.key === "financeRemarks" ? (
                                            <FinanceRemarkForm
                                              id={r.id}
                                              invoiceId={data.id}
                                              message={r.message}
                                              action="update"
                                            />
                                          ) : null,
                                      })
                                    }
                                  />
                                </Table.Td>
                              )}
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </Box>
                )}
              </Group>
            );
          }
        })}
      </SimpleGrid>
    </Box>
  );
};

export default SOADetail;
