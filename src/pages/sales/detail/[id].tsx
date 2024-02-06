import {
  IndeterminateCheckbox,
  RaiseInvoice,
} from "@/components/Invoice/RaiseInvoice";
import InvoiceForm from "@/components/Invoice/InvoiceForm";
import InvoiceTable from "@/components/Invoice/InvoiceTable";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import SalesForm, {
  LineItemForm,
  ShipSalesForm,
} from "@/components/Sales/SalesForm";
import Layout from "@/hocs/Layout";
import {
  useGetAllPartQuery,
  useGetCompanyByIDQuery,
  useGetSalesOrderByIdQuery,
  useSalesApprovalMutation,
  useSalesCloserMutation,
  useUpdateSalesOrderMutation,
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
} from "@tabler/icons-react";
import { truncate } from "fs";
import { useRouter } from "next/router";
import { useState } from "react";

const Detail = ({ data }: any) => {
  const route = useRouter();
  const {
    data: salesOrder,
    isLoading,
    isSuccess,
  } = useGetSalesOrderByIdQuery(route?.query.id);

  const { data: companyData } = useGetCompanyByIDQuery(salesOrder?.companyId);
  const { data: partData } = useGetAllPartQuery("");
  const header = [
    "IT#",
    "Part",
    "Unit Price",
    "Currency",
    "Quantity",
    "UOM",
    "Total Price",
    "RID",
    "SN Shipped",
    "Action",
  ];

  const rows = salesOrder?.salesPartLists?.map((el: any, index: any) => {
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
          <Table.Td>{el.rid}</Table.Td>
          <Table.Td>{el.serialNo}</Table.Td>
          <Group>
            {!el.isInvoiced && !el.isDeleted && (
              <Tooltip label="Edit Part Line">
                <IconEdit
                  color="green"
                  onClick={() => {
                    modals.open({
                      title: "Edit Line",
                      size: "90%",
                      children: (
                        <LineItemForm
                          data={el}
                          salesId={salesOrder?.id}
                          action="update"
                        />
                      ),
                    });
                  }}
                />
              </Tooltip>
            )}
          </Group>
        </Table.Tr>
      </>
    );
  });

  const [
    salesApproval,
    { isLoading: approvalIsLoading, isSuccess: approvalIsSuccess },
  ] = useSalesApprovalMutation();

  const isAllInvoice = salesOrder?.salesPartLists?.every(
    (x: any) => x.isInvoiced === true
  );

  const orderForm = useForm({
    initialValues: {
      id: salesOrder?.id,
      companyId: salesOrder?.companyId,
      orderByName: salesOrder?.orderByName,
      orderByEmail: salesOrder?.orderByEmail,
      orderNo: salesOrder?.orderNo,
      customerOrderNo: salesOrder?.customerOrderNo,
      shipToAddress: salesOrder?.shipToAddress,
      status: salesOrder?.status,
      note: salesOrder?.note,
    },
  });

  const [updateSales, { isLoading: updateIsLoading }] =
    useUpdateSalesOrderMutation();

  const [
    salesCloser,
    { isLoading: isLoadingSalesCloser, isSuccess: isSuccessSalesCloser },
  ] = useSalesCloserMutation();

  return (
    <Layout
      title={`Sales Order Detail of ${salesOrder ? salesOrder.orderNo : ""}`}
      description="Sales Order Detail"
    >
      {(isLoading || approvalIsLoading || isLoadingSalesCloser) && (
        <MyLoadingOverlay />
      )}

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
                {salesOrder?.orderNo}
                {salesOrder?.status !== "Closed" && (
                  <Tooltip label="Edit Sales Order">
                    <IconCircleArrowUpRight
                      color="green"
                      onClick={() => {
                        modals.open({
                          title: `Update Sales Order ${salesOrder?.orderNo}`,
                          size: "90%",
                          children: (
                            <SalesForm action="update" data={salesOrder} />
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
                {salesOrder?.status}
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
                {salesOrder?.orderByName}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Customer Contact Email:
              </Title>
              <Title order={6} fw={"normal"}>
                {salesOrder?.orderByEmail}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Ship To Address:
              </Title>
              <Title order={6} fw={"normal"}>
                {salesOrder?.shipToAddress}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Is Fully Shipped:
              </Title>
              <Title order={6} fw={"normal"}>
                {salesOrder?.isFullyShipped ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color="red" />
                )}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                AWB/Rush Tag#:
              </Title>
              <Title order={6} fw={"normal"}>
                {salesOrder?.awbNo}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Received By Customer:
              </Title>
              <Title order={6} fw={"normal"} style={{ alignItems: "end" }}>
                {salesOrder?.receivedByCustomer ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color="red" />
                )}
              </Title>
            </Group>
            <Group>
              <Title order={5} fw={600}>
                Received Date:
              </Title>
              <Title order={6} fw={"normal"}>
                {salesOrder?.receivedDate}
              </Title>
            </Group>
          </SimpleGrid>
          {salesOrder?.status !== "Closed" ? (
            <Group mb={20}>
              {salesOrder?.isApproved ? (
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
                        salesApproval({
                          salesId: salesOrder?.id,
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
                        salesApproval({
                          salesId: salesOrder.id,
                          isApproved: true,
                        }),
                    });
                  }}
                >
                  Approve Order
                </Button>
              )}

              {!salesOrder?.isFullyShipped && (
                <Button
                  onClick={() => {
                    modals.open({
                      title: "Ship part to customer",
                      size: "90%",
                      children: <ShipSalesForm data={salesOrder} />,
                    });
                  }}
                >
                  Send Shipment
                </Button>
              )}

              <Button
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Close The Order",
                    children: (
                      <Text>Are you sure you want to close the order?</Text>
                    ),
                    labels: { confirm: "Confirm", cancel: "Cancel" },
                    onConfirm: () =>
                      salesCloser({
                        id: salesOrder?.id,
                        status: "Closed",
                      }),
                  });
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
                    salesCloser({
                      id: salesOrder.id,
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
                    if (th === "Part" && !salesOrder?.isFullyShipped)
                      return (
                        <Table.Th key={i}>
                          {th}{" "}
                          <IconCirclePlus
                            style={{ marginLeft: "10px" }}
                            color="green"
                            onClick={() => {
                              modals.open({
                                title: "Add Part List",
                                size: "90%",
                                children: (
                                  <LineItemForm
                                    action="add"
                                    salesId={salesOrder.id}
                                  />
                                ),
                              });
                            }}
                          />{" "}
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
                {salesOrder?.isApproved ? (
                  <>
                    {isAllInvoice ? (
                      <Text>
                        All part line of this order is invoice, no more invoice
                        rasing is needed
                      </Text>
                    ) : (
                      <RaiseInvoice
                        salesOrder={salesOrder}
                        partData={partData}
                      />
                    )}
                  </>
                ) : (
                  <Text>Please Approve the order to raise invoice</Text>
                )}
                <Group mt={15}>
                  <InvoiceTable data={salesOrder} partData={partData} />
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
