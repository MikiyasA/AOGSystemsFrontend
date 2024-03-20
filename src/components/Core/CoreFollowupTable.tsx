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
  Modal,
  Title,
  Menu,
  SimpleGrid,
  Select,
  MultiSelect,
  NumberInput,
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
import {
  useGetAllCoreFollowupQuery,
  useGetPartByIdQuery,
} from "@/pages/api/apiSlice";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import CoreForm from "./CoreForm";
import coreClasses from "../../styles/CoreFollowupTable.module.css";
import { DateInput } from "@mantine/dates";
import CoreFollowupDetail from "./CoreFollowupDetail";
import MyLoadingOverlay from "../MyLoadingOverlay";
import Paginate from "../Paginate";
import WithComponentAuth from "@/hocs/WithComponentAuth";

export interface RowData {
  poNo: string;
  poCreatedDate: Date;
  aircraft: string;
  tailNo: string;
  partNumber: string;
  description: string;
  stockNo: string;
  vendor: string;
  partReceiveDate: Date;
  returnDueDate: Date;
  returnProcessedDate: Date;
  awbNo: string;
  returnedPart: string;
  podDate: Date;
  remark: string;
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
  { key: "poNo", value: "PO No" },
  { key: "poCreatedDate", value: "PO Created Date" },
  { key: "aircraft", value: "Air Craft" },
  { key: "tailNo", value: "Tail No" },
  { key: "partNumber", value: "Part Number" },
  { key: "description", value: "Description" },
  { key: "stockNo", value: "Stock No" },
  { key: "vendor", value: "Vendor" },
  { key: "partReleasedDate", value: "Part Released Date" },
  { key: "partReceiveDate", value: "Part Receive Date" },
  { key: "returnDueDate", value: "Return Due Date" },
  { key: "returnProcessedDate", value: "Return Processed Date" },
  { key: "awbNo", value: "AWB No" },
  { key: "returnedPart", value: "Returned Part" },
  { key: "podDate", value: "POD Date" },
  { key: "remarks", value: "Remarks" },
  { key: "status", value: "Status" },
];

export function CoreFollowupTable({
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

  const MAX_CHARACTERS = 30;

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
      <Table.Tr
        key={index}
        style={{ borderRadius: 10 }}
        className={
          isActive && remainingDays < 13
            ? remainingDays < 5
              ? coreClasses.blinkRed
              : coreClasses.blinkYellow
            : ""
        }
      >
        <Table.Td p={5} m={0}>
          {index + 1}
        </Table.Td>
        {table?.map((col: any, index: any) => {
          if (col.key === "airCraft") {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {row[col.key]} s- {row.tailNo}
              </Table.Td>
            );
          } else if (
            col.key === "poCreatedDate" ||
            col.key === "partReceiveDate" ||
            col.key === "returnDueDate" ||
            col.key === "returnProcessedDate" ||
            col.key === "podDate" ||
            col.key === "partReleasedDate"
          ) {
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
          } else {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0}>
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
                  title: "Core Followup Detail",
                  children: (
                    <CoreFollowupDetail data={row} detailData={detailData} />
                  ),
                });
              }}
            />

            <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
              <IconEditCircle
                cursor={"pointer"}
                color="green"
                onClick={() =>
                  modals.open({
                    size: "100%",
                    title: "Update Core FollowUp",
                    children: <CoreForm data={row} action="update" />,
                  })
                }
              />
            </WithComponentAuth>
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
          <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
            <Button
              onClick={() =>
                modals.open({
                  size: "100%",
                  title: "Add Followup",
                  children: <CoreForm data={data} action="add" />,
                })
              }
            >
              Add Core FollowUp
            </Button>
          </WithComponentAuth>
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
