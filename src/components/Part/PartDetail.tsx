import {
  Box,
  Button,
  Group,
  SimpleGrid,
  Title,
  Center,
  Table,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCircleArrowUpRightFilled,
  IconEye,
  IconFileDownload,
} from "@tabler/icons-react";
import PartForm from "./PartForm";
import { IconCircleArrowUpRight } from "@tabler/icons-react";
import { useGetAttachmentLinkByEntityIdQuery } from "@/pages/api/apiSlice";
import { downloadFile } from "@/config/util";
import AttachmentTable from "../Attachment/AttachmentTable";

const PartDetail = ({ part }: any) => {
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: part?.id,
    entityType: "Part",
  });
  console.log({ attachments });
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
              children: <PartForm action="add" />,
            });
          }}
        >
          Add Part
        </Button>
        <Group>
          <Title order={3} my={20}>
            Part Detail PN: {part?.partNumber}
          </Title>
          <IconCircleArrowUpRight
            cursor={"pointer"}
            color="green"
            onClick={() => {
              modals.open({
                title: "Update Part",
                size: "100%",
                children: <PartForm data={part} action="update" />,
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
              Part Number
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.partNumber}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Description
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.description}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Stock No
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.stockNo}
            </Title>
          </Group>
          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Manufacturer
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.manufacturer}
            </Title>
          </Group>
          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Financial Class
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.financialClass}
            </Title>
          </Group>

          <Group
            display={"grid"}
            w={"max-content"}
            gap={2}
            style={{ alignContent: "baseline" }}
          >
            <Title order={5} fw={600}>
              Part Type
            </Title>
            <Title order={6} fw={"normal"} pl={10}>
              {part?.partType}
            </Title>
          </Group>
        </SimpleGrid>
        <AttachmentTable attachments={attachments} />
      </Box>
    </Center>
  );
};
export default PartDetail;
