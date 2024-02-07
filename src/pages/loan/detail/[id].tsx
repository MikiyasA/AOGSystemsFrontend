import InvoiceForm from "@/components/Invoice/InvoiceForm";
import InvoiceTable from "@/components/Invoice/InvoiceTable";
import LoanForm, {
  AddLineItemForm,
  EditPartLine,
  OfferForm,
} from "@/components/Loan/LoanForm";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import SalesForm, { ShipSalesForm } from "@/components/Loan/LoanForm";
import Layout from "@/hocs/Layout";
import {
  useGetAllPartQuery,
  useGetCompanyByIDQuery,
  useGetLoanByIDQuery,
  useLoanApprovalMutation,
  useLoanCloserMutation,
  useLoanPartLineRemovalMutation,
  useSalesApprovalMutation,
  useUpdateLoanMutation,
} from "@/pages/api/apiSlice";
import {
  Box,
  Button,
  Center,
  Group,
  NumberInput,
  Text,
  SimpleGrid,
  Table,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconCircleArrowUpRight,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconCirclePlus,
  IconTrash,
  IconArrowBackUp,
} from "@tabler/icons-react";
import { truncate } from "fs";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatDate } from "@/config/util";
import { RaiseInvoice } from "@/components/Invoice/RaiseInvoice";

