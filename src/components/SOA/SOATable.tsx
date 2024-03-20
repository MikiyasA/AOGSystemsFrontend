import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Box,
  Button,
  Title,
  NumberFormatter,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEditCircle,
  IconEye,
  IconCircleCheck,
} from "@tabler/icons-react";
import classes from "../../styles/Followup.module.css";
import { modals } from "@mantine/modals";
import Paginate from "../Paginate";
import { ImportInvoiceListForm, InvoiceListForm, VendorForm } from "./SOAForms";
import { formatDate } from "@/config/util";
import SOADetail from "./SOADetail";
import DownloadExcel from "../DownloadExcel";
import SOAActionMenu from "./ActionMenu";
import WithComponentAuth from "@/hocs/WithComponentAuth";
export interface RowData {
  vendorId: string;
  invoiceNo: string;
  poNo: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: 0;
  currency: string;
  underFollowup: string;
  paymentProcessedDate: Date;
  popDate: Date;
  popReference: string;
  chargeType: string;
  buyerName: string;
  tlName: string;
  managerName: string;
  status: string;
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
          <Text fw={500} fz="xs">
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
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null || aValue === undefined) {
        return payload.reversed ? 1 : -1;
      }
      if (bValue === null || bValue === undefined) {
        return payload.reversed ? -1 : 1;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return payload.reversed ? bValue - aValue : aValue - bValue;
      }

      // Fallback to string comparison
      return payload.reversed
        ? bValue.toString().localeCompare(aValue.toString())
        : aValue.toString().localeCompare(bValue.toString());
    }),
    payload.search
  );
}

var detailData = [
  { key: "invoiceNo", value: "Invoice No " },
  { key: "poNo", value: "PO No" },
  { key: "invoiceDate", value: "Invoice Date" },
  { key: "dueDate", value: "Due Date" },
  { key: "amount", value: "Amount" },
  { key: "currency", value: "Currency" },
  { key: "underFollowup", value: "Under Followup" },
  { key: "paymentProcessedDate", value: "Payment Processed Date" },
  { key: "popDate", value: "POP Date" },
  { key: "popReference", value: "POP Reference" },
  { key: "chargeType", value: "Charge Type" },
  { key: "buyerName", value: "Buyer Name" },
  { key: "tlName", value: "TL Name" },
  { key: "managerName", value: "Manager Name" },
  { key: "status", value: "Status" },
  { key: "buyerRemarks", value: "Buyer Remarks" },
  { key: "financeRemarks", value: "Finance Remarks" },
  { key: "attachment", value: "Attachment" },
];

export function SOATable({
  data,
  table,
  tableTitle,
  isActive,
  metadata,
  form,
  vendorId,
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
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return (
      <Table.Tr key={index} style={{ borderRadius: 10 }}>
        <Table.Td p={5} m={0}>
          {index + 1}
        </Table.Td>
        {table?.map((col: any, index: any) => {
          if (
            col.key === "invoiceDate" ||
            col.key === "dueDate" ||
            col.key === "paymentProcessedDate" ||
            col.key === "popDate"
          ) {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0} fz={13}>
                {formatDate(row[col.key])}
              </Table.Td>
            );
          } else if (col.key === "amount") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0} fz={13}>
                <NumberFormatter
                  suffix={` ${row.currency}`}
                  value={row[col.key]?.toFixed(2)}
                  thousandSeparator
                />
              </Table.Td>
            );
          } else if (
            col.key === "buyerRemarks" ||
            col.key === "financeRemarks"
          ) {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0} fz={13}>
                {row[col.key][0]?.message}
              </Table.Td>
            );
          } else {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0} fz={13}>
                {row[col.key]}
              </Table.Td>
            );
          }
        })}

        {isActive && (
          <Table.Td display={"flex"}>
            <IconEye
              cursor={"pointer"}
              onClick={() => {
                modals.open({
                  size: "100%",
                  title: "SOA Invoice Detail",
                  children: <SOADetail data={row} detailData={detailData} />,
                });
              }}
            />
            <WithComponentAuth
              allowedRoles={[
                "Coordinator",
                "TL",
                "Management",
                "Buyer",
                "Finance",
              ]}
            >
              <IconEditCircle
                cursor={"pointer"}
                color="green"
                onClick={() =>
                  modals.open({
                    size: "100%",
                    title: "Update Invoice",
                    children: (
                      <InvoiceListForm
                        data={row}
                        vendorId={vendorId}
                        action="update"
                      />
                    ),
                  })
                }
              />
            </WithComponentAuth>

            <SOAActionMenu invoiceNo={row.invoiceNo} invoiceId={row.id} />
          </Table.Td>
        )}
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
        {isActive && (
          <Group my={20}>
            <WithComponentAuth
              allowedRoles={[
                "Coordinator",
                "TL",
                "Management",
                "Buyer",
                "Finance",
              ]}
            >
              <Button
                onClick={() =>
                  modals.open({
                    size: "100%",
                    title: "Add Invoice",
                    children: (
                      <InvoiceListForm
                        data={data}
                        vendorId={vendorId}
                        action="add"
                      />
                    ),
                  })
                }
              >
                Add SOA Invoice
              </Button>
            </WithComponentAuth>
            <WithComponentAuth allowedRoles={["Finance"]}>
              <Button
                onClick={() =>
                  modals.open({
                    size: "50%",
                    title: "Import Invoice List",
                    children: <ImportInvoiceListForm vendorId={vendorId} />,
                  })
                }
              >
                Import Invoice List
              </Button>
            </WithComponentAuth>
            <DownloadExcel data={data} />
          </Group>
        )}
        {!isActive && <Paginate metadata={metadata} form={form} data={data} />}

        <Table
          horizontalSpacing="lg"
          verticalSpacing="xs"
          layout="fixed"
          highlightOnHover
          striped
          w={"fit-content"}
        >
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
              {isActive && <Th>Action</Th>}
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
