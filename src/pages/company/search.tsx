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
import withAuth from "@/hocs/withAuth";

const SearchCompany = () => {
  const [company, setCompany] = useState<any>();
  const [companies, setCompanies] = useState<any>();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [searchBy, setSearchBy] = useState("Name");

  const {
    data: codeData,
    isLoading,
    isSuccess,
  } = useGetCompanyByCodeQuery(code);
  const {
    data: nameData,
    isLoading: nameLoading,
    isSuccess: nameSuccess,
  } = useGetCompanyByNameQuery(name);

  const handleChange = (e: any) => {
    e.preventDefault();
    if (searchBy === "Code") {
      setCode(e.target.value);
    } else if (searchBy === "Name") {
      setName(e.target.value);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (searchBy === "Code") {
      // setName("");
      setCompanies(codeData);
    } else if (searchBy === "Name") {
      // setCode("");
      setCompanies(nameData);
    }
    // setCompany(codeData || nameData);
  };

  const header = [
    "No",
    "Company Code",
    "Company Name",
    "Address",
    "Country",
    "Payment Term",
  ];
  const rows = companies?.map((el: any, index: any) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Link href={`/company/detail/${el.id}`}>{el.code}</Link>
        </Table.Td>
        <Table.Td>{el.name}</Table.Td>
        <Table.Td>{el.address}</Table.Td>
        <Table.Td>{el.country}</Table.Td>
        <Table.Td>{el.paymentTerm}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Layout title="Company Search" description="Company Search">
      {isLoading && <MyLoadingOverlay />}
      <Box mx={100} mt={30} w={"100%"}>
        <Group>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}
          >
            <Group>
              <Select
                label="Search Parameter"
                placeholder="Search by"
                data={["Name", "Code"]}
                defaultValue={"Name"}
                onChange={(e: any) => setSearchBy(e)}
                required
                allowDeselect={false}
              />
              <TextInput
                label="Company Code"
                placeholder="Code to Search"
                onChange={handleChange}
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
        {
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
        }
      </Box>
    </Layout>
  );
};

export default withAuth(SearchCompany, ["Coordinator", "TL", "Management"]);
