import { ColorSwatch, Table } from "@mantine/core"
import TabActionMenu from "./TabActionMenu"
import { useState } from "react"

const CustomTable = ({header, data}: any) => {

    // const [searchData, setSearchData] = useState() // TODO

    // const searchedData = data()


    const rows = data?.map((el: any, index: any) => {
        
        const dateFormatter = (dateIn: any) => {
            const date = new Date(dateIn);
            const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            return formattedDate
        }
        return <Table.Tr key={index}>
                <Table.Td>{index+1}</Table.Td>
                <Table.Td>{el.name}</Table.Td>
                <Table.Td>{el.status}</Table.Td>
                <Table.Td><ColorSwatch color={el.color} /></Table.Td>
                <Table.Td>{dateFormatter(el.createdAT)}</Table.Td>
                <Table.Td>{el.status === 'Closed' ? dateFormatter(el.updatedAT) : 'Open'
                }</Table.Td>
                {/* <Table.Td>{() => dateFormatter(el.createdAt)}</Table.Td> */}
                <Table.Td><TabActionMenu data={el} notAll={true}  /></Table.Td>
            </Table.Tr>
        
    })
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                    {header.map((th: any) => (
                        <Table.Th>{th}</Table.Th>
                    ))}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}

export default CustomTable