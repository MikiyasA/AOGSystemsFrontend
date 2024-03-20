import Layout from "@/hocs/Layout";
import { Box, Button, Group, Select, Table, TextInput } from "@mantine/core";
import { useState } from "react";
import {
  useGetCompanyByCodeQuery,
  useGetCompanyByNameQuery,
  useGetInvoicesByInvoiceNoQuery,
  useGetPartByPNQuery,
  useGetPartByPartialPNQuery,
} from "../api/apiSlice";
import Link from "next/link";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { formatDate } from "@/config/util";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import withAuth from "@/hocs/withAuth";

const SearchInvoice = () => {
  const [invoice, setInvoice] = useState<any>();
  const [invoices, setInvoices] = useState<any>();
  const [invoiceNo, setInvoiceNo] = useState("");
  const [orderId, setOrderId] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const {
    data: invoiceNoData,
    isLoading,
    isSuccess,
  } = useGetInvoicesByInvoiceNoQuery(invoice);

  const handleChange = (e: any) => {
    e.preventDefault();
    setInvoiceNo(e.target.value);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setInvoice(invoiceNo);
  };

  const header = [
    "IT#",
    "Invoice No",
    "Invoice Date",
    "Due Date",
    "Transaction Type",
    "Is Approved",
    "POP Reference",
    "POP Date",
    "Status",
    "Remark",
  ];
  const rows = invoiceNoData?.map((el: any, index: any) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Link href={`/invoice/detail/${el.id}`}>{el.invoiceNo}</Link>
        </Table.Td>
        <Table.Td>{formatDate(el.invoiceDate)}</Table.Td>
        <Table.Td>{formatDate(el.dueDate)}</Table.Td>
        <Table.Td>{el.transactionType}</Table.Td>
        <Table.Td>
          {el.isApproved ? (
            <IconCircleCheck color="green" />
          ) : (
            <IconCircleX color="red" />
          )}
        </Table.Td>
        <Table.Td>{el.popReference}</Table.Td>
        <Table.Td>{formatDate(el.popDate)}</Table.Td>
        <Table.Td>{el.status}</Table.Td>
        <Table.Td>{el.remark}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Layout title="Invoice Search" description="Invoice Search">
      {isLoading && <MyLoadingOverlay />}
      <Box mx={100} mt={30} w={"100%"}>
        <Group>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}
          >
            <Group>
              <TextInput
                label="Invoice Number"
                placeholder="Invoice Number to Search"
                onChange={handleChange}
                required
              />
            </Group>

            <Button type="submit" mt="sm" loading={isLoading}>
              {" "}
              Submit
            </Button>
          </form>
        </Group>
        <hr />
        {
          <Group w={"100%"}>
            <Table.ScrollContainer minWidth={300} w={"100%"}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {header.map((th: any, i: any) => (
                      <Table.Th key={i}>{th}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Group>
        }
      </Box>
    </Layout>
  );
};

export default withAuth(SearchInvoice, ["Coordinator", "TL", "Management"]);
