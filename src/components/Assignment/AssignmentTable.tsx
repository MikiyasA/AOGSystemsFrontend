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
  Button,
  Title,
  Box,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEditCircle,
  IconEye,
} from "@tabler/icons-react";
import classes from "../../styles/Followup.module.css";
import { modals } from "@mantine/modals";
import coreClasses from "../../styles/CoreFollowupTable.module.css";
import AssignmentDetail from "./AssignmentDetail";
import AssignmentForm from "./AssignmentForm";
import { formatDate, getUserNameById } from "@/config/util";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/pages/api/apiSlice";
import Paginate from "../Paginate";

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
  { key: "title", value: "Title" },
  { key: "startDate", value: "Start Date" },
  { key: "dueDate", value: "Due Date" },
  { key: "expectedFinishedDate", value: "Expected Finished Date" },
  { key: "finishedDate", value: "Finished Date" },
  { key: "status", value: "Status" },
  { key: "description", value: "Description" },
];

export function AssignmentTable({
  data,
  table,
  tableTitle,
  isActive,
  metadata,
  form,
}: any) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<any>();
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

  const { data: users } = useGetAllUsersQuery("");

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
          remainingDays < 13
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
          if (
            col.key === "startDate" ||
            col.key === "dueDate" ||
            col.key === "expectedFinishedDate" ||
            col.key === "reAssignedAt" ||
            col.key === "reOpenedAt" ||
            col.key === "closedAt" ||
            col.key === "finishedDate"
          ) {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {formatDate(row[col.key])}
              </Table.Td>
            );
          } else if (
            col.key === "startBy" ||
            col.key === "finishedBy" ||
            col.key === "assignedTo" ||
            col.key === "reAssignedTo" ||
            col.key === "reAssignedBy" ||
            col.key === "reOpenedBy" ||
            col.key === "closedBy"
          ) {
            return (
              <Table.Td key={`col-${index}`} p={5} m={0}>
                {getUserNameById(users, row[col.key])}
              </Table.Td>
            );
          } else if (col.key === "title") {
            return (
              <Table.Td key={`col-${index}`} p={2} m={0}>
                <Link href={`/assignment/detail/${row.id}`}>
                  {row[col.key]}
                </Link>
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
                  title: "Assignment Detail",
                  children: (
                    <AssignmentDetail data={row} detailData={detailData} />
                  ),
                });
              }}
            />

            <IconEditCircle
              cursor={"pointer"}
              color="green"
              onClick={() =>
                modals.open({
                  size: "100%",
                  title: "Update Assignment",
                  children: <AssignmentForm data={row} action="update" />,
                })
              }
            />
            {/* <ActionMenu row={row}/> */}
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
          <Button
            onClick={() =>
              modals.open({
                size: "100%",
                title: "Add Assignment",
                children: <AssignmentForm data={data} action="add" />,
              })
            }
          >
            Add Assignment
          </Button>
        )}
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
