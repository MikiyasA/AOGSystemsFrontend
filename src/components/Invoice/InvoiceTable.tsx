import {
  useGetInvoiceByLoanOrderIdQuery,
  useGetInvoiceBySalesOrderIdQuery,
  useInvoiceApprovalMutation,
} from "@/pages/api/apiSlice";
import { Box, Group, Table, Tooltip, Text } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconFileCheck,
  IconPrinter,
} from "@tabler/icons-react";
import InvoiceForm, { UpdateInvoiceForm } from "./InvoiceForm";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { formatDate } from "@/config/util";
import { useEffect, useState } from "react";
import WithComponentAuth from "@/hocs/WithComponentAuth";

export default function InvoiceTable({ data }: any) {
  const header = [
    "IT#",
    "Invoice No",
    "Invoice Date",
    "Due Date",
    "Is Approved",
    "POP Date",
    "POP Reference",
    "Status",
    "Remark",
    "Action",
  ];
  const [invoices, setInvoices] = useState([]);
  const {
    data: loanInvoices,
    isLoading: isLoadingLoan,
    isSuccess: isSuccessSales,
  } = useGetInvoiceByLoanOrderIdQuery(data?.id);
  const {
    data: salesInvoices,
    isLoading: isLoadingSales,
    isSuccess: isSuccessLoan,
  } = useGetInvoiceBySalesOrderIdQuery(data?.id);

  const [invoiceApproval, { isLoading: invoiceAppLoading }] =
    useInvoiceApprovalMutation();

  useEffect(() => {
    if (data?.loanPartLists) {
      setInvoices(loanInvoices);
    } else if (data?.salesPartLists) {
      setInvoices(salesInvoices);
    }
  }, [salesInvoices, loanInvoices, data]);

  const rows = invoices?.map((el: any, index: any) => {
    return (
      <>
        <Table.Tr key={index + "21"}>
          <Table.Td>{index + 1}</Table.Td>
          <Table.Td>
            <Link href={`/invoice/detail/${el.id}`}>{el.invoiceNo}</Link>
          </Table.Td>
          <Table.Td>{formatDate(el.invoiceDate)}</Table.Td>
          <Table.Td>{formatDate(el.dueDate)}</Table.Td>
          <Table.Td>
            {el.isApproved ? (
              <IconCircleCheck color="green" />
            ) : (
              <IconCircleX color="red" />
            )}
          </Table.Td>
          <Table.Td>{formatDate(el.popDate)}</Table.Td>
          <Table.Td>{el.popReference}</Table.Td>
          <Table.Td>{el.status}</Table.Td>
          <Table.Td>{el.remark}</Table.Td>
          <Group>
            {el.status !== "Closed" && (
              <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
                <Tooltip label="Update Invoice">
                  <IconEdit
                    color="green"
                    onClick={() => {
                      modals.open({
                        title: `Update Invoice ${el.invoiceNo}`,
                        size: "90%",
                        children: <UpdateInvoiceForm data={el} />,
                      });
                    }}
                  />
                </Tooltip>
              </WithComponentAuth>
            )}
            {el.isApproved ? (
              <Link href={`/invoice/print/${el.id}`} target="_blank">
                <Tooltip label="Print Invoice">
                  <IconPrinter color="green" />
                </Tooltip>
              </Link>
            ) : (
              <WithComponentAuth allowedRoles={["TL"]}>
                <Tooltip label="Approve Invoice">
                  <IconFileCheck
                    color="green"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "Approve Invoice",
                        children: (
                          <Text size="sm">
                            Are you sure you want to approved the Invoice?
                          </Text>
                        ),
                        labels: { confirm: "Confirm", cancel: "Cancel" },
                        onConfirm: () =>
                          invoiceApproval({
                            id: el?.id,
                            isApproved: true,
                          }),
                      });
                    }}
                  />
                </Tooltip>
              </WithComponentAuth>
            )}
          </Group>
        </Table.Tr>
      </>
    );
  });

  return (
    <Box>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {header.map((th: any, i: any) => {
              return <Table.Th key={i}>{th}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}
