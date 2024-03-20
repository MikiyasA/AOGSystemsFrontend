import { downloadFile } from "@/config/util";
import { Box, Button, Group, Input, Table, Title } from "@mantine/core";
import {
  IconCirclePlus,
  IconEditCircle,
  IconEye,
  IconFileDownload,
  IconPlus,
} from "@tabler/icons-react";
import React, { useState } from "react";
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
  const [modalId, SetModalId] = useState<void>();
  return (
    <Box my={30} w={"fit-content"}>
      <Group>
        <Title order={4}>Attachments</Title>
        <IconCirclePlus
          color="green"
          cursor={"pointer"}
          onClick={() => {
            const modal = modals.open({
              title: `Add Attachment`,
              size: "60%",
              children: (
                <AttachmentForm
                  entityId={entityId}
                  entityType={entityType}
                  action="add"
                  modalId={modalId}
                />
              ),
            });
            SetModalId(modal);
          }}
        />
      </Group>
      <Table w={"fit-content"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item#</Table.Th>
            <Table.Th>File Name</Table.Th>
            {/* <Table.Th>Preview</Table.Th> */}
            <Table.Th>Download</Table.Th>
            {/* <Table.Th>Update</Table.Th> */}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attachments?.map((el: any, i: any) => (
            <Table.Tr key={i}>
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{el?.attachment?.fileName}</Table.Td>
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
              {/* <Table.Td>
                <IconEditCircle
                  cursor={"pointer"}
                  color="green"
                  onClick={() =>
                    modals.open({
                      title: "Update Attachment",
                      size: "60%",
                      children: (
                        <AttachmentForm
                          file={el?.attachment?.file}
                          fileName={el?.attachment?.fileName}
                          entityId={el?.attachment?.entityId}
                          entityType={el?.attachment?.entityType}
                          action="update"
                        />
                      ),
                    })
                  }
                />
              </Table.Td> */}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
export default AttachmentTable;