const Detail = ({ data }: any) => {
  const route = useRouter();
  const { data: loanOrder, isLoading } = useGetLoanByIDQuery(route?.query.id);
  const { data: companyData } = useGetCompanyByIDQuery(loanOrder?.companyId);
  const { data: partData } = useGetAllPartQuery("");
  const header = [
    "IT#",
    "Part",
    "Quantity",
    "UOM",
    "RID",
    "SN Shipped",
    "Ship Date",
    "Received Date",
    "Received Properly",
    "Action",
  ];
  const offerHeader = [
    "IT#",
    "Description",
    "Base Price",
    "Unit Price",
    "Quantity/Days",
    "Total Price",
    "Currency",
    "Action",
  ];

  const [partLineRemoval] = useLoanPartLineRemovalMutation();
  const rows = loanOrder?.loanPartLists?.map((el: any, index: any) => {
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
          <Table.Td>{el.quantity}</Table.Td>
          <Table.Td>{el.uom}</Table.Td>
          <Table.Td>{el.rid}</Table.Td>
          <Table.Td>{el.serialNo}</Table.Td>
          <Table.Td>{formatDate(el.shipDate)}</Table.Td>
          <Table.Td>{formatDate(el.receivedDate)}</Table.Td>
          {el.receivedDate ? (
            <Table.Td align="center">
              {el.receivingDefect ? (
                <IconCircleX color="red" />
              ) : (
                <IconCircleCheck color="springgreen" />
              )}
            </Table.Td>
          ) : (
            <Table.Td></Table.Td>
          )}
          <Group>
            {!el.isDeleted && (
              <Tooltip label="Edit Part Line">
                <IconEdit
                  cursor={"pointer"}
                  color="green"
                  onClick={() => {
                    modals.open({
                      title: "Edit Line",
                      size: "90%",
                      children: (
                        <EditPartLine data={el} invoiced={el.isInvoiced} />
                      ),
                    });
                  }}
                />
              </Tooltip>
            )}
            {el.isDeleted ? (
              <Tooltip label="Undelete Part Line">
                <IconArrowBackUp
                  cursor={"pointer"}
                  color="mediumspringgreen"
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Un-delete Part Line",
                      children: (
                        <Text>Are you sure to un-delete part line</Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        partLineRemoval({ id: el.id, isDeleted: false }),
                    });
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Delete Part Line">
                <IconTrash
                  cursor={"pointer"}
                  color="red"
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Delete Part Line",
                      children: <Text>Are you sure to delete part line</Text>,
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        partLineRemoval({ id: el.id, isDeleted: true }),
                    });
                  }}
                />
              </Tooltip>
            )}
          </Group>
        </Table.Tr>
        <Table.Tr>
          <Table.Td></Table.Td>
          <Table.Td colSpan={9}>
            <Group>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {offerHeader.map((th: any, i: any) => {
                      if (th === "Description")
                        return (
                          <Table.Th key={i}>
                            {th}
                            {!el.isInvoiced && (
                              <Tooltip label="Add Offer for specific part line">
                                <IconCirclePlus
                                  style={{ marginLeft: "10px" }}
                                  color="green"
                                  onClick={() => {
                                    modals.open({
                                      title: "Add Offer",
                                      size: "90%",
                                      children: (
                                        <OfferForm
                                          action="add"
                                          loanPartListId={el.id}
                                        />
                                      ),
                                    });
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Table.Th>
                        );
                      return <Table.Th key={i}>{th}</Table.Th>;
                    })}
                  </Table.Tr>
                </Table.Thead>
                {el.offers.map((elm: any, i: any) => (
                  <Table.Tbody key={i + "of"}>
                    <Table.Tr
                      key={index + "2"}
                      style={{
                        textDecoration: el.isDeleted ? "line-through" : "none",
                      }}
                    >
                      <Table.Td>{i + 1}</Table.Td>
                      <Table.Td>{elm.description}</Table.Td>
                      <Table.Td>{elm.basePrice}</Table.Td>
                      <Table.Td>{elm.unitPrice}</Table.Td>
                      <Table.Td>{elm.quantity}</Table.Td>
                      <Table.Td>{elm.totalPrice}</Table.Td>
                      <Table.Td>{elm.currency}</Table.Td>
                      <Table.Td>
                        {!el.isInvoiced && !el.isDeleted && (
                          <Tooltip label="Edit Offer">
                            <IconEdit
                              size={"20px"}
                              cursor={"pointer"}
                              color="green"
                              onClick={() => {
                                modals.open({
                                  title: "Edit Line",
                                  size: "90%",
                                  children: (
                                    <OfferForm
                                      data={elm}
                                      action="update"
                                      // loanPartListId={el.id}
                                    />
                                  ),
                                });
                              }}
                            />
                          </Tooltip>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                ))}
              </Table>
            </Group>
          </Table.Td>
        </Table.Tr>
      </>
    );
  });

  const [
    loanApproval,
    { isLoading: approvalIsLoading, isSuccess: approvalIsSuccess },
  ] = useLoanApprovalMutation();

  const isAllInvoice = loanOrder?.loanPartLists?.every(
    (x: any) => x.isInvoiced === true
  );
  const orderForm = useForm({
    validateInputOnBlur: true,
    initialValues: {
      id: loanOrder?.id,
      orderNo: loanOrder?.orderNo,
      companyId: loanOrder?.companyId,
      customerOrderNo: loanOrder?.customerOrderNo,
      orderedByName: loanOrder?.orderedByName,
      orderedByEmail: loanOrder?.orderedByEmail,
      shipToAddress: loanOrder?.shipToAddress,
      status: loanOrder?.status,
      note: loanOrder?.note,
    },
  });

  const [updateLoan, { isLoading: updateIsLoading }] = useUpdateLoanMutation();

  const [loanCloser] = useLoanCloserMutation();

  const isFullyShipped = loanOrder?.loanPartLists.every(
    (x: any) => x.shipDate !== null
  );
  const isFullyReceived = loanOrder?.loanPartLists.every(
    (x: any) => x.receivedDate !== null
  );

  return (
    <Layout
      title={`Loan Order Detail of ${loanOrder ? loanOrder.orderNo : ""}`}
      description="Loan Order Detail"
    >
      {(isLoading || approvalIsLoading) && <MyLoadingOverlay />}

      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 2 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "1px", sm: "1px" }}
            mb={30}
          >
            <Group>
              <Title order={5} fw={600}>
                Order Number:
              </Title>
              <Title order={6} fw={"normal"}>
                {loanOrder?.orderNo}
                {loanOrder?.status !== "Closed" && (
                  <Tooltip label="Edit Sales Order">
                    <IconCircleArrowUpRight
                      color="green"
                      onClick={() => {
                        modals.open({
                          title: `Update Loan Order ${loanOrder?.orderNo}`,
                          size: "90%",
                          children: (
                            // eslint-disable-next-line react/jsx-no-undef
                            <LoanForm action="update" data={loanOrder} />
                          ),
                        });
                      }}
                    />
                  </Tooltip>
                )}
              </Title>
            </Group>

            <Group>
              <Title order={5} fw={600}>
                Status:
              </Title>
              <Title order={6} fw={"normal"}>
                {loanOrder?.status}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Customer Name:
              </Title>
              <Title order={6} fw={"normal"}>
                {companyData?.name}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Customer Contact Name:
              </Title>
              <Title order={6} fw={"normal"}>
                {loanOrder?.orderedByName}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Customer Contact Email:
              </Title>
              <Title order={6} fw={"normal"}>
                {loanOrder?.orderedByEmail}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Ship To Address:
              </Title>
              <Title order={6} fw={"normal"}>
                {loanOrder?.shipToAddress}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Is Fully Shipped:
              </Title>
              <Title order={6} fw={"normal"}>
                {isFullyShipped ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color="red" />
                )}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Is Fully Received:
              </Title>
              <Title order={6} fw={"normal"}>
                {isFullyReceived ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color="red" />
                )}
              </Title>
            </Group>
          </SimpleGrid>
          {loanOrder?.status !== "Closed" ? (
            <Group mb={20}>
              {loanOrder?.isApproved ? (
                <Button
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Unapproved Order",
                      children: (
                        <Text size="sm">
                          Are you sure you want to unapproved the order?
                        </Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        loanApproval({
                          id: loanOrder.id,
                          isApproved: false,
                        }),
                    });
                  }}
                >
                  Unapproved Order
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Approve Order",
                      children: (
                        <Text size="sm">
                          Are you sure you want to approved the order?
                        </Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        loanApproval({
                          id: loanOrder.id,
                          isApproved: true,
                        }),
                    });
                  }}
                >
                  Approve Order
                </Button>
              )}

              <Button
                onClick={() => {
                  if (isAllInvoice) {
                    modals.openConfirmModal({
                      title: "Close The Order",
                      children: (
                        <Text>Are you sure you want to close the order?</Text>
                      ),
                      labels: { confirm: "Confirm", cancel: "Cancel" },
                      onConfirm: () =>
                        loanCloser({
                          id: loanOrder?.id,
                          status: "Closed",
                        }),
                    });
                  } else {
                    modals.openConfirmModal({
                      title: "Order Cannot be Closed",
                      children: (
                        <Text>
                          To close the order you need to issue invoice for all
                          part line.
                        </Text>
                      ),
                      labels: { confirm: "Ok", cancel: "Cancel" },
                      confirmProps: { color: "red" },
                    });
                  }
                }}
              >
                Close Order
              </Button>
            </Group>
          ) : (
            <Button
              onClick={() => {
                modals.openConfirmModal({
                  title: "Close The Order",
                  children: (
                    <Text>Are you sure you want to re-open the order?</Text>
                  ),
                  labels: { confirm: "Confirm", cancel: "Cancel" },
                  onConfirm: () =>
                    loanCloser({
                      id: loanOrder?.id,
                      status: "Re-Opened",
                    }),
                });
              }}
            >
              Re-Open Order
            </Button>
          )}
          <Box>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  {header.map((th: any, i: any) => {
                    if (th === "Part")
                      return (
                        <Table.Th key={i}>
                          {th}{" "}
                          {loanOrder?.status !== "Close" && (
                            <Tooltip label="Add Part Line">
                              <IconCirclePlus
                                style={{ marginLeft: "10px" }}
                                color="green"
                                onClick={() => {
                                  modals.open({
                                    title: "Add Part List",
                                    size: "90%",
                                    children: (
                                      <AddLineItemForm
                                        action="add"
                                        loanId={loanOrder.id}
                                      />
                                    ),
                                  });
                                }}
                              />
                            </Tooltip>
                          )}
                        </Table.Th>
                      );
                    return <Table.Th key={i}>{th}</Table.Th>;
                  })}
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Box>
          <Box my={20}>
            <hr />
            <Box my={20}>
              <Title order={4}>Issued Invoices</Title>
              <Group my={10} display={"block"}>
                {loanOrder?.isApproved ? (
                  <>
                    {isAllInvoice ? (
                      <Text>
                        All part line of this order is invoice, no more invoice
                        rasing is needed
                      </Text>
                    ) : (
                      <RaiseInvoice
                        order={loanOrder}
                        partData={partData}
                        orderType="loan"
                      />
                    )}
                  </>
                ) : (
                  <Text>Please Approve the order to raise invoice</Text>
                )}
                <Group mt={15}>
                  <InvoiceTable data={loanOrder} />
                </Group>
              </Group>
            </Box>
          </Box>
        </Box>
      </Center>
    </Layout>
  );
};

export default Detail;
