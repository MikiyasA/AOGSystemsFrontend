import Layout from "@/hocs/Layout";
import {
  Box,
  Center,
  Group,
  Table,
  Tooltip,
  Text,
  ScrollArea,
  UnstyledButton,
  TextInput,
  rem,
  keys,
  Button,
  Title,
  Tabs,
} from "@mantine/core";
import {
  useGetActiveInvoicesQuery,
  useGetAllInvoiceQuery,
  useInvoiceApprovalMutation,
} from "../api/apiSlice";
import { formatDate } from "@/config/util";
import {
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconFileCheck,
  IconPrinter,
  IconSelector,
  IconSearch,
  IconEditCircle,
  IconEye,
  IconChecklist,
} from "@tabler/icons-react";
import Link from "next/link";
import { modals } from "@mantine/modals";
import InvoiceForm, {
  InvoiceFilterForm,
  UpdateInvoiceForm,
} from "@/components/Invoice/InvoiceForm";
import { useEffect, useState } from "react";

import classes from "../../styles/Followup.module.css";
import InvoiceDetail from "@/components/Invoice/InvoiceDetail";
import { useForm } from "@mantine/form";
import Paginate from "@/components/Paginate";

export interface RowData {
  id: number;
  invoiceNo: string;
  invoiceDate: Date;
  dueDate: Date;
  salesOrder: {
    companyId: number;
    orderByName: string;
    orderByEmail: string;
    orderNo: string;
    customerOrderNo: string;
    shipToAddress: string;
    status: string;
    note: string;
    isApproved: boolean;
    isFullyShipped: boolean;
    awbNo: string;
    shipDate: string;
    receivedByCustomer: boolean;
    receivedDate: Date;
  };
  loanOrder: {
    orderNo: string;
    companyId: 1;
    customerOrderNo: string;
    orderedByName: string;
    orderedByEmail: string;
    status: string;
    isApproved: boolean;
    note: string;
  };

  company: {
    name: string;
    code: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    shipToAddress: string;
    billToAddress: string;
    paymentTerm: string;
    id: number;
  };
  transactionType: string;
  isApproved: boolean;
  popReference: string;
  popDate: Date;
  status: string;
  remark: string;
}

interface ThProps {
  children?: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} fz="sm">
            {" "}
            {/*  className={classes.textWrap} > */}
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]
          ?.toLocaleString()
          .localeCompare(a[sortBy]?.toLocaleString());
      }

      return a[sortBy]
        ?.toLocaleString()
        .localeCompare(b[sortBy]?.toLocaleString());
    }),
    payload.search
  );
}
var tableStr = [
  { key: "invoiceNo", value: "Invoice No" },
  { key: "invoiceDate", value: "Invoice Date" },
  { key: "dueDate", value: "Due Date" },
  { key: "orderNo", value: "Order No" },
  { key: "company", value: "Company" },
  { key: "transactionType", value: "Transaction Type" },
  { key: "isApproved", value: "Is Approved" },
  { key: "popReference", value: "POP Reference" },
  { key: "popDate", value: "POP Date" },
  { key: "status", value: "Status" },
  { key: "remark", value: "Remark" },
];

