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
          .localeCompare(a[sortBy]?.toLocaleString());
      }

      return a[sortBy]
        ?.toLocaleString()
        .localeCompare(b[sortBy]?.toLocaleString());
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
  { key: "partReceiveDate", value: "Part Receive Date" },
  { key: "returnDueDate", value: "Return Due Date" },
  { key: "returnProcessedDate", value: "Return Processed Date" },
  { key: "awbNo", value: "AWB No" },
  { key: "returnedPart", value: "Returned Part" },
  { key: "podDate", value: "POD Date" },
  { key: "remarks", value: "Remarks" },
  { key: "status", value: "Status" },
];

export function CoreFollowupTable({ data, table, tableTitle, isActive }: any) {
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
            col.key === "podDate"
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
            {/* <ActionMenu row={row}/> */}
          </Table.Td>
        )}
      </Table.Tr>
    );
  });

  const filterForm = useForm({
    validateInputOnBlur: true,
    initialValues: {
      createdStartDate: null,
      createdEndDate: null,
      returnStartDate: null,
      returnEndDate: null,
      podStartDate: null,
      podEndDate: null,
      status: null,
      airCraft: "",
      tailNo: "",
      pn: "a",
      vendor: "s",
      awbNo: "v",
      returnPart: "",
      pageSize: 0,
    },
    validate: {
      pn: (v: string) =>
        v?.length < 4
          ? "PN must be provided and should be 4 character minimum"
          : null,
    },
  });
  console.log("filterForm", filterForm);
  const [tableData, setTableData] = useState(table);

  table = tableData;
  const {
    data: filterQueryData,
    isLoading: filterIsLoading,
    refetch,
  } = useGetAllCoreFollowupQuery(filterForm.values);

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    refetch();
    setTableData(filterQueryData);
  };

  return (
    <Box mx={30}>
      {filterIsLoading && <MyLoadingOverlay />}
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
              children: <CoreForm data={data} action="add" />,
            })
          }
        >
          Add Core FollowUp
        </Button>

        {!isActive && (
          <Group mb={50}>
            <Title order={5}>Filter Option</Title>
            <form onSubmit={handleFilterSubmit}>
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 5 }}
                spacing={{ base: 10, sm: "sm" }}
                verticalSpacing={{ base: "xs", sm: "xs" }}
                style={{ alignItems: "center" }}
              >
                <Group>
                  By Created Date
                  <Group
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50% 50%",
                      gap: "3px",
                    }}
                  >
                    <DateInput
                      label="From"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick Start Date to filtered by Created Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          createdStartDate: new Date(e?.toString()),
                        })
                      }
                      error={filterForm.errors.createdStartDate}
                      clearable
                    />
                    <DateInput
                      label="To"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick End Date to filtered by Created Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          createdEndDate: new Date(e.toString()),
                        })
                      }
                      error={filterForm.errors.createdEndDate}
                      clearable
                    />
                  </Group>
                </Group>

                <Group>
                  By Return Date
                  <Group
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50% 50%",
                      gap: "3px",
                    }}
                  >
                    <DateInput
                      label="From"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick Start Date to filtered by Return Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          returnStartDate: new Date(e.toString()),
                        })
                      }
                      error={filterForm.errors.returnStartDate}
                      clearable
                    />
                    <DateInput
                      label="To"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick End Date to filtered by Return Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          returnEndDate: new Date(e.toString()),
                        })
                      }
                      error={filterForm.errors.returnEndDate}
                      clearable
                    />
                  </Group>
                </Group>

                <Group>
                  By POD Date
                  <Group
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50% 50%",
                      gap: "3px",
                    }}
                  >
                    <DateInput
                      label="From"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick Start Date to filtered by POD Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          podStartDate: new Date(e.toString()),
                        })
                      }
                      error={filterForm.errors.podStartDate}
                      clearable
                    />
                    <DateInput
                      label="To"
                      valueFormat="DD-MMM-YYYY"
                      placeholder="Pick End Date to filtered by POD Date"
                      onChange={(e: any) =>
                        filterForm.setValues({
                          podEndDate: new Date(e.toString()),
                        })
                      }
                      error={filterForm.errors.podEndDate}
                      clearable
                    />
                  </Group>
                </Group>

                <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                    "Part Received",
                    "Part Installed",
                    "Awaiting Core Unit",
                    "Document Sent",
                    "Under Shipping",
                    "Delivered To Supplier",
                    "Closed",
                  ]}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...filterForm.getInputProps("status")}
                  style={{ alignSelf: "end" }}
                />
                <TextInput
                  label="Tail No"
                  placeholder="Tail No"
                  {...filterForm.getInputProps("tailNo")}
                />
                <TextInput
                  label="Part Number"
                  placeholder="Part Number"
                  {...filterForm.getInputProps("pn")}
                />
                <TextInput
                  label="Vendor"
                  placeholder="Vendor"
                  {...filterForm.getInputProps("vendor")}
                />
                <TextInput
                  label="AWB"
                  placeholder="AWB"
                  {...filterForm.getInputProps("awbNo")}
                />
                <TextInput
                  label="Returned Part"
                  placeholder="Returned Part"
                  {...filterForm.getInputProps("returnPart")}
                />
                <NumberInput
                  label="Row per Page"
                  suffix="  Pages"
                  defaultValue={10}
                  min={10}
                  style={{}}
                  w={120}
                  {...filterForm.getInputProps("pageSize")}
                />
                <Button type="submit" mt="sm" loading={false}>
                  {" "}
                  Submit
                </Button>
              </SimpleGrid>
            </form>
          </Group>
        )}

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
