"use-client";
import { useEffect, useState } from "react";
import {
  Box,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  useStyles,
  Button,
  Modal,
  Title,
  Menu,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEditCircle,
  IconEye,
  IconBolt,
} from "@tabler/icons-react";
import classes from "../../styles/Followup.module.css";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import EditFollowup from "./EditFollowup";
import { modals } from "@mantine/modals";
import { title } from "process";
import FollowUpForm from "./AddFollowUp";
import { useForm } from "@mantine/form";
import FollowupDetail from "./FollowupDetail";
import ActionMenu from "./ActionMenu";
import Link from "next/link";
import { formatDate } from "@/config/util";

export interface RowData {
  rid: string;
  requestDate: Date;
  airCraft: string;
  tailNo: string;
  aogStation: string;
  customer: string;
  partNumber: string;
  description: string;
  stockNo: string;
  financialClass: string;
  poNumber: string;
  orderType: string;
  quantity: number | any;
  uom: string;
  vendor: string;
  edd: Date;
  status: string;
  awbNo: string;
  needHigherMgntAttn: boolean;
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
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}
var detailData = [
  { key: "rid", value: "RID" },
  { key: "requestDate", value: "Request Date" },
  { key: "airCraft", value: "Air Craft" },
  { key: "tailNo", value: "Tail No" },
  { key: "aogStation", value: "AOG Station" },
  { key: "customer", value: "Customer" },
  { key: "partNumber", value: "Part Number" },
  { key: "description", value: "Description" },
  { key: "stockNo", value: "Stock No" },
  { key: "poNumber", value: "PO" },
  { key: "orderType", value: "Type" },
  { key: "quantity", value: "Quantity" },
  { key: "vendor", value: "Vendor" },
  { key: "edd", value: "EDD" },
  { key: "awbNo", value: "AWB No" },
  { key: "flightNo", value: "Flight No" },
  { key: "status", value: "Status" },
  { key: "needHigherMgntAttn", value: "Need Higher Mgn Attn" },
  { key: "remarks", value: "Remarks" },
];

export function FollowupTable({ data, tab, table, tableTitle }: any) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const MAX_CHARACTERS = 25;

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

  interface RowColor {
    rowId: string;
    color: string;
  }
  const [rowColors, setRowColors] = useLocalStorage<RowColor>({
    key: "row-color",
  });

  const getColor = (rowId: string) => {
    return rowColors ? rowColors[rowId] || "" : ""; // Default to an empty string if color not set
  };

  const setColor = (rowId: any, color: any) => {
    setRowColors((prevColors: any) => ({
      ...prevColors,
      [rowId]: color,
    }));
  };

  const rows = sortedData?.map((row: any, index: any) => (
    <Table.Tr key={index} style={{ backgroundColor: getColor(row.id) }}>
      <Table.Td p={5} m={0}>
        {index + 1}
      </Table.Td>
      {table?.map((col: any, index: any) => {
        if (col.key === "remarks" && row[col.key][0]) {
          return (
            <Table.Td key={`col-${index}`} p={5} m={0}>
              {row[col.key][0]?.message?.length > MAX_CHARACTERS
                ? `${row[col.key][0]?.message.slice(0, MAX_CHARACTERS)}...` // Truncate content if it exceeds the limit
                : row[col.key][0]?.message}
            </Table.Td>
          );
        } else if (col.key === "airCraft") {
          return (
            <Table.Td key={`col-${index}`} p={5} m={0}>
              {row[col.key]} - {row.tailNo}
            </Table.Td>
          );
        } else if (col.key === "partNumber") {
          return (
            <Table.Td key={`col-${index}`} p={5} m={0}>
              <Link
                href={`/part/detail/${row.partNumber}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {row.partNumber}
              </Link>
            </Table.Td>
          );
        } else if (col.key === "quantity") {
          return (
            <Table.Td key={`col-${index}`} p={5} m={0}>
              {row[col.key]} {row.uom}
            </Table.Td>
          );
        } else if (col.key === "requestDate" || col.key === "edd") {
          return (
            <Table.Td key={`col-${index}`} p={5} m={0}>
              {formatDate(row[col.key])}
            </Table.Td>
          );
        } else if (col.key === "description") {
          return (
            <Table.Td key={`col-${index}`} p={2} m={0}>
              {row[col.key]?.length > MAX_CHARACTERS
                ? `${row[col.key].slice(0, MAX_CHARACTERS)}...` // Truncate content if it exceeds the limit
                : row[col.key]}
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
              title: "Followup Detail",
              children: <FollowupDetail data={row} detailData={detailData} />,
            });
          }}
        />

        <IconEditCircle
          cursor={"pointer"}
          color="green"
          onClick={() =>
            modals.open({
              size: "100%",
              title: "Update FollowUp",
              children: <EditFollowup data={row} tab={tab} />,
            })
          }
        />
        <ActionMenu row={row} setColor={setColor} />
      </Table.Td>
    </Table.Tr>
  ));

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
        <Button
          onClick={() =>
            modals.open({
              size: "100%",
              title: "Add Followup",
              children: <FollowUpForm tab={tab} />,
            })
          }
        >
          Add FollowUp
        </Button>
        <Table.ScrollContainer minWidth={200}>
          <Table
            horizontalSpacing="lg"
            verticalSpacing="xs"
            layout="fixed"
            highlightOnHover
            striped
          >
            <Table.Tbody>
              <Table.Tr>
                <Th>Item#</Th>
                {table?.map((col: any, index: any) => {
                  if (col.key === "remarks") {
                    return <Th key={`coll-${index}`}> {col.value} </Th>;
                  } else {
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
                  }
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
  );
}
