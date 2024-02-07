import { formatDate } from "@/config/util";
import { Group, SimpleGrid, Table, Text, Title } from "@mantine/core";

const FollowupDetail = ({ data, detailData }: any) => {
  return (
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
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {data[d.key].map((r: any, i: any) => (
                      <Table.Tr key={i}>
                        <Table.Td>{i + 1}</Table.Td>
                        <Table.Td style={{ maxWidth: "40pc" }}>
                          {r.message}
                        </Table.Td>
                        <Table.Td>
                          {formatDate(r.updateAT || r.createdAT)}
                        </Table.Td>
                      </Table.Tr>
                    ))}
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
  );
};

export default FollowupDetail;
