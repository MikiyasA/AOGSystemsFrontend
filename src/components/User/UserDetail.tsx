import { formatDate } from "@/config/util";
import { Box, Group, SimpleGrid, Title } from "@mantine/core";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";

const UserDetail = ({ data, detailData }: any) => {
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
                {d.key === "createdAT" || d.key === "updatedAT" ? (
                  formatDate(data[d.key])
                ) : d.key === "isActive" ? (
                  <>
                    {data.isActive === true ? (
                      <IconCircleCheckFilled style={{ color: "green" }} />
                    ) : (
                      <IconCircleXFilled style={{ color: "red" }} />
                    )}
                  </>
                ) : (
                  data[d.key]
                )}
                {/* {d.isActive === "isActive" ?  <IconCircleCheckFilled style={{color: 'green'}}/> : <IconCircleXFilled style={{color: 'red'}}/>} */}
              </Title>
            </Group>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default UserDetail;
