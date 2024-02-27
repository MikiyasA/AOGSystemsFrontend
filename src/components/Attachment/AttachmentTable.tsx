import { downloadFile } from "@/config/util";
import { Box, Button, Group, Input, Table, Title } from "@mantine/core";
import {
  IconCirclePlus,
  IconEye,
  IconFileDownload,
  IconPlus,
} from "@tabler/icons-react";
import React from "react";
import classes from "../../styles/Button.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { modals } from "@mantine/modals";
import OpenFiles from "./OpenFiles";
import { useDisclosure } from "@mantine/hooks";
import AttachmentForm from "./AttachmentForm";

const AttachmentTable = ({ attachments, entityId, entityType }: any) => {
  const handleOpenNewWindow = (data: any) => {
    const queryString = encodeURIComponent(JSON.stringify(data));
    window.open(`/attachments/${data?.id}`, "_blank");
  };

  return (
    <Box my={30}>
      <Group>
        <Title order={4}>Attachments</Title>
        <IconCirclePlus
          color="green"
          cursor={"pointer"}
          onClick={() =>
            modals.open({
              title: `Add Attachment`,
              size: "60%",
              children: (
                <AttachmentForm
                  entityId={entityId}
                  entityType={entityType}
                  action="add"
                />
              ),
            })
          }
        />
      </Group>
      <Table w={"fit-content"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item#</Table.Th>
            <Table.Th>File Name</Table.Th>
            {/* <Table.Th>File Type</Table.Th> */}
            {/* <Table.Th>Preview</Table.Th> */}
            <Table.Th>Download</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attachments?.map((el: any, i: any) => (
            <Table.Tr key={i}>
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{el?.attachment?.fileName}</Table.Td>
              {/* <Table.Td>{el?.attachment?.type}</Table.Td> */}
              {/* <Table.Td>
                <Box
                  //   disabled
                  component="button"
                  bg={"none"}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onClick={() => handleOpenNewWindow(el?.attachment)}
                >
                  <IconEye />
                </Box>
              </Table.Td> */}
              <Table.Td>
                <IconFileDownload
                  cursor={"pointer"}
                  color="green"
                  onClick={() =>
                    downloadFile(
                      el?.attachment?.id,
                      el?.attachment?.fileName,
                      el?.attachment?.type
                    )
                  }
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
export default AttachmentTable;
