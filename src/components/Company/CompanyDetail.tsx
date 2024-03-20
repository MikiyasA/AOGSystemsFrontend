import { Box, Button, Center, Group, SimpleGrid, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCircleArrowUpRight } from "@tabler/icons-react";
import CompanyForm from "./CompanyForm";
import { useGetAttachmentLinkByEntityIdQuery } from "@/pages/api/apiSlice";
import AttachmentTable from "../Attachment/AttachmentTable";

const CompanyDetail = ({ data }: any) => {
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "Company",
  });
  return (
    <Center
      style={{
        placeContent: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box w={"50%"} m={50} style={{}}>
        <Button
          onClick={() => {
            modals.open({
              size: "100%",
              title: "Add Part",
              children: <CompanyForm action="add" />,
            });
          }}
        >
          Add Company
        </Button>
        <Group>
          <Title order={3} my={20}>
            Company Detail: {`${data?.code} (${data?.name})`}
          </Title>
          <IconCircleArrowUpRight
            cursor={"pointer"}
            color="green"
            onClick={() => {
              modals.open({
                title: "Update Part",
                size: "100%",
                children: <CompanyForm data={data} action="update" />,
              });
            }}
          />
        </Group>
        <SimpleGrid
          cols={{ base: 1, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Company Name
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.name}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Company Code
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.code}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Company Address
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.address}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              City
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.city}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Country
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.country}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Phone No
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.phone}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Ship To Address
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.shipToAddress}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Bill To Address
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.billToAddress}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Payment Term
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {data?.paymentTerm}
            </Title>
          </Group>
        </SimpleGrid>
        <AttachmentTable
          attachments={attachments}
          entityId={data?.id}
          entityType="Company"
        />
      </Box>
    </Center>
  );
};

export default CompanyDetail;
