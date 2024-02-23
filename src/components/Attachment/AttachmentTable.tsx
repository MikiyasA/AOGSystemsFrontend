import { downloadFile } from "@/config/util";
import { Box, Button, Input, Table, Title } from "@mantine/core";
import { IconEye, IconFileDownload } from "@tabler/icons-react";
import React from "react";
import classes from "../../styles/Button.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { modals } from "@mantine/modals";
import OpenFiles from "./OpenFiles";
import { useDisclosure } from "@mantine/hooks";

const AttachmentTable = ({ attachments }: any) => {
  const handleOpenNewWindow = (data: any) => {
    const queryString = encodeURIComponent(JSON.stringify(data));
    window.open(`/attachments/open?data=${queryString}`, "_blank");
  };

  return (
    <Box my={30}>
      <Title order={4}>Attachments</Title>
      <Table w={"fit-content"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item#</Table.Th>
            <Table.Th>File Name</Table.Th>
            {/* <Table.Th>File Type</Table.Th> */}
            <Table.Th>Preview</Table.Th>
            <Table.Th>Download</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attachments?.map((el: any, i: any) => (
            <Table.Tr key={i}>
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{el?.attachment?.fileName}</Table.Td>
              {/* <Table.Td>{el?.attachment?.type}</Table.Td> */}
              <Table.Td>
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
              </Table.Td>
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
