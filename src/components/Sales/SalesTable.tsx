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
import UserAction from "../User/UserAction";
import UserDetail from "../User/UserDetail";
import UserForm, { CreateRoleForm } from "../User/UserForm";
import SalesDetail from "./SalesDetail";
import SalesForm from "./SalesForm";
import Link from "next/link";
import Paginate from "../Paginate";

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
    [...data].sort((a: any, b: any) => {
      if (payload.reversed) {
        return b[sortBy]
          ?.toLocaleString()
          .localeCompare(a[sortBy].toLocaleString());
      }

      return a[sortBy]
        ?.toLocaleString()
        .localeCompare(b[sortBy].toLocaleString());
    }),
    payload.search
  );
}
var detailData = [
  { key: "orderNo", value: "Order No" },
  { key: "customerOrderNo", value: "Customer Order No" },
  { key: "companyId", value: "Customer Name" },
  { key: "orderByName", value: "Order By Name" },
  { key: "orderByEmail", value: "Order By Email" },
  { key: "status", value: "Status" },
  { key: "note", value: "Note" },
  { key: "createdAT", value: "Order Date" },
  { key: "createdBy", value: "Order Created By" },
];

export function SalesTable({
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
            const date = row[col.key] ? new Date(row[col.key]) : null;
            const formattedDate = date?.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {formattedDate}
              </Table.Td>
            );
          } else if (col.key === "orderNo") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                <Link href={`/sales/detail/${row.id}`}>{row[col.key]}</Link>
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
                children: <SalesDetail data={row} detailData={detailData} />,
              });
            }}
          />

          <IconEditCircle
            cursor={"pointer"}
            color="green"
            onClick={() =>
              modals.open({
                size: "90%",
                title: `Update Sales Order ${row?.orderNo}`,
                children: <SalesForm data={row} action="update" />,
              })
            }
          />
          <UserAction data={row} />
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
            <Button
              onClick={() =>
                modals.open({
                  title: "Create Sales Order",
                  size: "90%",
                  children: <SalesForm action="add" />,
                })
              }
            >
              Create Sales Order
            </Button>
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
