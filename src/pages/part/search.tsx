import Layout from "@/hocs/Layout";
import { Box, Button, Group, Select, Table, TextInput } from "@mantine/core";
import { useState } from "react";
import {
  useGetCompanyByCodeQuery,
  useGetCompanyByNameQuery,
  useGetPartByPNQuery,
  useGetPartByPartialPNQuery,
} from "../api/apiSlice";
import Link from "next/link";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";

const SearchCompany = () => {
  const [partToBeSearched, setPartToBeSearched] = useState<any>();
  const [part, setPart] = useState<any>();

  console.log({ partToBeSearched });
  console.log({ part });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPart(partToBeSearched);
  };
  const {
    data: parts,
    isLoading,
    isSuccess,
  } = useGetPartByPartialPNQuery(part);

  const header = [
    "No",
    "Part Number",
    "Description",
    "Stock No",
    "Manufacturer",
    "Financial Class",
    "Part Type",
  ];
  const rows = parts?.map((el: any, index: any) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Link href={el.id ? `/part/detail/${el.id}` : ""}>
            {el.partNumber}
          </Link>
        </Table.Td>
        <Table.Td>{el.description}</Table.Td>
        <Table.Td>{el.stockNo}</Table.Td>
        <Table.Td>{el.manufacturer}</Table.Td>
        <Table.Td>{el.financialClass}</Table.Td>
        <Table.Td>{el.partType}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Layout title="Search Parts" description="Search Parts">
      {isLoading && <MyLoadingOverlay />}
      <Box mx={100} mt={30} w={"100%"}>
        <Group>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}
          >
            <Group>
              <TextInput
                label="Part Number"
                placeholder="Part Number Search"
                onChange={(e: any) => setPartToBeSearched(e.target.value)}
                required
              />
            </Group>

            <Button type="submit" mt="sm" loading={isLoading}>
              {" "}
              Submit
            </Button>
          </form>
        </Group>
        <hr />
        {isSuccess && (
          <Group w={"100%"}>
            <Table.ScrollContainer minWidth={300} w={"100%"}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {header.map((th: any, i: any) => (
                      <Table.Th key={i}>{th}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Group>
        )}
      </Box>
    </Layout>
  );
};

export default SearchCompany;