export function InvoiceList({
  data,
  table,
  tableTitle,
  isActive,
  metadata,
  form,
}: any) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData?.map((row: any, index: any) => {
    const today = new Date();
    const dueDate = new Date(row?.returnDueDate);
    const timeDifference = dueDate.getTime() - today.getTime();

    return (
      <Table.Tr key={index} style={{ borderRadius: 10 }}>
        <Table.Td p={5} m={0}>
          {index + 1}
        </Table.Td>
        {table?.map((col: any, index: any) => {
          if (
            col.key === "invoiceDate" ||
            col.key === "dueDate" ||
            col.key === "popDate"
          ) {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {formatDate(row[col.key])}
              </Table.Td>
            );
          } else if (col.key === "orderNo") {
            if (row.transactionType == "Sales") {
              return (
                <Table.Td key={`col-${index}`} p={2} m={0}>
                  {row.salesOrder?.orderNo}
                </Table.Td>
              );
            } else if (row.transactionType == "Loan") {
              return (
                <Table.Td key={`col-${index}`} p={2} m={0}>
                  {row.loanOrder?.orderNo}
                </Table.Td>
              );
            }
          } else if (col.key === "company") {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0}>
                {row.company?.name}
              </Table.Td>
            );
          } else if (col.key === "isApproved") {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0}>
                {row.isApproved ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color="red" />
                )}
              </Table.Td>
            );
          } else {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0}>
                {row[col.key]}
              </Table.Td>
            );
          }
        })}

        <Table.Td display={"flex"}>
          <IconEye
            cursor={"pointer"}
            onClick={() => {
              modals.open({
                size: "100%",
                title: "Invoice Detail",
                children: <InvoiceDetail data={row} location="popup" />,
              });
            }}
          />

          <IconEditCircle
            cursor={"pointer"}
            color="green"
            onClick={() =>
              modals.open({
                size: "100%",
                title: "Update Invoice",
                children: (
                  <UpdateInvoiceForm
                    data={row}
                    action="update"
                    orderType={row.transactionType}
                  />
                ),
              })
            }
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box mx={30}>
      <Center className={classes.tableTitle}>
        <Title>{tableTitle}</Title>
      </Center>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        {!isActive && <Paginate metadata={metadata} form={form} data={data} />}
        <Table w={"fit-content"} layout="fixed" highlightOnHover striped>
          <Table.Tbody>
            <Table.Tr>
              <Th>Item#</Th>
              {table?.map((col: any, index: any) => {
                return (
                  <Th
                    key={`coll-${index}`}
                    sorted={sortBy === `${col.key}`}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting(col.key)}
                  >
                    {" "}
                    {col.value}{" "}
                  </Th>
                );
              })}
              <Th>Action</Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows?.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                {data && data.length > 0 ? (
                  <Table.Td colSpan={Object.keys(data[0]).length}>
                    <Text fw={500} ta="center">
                      Nothing found
                    </Text>
                  </Table.Td>
                ) : null}
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}

const Invoice = ({}) => {
  const { data: invoices } = useGetActiveInvoicesQuery("");

  const form = useForm();
  const queryStr = Object.keys(form.values)
    .map(
      (key) =>
        form.values[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(form.values[key])}`
    )
    .join("&");

  const [queryString, SetQueryString] = useState(queryStr);

  useEffect(() => {
    form.values?.page && SetQueryString(queryStr);
  }, [queryStr, form.values?.page]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    SetQueryString(queryStr);
  };

  const { data: allInvoice, isLoading: allLoading } =
    useGetAllInvoiceQuery(queryString);

  return (
    <Layout title="Active Invoice List" description="Active Invoice List">
      <Center
        style={{
          placeContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Tabs defaultValue="Active" color="green">
          <Tabs.List>
            <Tabs.Tab
              color="green"
              value="Active"
              leftSection={<IconChecklist color="green" />}
            >
              Active Sales Orders
            </Tabs.Tab>
            <Tabs.Tab
              color="green"
              value="inactive"
              leftSection={<IconChecklist color="green" />}
            >
              All Sales Orders
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Active">
            <Box>
              <InvoiceList
                data={invoices}
                table={tableStr}
                tableTitle="Active Invoices"
                isActive
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="inactive">
            <Box>
              <InvoiceFilterForm
                form={form}
                handleSubmit={handleSubmit}
                isLoading={allLoading}
              />
              <InvoiceList
                data={allInvoice?.data}
                table={tableStr}
                tableTitle="All Invoices"
                metadata={allInvoice?.metadata}
                form={form}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Layout>
  );
};

export default Invoice;
