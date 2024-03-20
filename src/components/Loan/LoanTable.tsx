import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Box,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Title,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEditCircle,
  IconEye,
  IconBolt,
  IconCircleFilled,
  IconCircleXFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import classes from "../../styles/Followup.module.css";
import {
  useGetAllCompaniesQuery,
  useGetCompanyByCodeQuery,
  useGetCompanyByIDQuery,
} from "@/pages/api/apiSlice";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { formatDate } from "@/config/util";
import LoanDetail from "./LoanDetail";
import LoanForm from "./LoanForm";
import Paginate from "../Paginate";
import WithComponentAuth from "@/hocs/WithComponentAuth";

export interface RowData {
  companyId: number;
  orderByName: string;
  orderByEmail: string;
  orderNo: string;
  customerOrderNo: string;
  shipToAddress: string;
  status: string;
  note: string;
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
  { key: "orderNo", value: "Order No" },
  { key: "customerOrderNo", value: "Customer Order No" },
  { key: "companyId", value: "Customer Name" },
  { key: "orderedByName", value: "Order By Name" },
  { key: "orderedByEmail", value: "Order By Email" },
  { key: "shipToAddress", value: "Ship To Address" },
  { key: "status", value: "Status" },
  { key: "note", value: "Note" },
  { key: "createdAT", value: "Order Date" },
  { key: "createdBy", value: "Order Created By" },
];

export function LoanTable({
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

  const {
    data: companyDatas,
    isLoading: isLoadingCompany,
    isSuccess: isSuccessCompany,
  } = useGetAllCompaniesQuery("");

  const MAX_CHARACTERS = 50;

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

    const companyData = companyDatas?.filter(
      (c: any) => c.id === row.companyId
    );

    return (
      <Table.Tr key={index} style={{ borderRadius: 10 }}>
        <Table.Td p={5} m={0}>
          {index + 1}
        </Table.Td>
        {table?.map((col: any, index: any) => {
          if (col.key === "createdAT" || col.key === "updatedAT") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {formatDate(row[col.key])}
              </Table.Td>
            );
          } else if (col.key === "orderNo") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                <Link href={`/loan/detail/${row.id}`}>{row[col.key]}</Link>
              </Table.Td>
            );
          } else if (col.key === "companyId") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {companyData && companyData[0]?.name}
              </Table.Td>
            );
          } else if (col.key === "note") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {row[col.key]?.length > MAX_CHARACTERS
                  ? `${row[col.key]?.slice(0, MAX_CHARACTERS)}...` // Truncate content if it exceeds the limit
                  : row[col.key]}
              </Table.Td>
            );
          } else {
            return (
              <Table.Td
                key={`col-${index}`}
                p={2}
                m={0}
                style={{ overflowWrap: "break-word" }}
              >
                {row[col.key]}
              </Table.Td>
            );
          }
        })}

        <Table.Td display={"flex"} p={0}>
          <IconEye
            cursor={"pointer"}
            onClick={() => {
              modals.open({
                size: "100%",
                title: "User Detail",
                children: <LoanDetail data={row} detailData={detailData} />,
              });
            }}
          />
          <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
            {row.status !== "Closed" && (
              <IconEditCircle
                cursor={"pointer"}
                color="green"
                onClick={() =>
                  modals.open({
                    size: "90%",
                    title: `Update Loan Order ${row?.orderNo}`,
                    children: <LoanForm data={row} action="update" />,
                  })
                }
              />
            )}
          </WithComponentAuth>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Center
      style={{
        placeContent: "center",
        flexDirection: "column",
        width: "100%",
        paddingInline: 30,
      }}
    >
      <Title>{tableTitle}</Title>
      <Box mx={30}>
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
            <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
              <Button
                onClick={() =>
                  modals.open({
                    title: "Create Loan Order",
                    size: "90%",
                    children: <LoanForm action="add" />,
                  })
                }
              >
                Create Loan Order
              </Button>
            </WithComponentAuth>
          )}
          {!isActive && (
            <Paginate metadata={metadata} form={form} data={data} />
          )}

          <Table.ScrollContainer minWidth={200}>
            <Table
              horizontalSpacing="xl"
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
          </Table.ScrollContainer>
        </ScrollArea>
      </Box>
    </Center>
  );
}
