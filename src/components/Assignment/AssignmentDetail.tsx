import Layout from "@/hocs/Layout";
import { Box, Group, SimpleGrid, Title } from "@mantine/core";

const AssignmentDetail = ({ data, detailData }: any) => {
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
                {d.key === "startDate" ||
                d.key === "dueDate" ||
                d.key === "expectedFinishedDate" ||
                d.key === "finishedDate" ? (
                  (() => {
                    const date = new Date(data[d.key]);
                    const formattedDate = date.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    return formattedDate;
                  })()
                ) : d.key === "description" ? (
                  <> </>
                ) : (
                  data[d.key]
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
    </>
  );
};

export default AssignmentDetail;
