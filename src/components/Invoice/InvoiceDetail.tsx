import { formatDate } from "@/config/util";
import {
  useGetAllPartQuery,
  useGetAttachmentLinkByEntityIdQuery,
  useGetLoanByIDQuery,
  useGetSalesOrderByIdQuery,
  useInvoiceApprovalMutation,
  useInvoiceCloserMutation,
} from "@/pages/api/apiSlice";
import {
  Image,
  Box,
  Center,
  Text,
  Grid,
  Title,
  Group,
  Button,
  SimpleGrid,
  Table,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { UpdateInvoiceForm } from "./InvoiceForm";
import Head from "next/head";

import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import WithComponentAuth from "@/hocs/WithComponentAuth";
import AttachmentTable from "../Attachment/AttachmentTable";

const InvoiceDetail = ({ data, location }: any) => {
  const { data: salesOrder, isLoading } = useGetSalesOrderByIdQuery(
    data?.salesOrderId
  );
  const { data: loanOrder } = useGetLoanByIDQuery(data?.loanOrderId);
  const { data: partData } = useGetAllPartQuery("");
  const { data: attachments } = useGetAttachmentLinkByEntityIdQuery({
    entityId: data?.id,
    entityType: "Invoice",
  });

  const header = [
    "IT#",
    "Part",
    "Unit Price",
    "Currency",
    "Quantity",
    "UOM",
    "Total Price",
  ];
  const offerHeader = [
    "IT#",
    "Description",
    "Unit Price",
    "Quantity",
    "Total Price",
    "Currency",
  ];
  const rows = data?.invoicePartLists?.map((el: any, index: any) => {
    const part = partData?.filter((p: any) => p.id === el.partId);

    return (
      <>
        <Table.Tr
          key={index + "2"}
          style={{ textDecoration: el.isDeleted ? "line-through" : "none" }}
        >
          <Table.Td>{index + 1}</Table.Td>
          <Table.Td>
            {part && part[0]?.partNumber} ({part && part[0]?.description})
          </Table.Td>
          <Table.Td>{el.unitPrice}</Table.Td>
          <Table.Td>{el.currency}</Table.Td>
          <Table.Td>{el.quantity}</Table.Td>
          <Table.Td>{el.uom}</Table.Td>
          <Table.Td>{el.totalPrice}</Table.Td>
        </Table.Tr>
        {el.offers && (
          <Table.Tr>
            <Table.Td></Table.Td>
            <Table.Td colSpan={9}>
              <Group>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      {offerHeader.map((th: any, i: any) => {
                        return <Table.Th key={i}>{th}</Table.Th>;
                      })}
                    </Table.Tr>
                  </Table.Thead>

                  {el.offers.map((elm: any, i: any) => (
                    <Table.Tbody key={i + "of"}>
                      <Table.Tr
                        key={index + "2"}
                        style={{
                          textDecoration: el.isDeleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <Table.Td>{i + 1}</Table.Td>
                        <Table.Td>{elm.description}</Table.Td>
                        <Table.Td>{elm.unitPrice}</Table.Td>
                        <Table.Td>{elm.quantity}</Table.Td>
                        <Table.Td>{elm.totalPrice}</Table.Td>
                        <Table.Td>{elm.currency}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  ))}
                </Table>
              </Group>
            </Table.Td>
          </Table.Tr>
        )}
      </>
    );
  });
  const totalOfTotal = data?.invoicePartLists?.reduce(
    (acc: any, item: any) => acc + item.totalPrice,
    0
  );
  const [invoiceApproval, { isLoading: invoiceAppLoading }] =
    useInvoiceApprovalMutation();
  const [invoiceCloser] = useInvoiceCloserMutation();
  return (
    <Center
      style={{
        placeContent: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Head>
        <title>{`Invoice ${data?.invoiceNo}`}</title>
      </Head>
      {invoiceAppLoading || (isLoading && <MyLoadingOverlay />)}

      <Title order={2} mb={20}>
        Invoice {data?.invoiceNo}
      </Title>
      <Box>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {location === "print" ? (
            <Box>
              <Image
                alt="Invoice Logo"
                radius="md"
                h={70}
                w={250}
                fit="fill"
                src={"/et-logo 1.jpg"}
                mb={8}
              />

              <Text fz={13}>Telephone: 0115178254/ 0115178210 </Text>
              <Text fz={13}>P. O. Box 1755 {"\n"}</Text>
              <Text fz={13}>Fax: 251-1-611474 {"\n"}</Text>
              <Text fz={13}>ADDIS ABABA</Text>
            </Box>
          ) : (
            <Box>
              <Group>
                <Title order={5}> Status:</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.status}
                </Title>
              </Group>
              <Group>
                <Title order={5}> POP Date:</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {formatDate(data?.popDate)}
                </Title>
              </Group>
              <Group>
                <Title order={5}>POP Reference:</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.popReference}
                </Title>
              </Group>
              <Group>
                <Title order={5}>Remark:</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.remark}
                </Title>
              </Group>
            </Box>
          )}

          <Box right={0} pos={"relative"}>
            <Group>
              <Title order={5}> Invoice No</Title>
              <Title order={6} style={{ fontWeight: 100 }}>
                {data?.invoiceNo}
              </Title>
            </Group>
            <Group>
              <Title order={5}> Invoice Date</Title>
              <Title order={6} style={{ fontWeight: 100 }}>
                {formatDate(data?.invoiceDate)}
              </Title>
            </Group>
            <Group>
              <Title order={5}> Due Date</Title>
              <Title order={6} style={{ fontWeight: 100 }}>
                {formatDate(data?.dueDate)}
              </Title>
            </Group>
            {data?.transactionType == "Sales" && (
              <Group>
                <Title order={5}> Sales Order</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {salesOrder?.orderNo}
                </Title>
              </Group>
            )}
            {data?.transactionType == "Sales" && (
              <Group>
                <Title order={5}> Customer Order</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {salesOrder?.customerOrderNo}
                </Title>
              </Group>
            )}

            {data?.transactionType == "Loan" && (
              <Group>
                <Title order={5}> Loan Order</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {loanOrder?.orderNo}
                </Title>
              </Group>
            )}
            {data?.transactionType == "Loan" && (
              <Group>
                <Title order={5}> Customer Order</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {loanOrder?.customerOrderNo}
                </Title>
              </Group>
            )}
          </Box>
        </SimpleGrid>
        {location !== "print" && (
          <Group my={20}>
            {data?.status !== "Closed" && (
              <>
                <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
                  <Button
                    onClick={() =>
                      modals.open({
                        title: "Update Invoice",
                        size: "90%",
                        children: (
                          <UpdateInvoiceForm data={data} action="update" />
                        ),
                      })
                    }
                  >
                    Update Invoice
                  </Button>
                </WithComponentAuth>
                {data?.isApproved ? (
                  <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
                    <Button
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "Unapprove Invoice",
                          children: (
                            <Text size="sm">
                              Are you sure you want to unapproved the Invoice?
                            </Text>
                          ),
                          labels: { confirm: "Confirm", cancel: "Cancel" },
                          onConfirm: () =>
                            invoiceApproval({
                              id: data?.id,
                              isApproved: false,
                            }),
                        });
                      }}
                    >
                      Unapproved Invoice
                    </Button>
                  </WithComponentAuth>
                ) : (
                  <WithComponentAuth allowedRoles={["TL"]}>
                    <Button
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "Approve Invoice",
                          children: (
                            <Text size="sm">
                              Are you sure you want toapproved the Invoice?
                            </Text>
                          ),
                          labels: { confirm: "Confirm", cancel: "Cancel" },
                          onConfirm: () =>
                            invoiceApproval({
                              id: data?.id,
                              isApproved: true,
                            }),
                        });
                      }}
                    >
                      Approved Invoice
                    </Button>
                  </WithComponentAuth>
                )}{" "}
              </>
            )}

            {data?.isApproved && (
              <Button>
                <Link
                  href={`/invoice/print/${data?.id}`}
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Print Invoice
                </Link>
              </Button>
            )}
            {data?.status !== "Closed" ? (
              <>
                {data?.popReference && (
                  <WithComponentAuth allowedRoles={["TL"]}>
                    <Button
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "Close The Invoice",
                          children: (
                            <Text>
                              Are you sure you want to close the Invoice?
                            </Text>
                          ),
                          labels: { confirm: "Confirm", cancel: "Cancel" },
                          onConfirm: () =>
                            invoiceCloser({
                              id: data?.id,
                              status: "Closed",
                            }),
                        });
                      }}
                    >
                      Close Invoice
                    </Button>
                  </WithComponentAuth>
                )}
              </>
            ) : (
              <WithComponentAuth allowedRoles={["TL"]}>
                <Button
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Close The Invoice",
                      children: (
                        <Text>
                          Are you sure you want to re-open the Invoice?
                        </Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        invoiceCloser({
                          id: data?.id,
                          status: "Re-Opened",
                        }),
                    });
                  }}
                >
                  Re-Open Invoice
                </Button>
              </WithComponentAuth>
            )}
          </Group>
        )}
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          <Box>
            <Title order={5}> Ship To</Title>
            <Title
              order={6}
              style={{ fontWeight: 100, TitleOverflow: "ellipsis" }}
            >
              {data?.transactionType == "Sales" && salesOrder?.shipToAddress}
              {data?.transactionType == "Loan" && loanOrder?.shipToAddress}
            </Title>
          </Box>
          <Box>
            <Title order={5}>Please Remit To:</Title>
            <Box>
              <Box fz={15}>
                If the transfer amount is in USD please use our Citi bank USD
                Account
                <Box ml={20}>
                  <Text fz={12}>CITI BANK of New York </Text>
                  <Text fz={12}>
                    111 wall street 19 th floor N .Y 10043 USA
                  </Text>
                  <Text fz={12}>
                    Account N umber 30464658 Swift Code CI TI US33
                  </Text>
                </Box>
              </Box>
              <Box fz={15}>
                If the transfer amount is in EUR please use Deutsche bank EUR
                Account
                <Box ml={20}>
                  <Text fz={12}>Ethiopian Airlines Group </Text>
                  <Text fz={12}>
                    Deutsche bank AG London ninety 6 bishop gate
                  </Text>
                  <Text fz={12}>London EC2N 4DA ENGLAND</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
        <Box mt={30}>
          <Box>
            <Table w={"fit-content"} mb={30}>
              <Table.Thead>
                <Table.Tr>
                  {header.map((th: any, i: any) => (
                    <Table.Th key={i}>{th}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <hr />
            <Group justify="end" mr={60}>
              <Title order={4}>Total:</Title>
              <Title order={5} style={{ fontWeight: 100 }}>
                {totalOfTotal}
              </Title>
            </Group>
            <hr />
          </Box>
          {data?.remark && (
            <>
              <Group>
                <Title order={5}>Remark:</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.remark}
                </Title>
              </Group>
              <hr />
            </>
          )}
        </Box>
        <Box my={20}>
          <Title my={15} order={4}>
            Order Detail
          </Title>
          <Group>
            <Title order={5}> Customer Order</Title>
            <Title order={6} style={{ fontWeight: 100 }}>
              {data?.transactionType === "Sales"
                ? salesOrder?.customerOrderNo
                : data?.transactionType === "Loan"
                ? loanOrder?.customerOrderNo
                : null}
            </Title>
          </Group>
          <Group>
            <Title order={5}>Ordered By</Title>
            <Title order={6} style={{ fontWeight: 100 }}>
              {data?.transactionType === "Sales"
                ? salesOrder?.orderByName
                : data?.transactionType === "Loan"
                ? loanOrder?.orderedByName
                : null}
            </Title>
          </Group>
          <Group>
            <Title order={5}>Email</Title>
            <Title order={6} style={{ fontWeight: 100 }}>
              {data?.transactionType === "Sales"
                ? salesOrder?.orderByEmail
                : data?.transactionType === "Loan"
                ? loanOrder?.orderedByEmail
                : null}
            </Title>
          </Group>
          {!(data?.transactionType === "Loan") && (
            <>
              <Group>
                <Title order={5}>Order Ship Date</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.transactionType === "Sales"
                    ? formatDate(salesOrder?.shipDate)
                    : data?.transactionType === "Loan"
                    ? formatDate(loanOrder?.shipDate)
                    : null}
                </Title>
              </Group>
              <Group>
                <Title order={5}>Shipment Reference</Title>
                <Title order={6} style={{ fontWeight: 100 }}>
                  {data?.transactionType === "Sales"
                    ? salesOrder?.awbNo
                    : data?.transactionType === "Loan"
                    ? loanOrder?.awbNo
                    : null}
                </Title>
              </Group>
            </>
          )}
        </Box>
        {location !== "print" && (
          <AttachmentTable
            attachments={attachments}
            entityId={data?.id}
            entityType="Invoice"
          />
        )}
      </Box>
    </Center>
  );
};

export default InvoiceDetail;
