import Layout from "@/hocs/Layout"
import { Box, Button, Group, Table, TextInput } from "@mantine/core"
import { useState } from "react"
import { useGetPartByPNQuery, useGetPartByPartialPNQuery } from "../api/apiSlice"
import Link from "next/link"

// interface PartType {
//     [ {
//     partNumber: string,
//     description: string,
//     stockNo: string,
//     financialClass: string,
//     id: number,
//     createdAT: Date,
//     updatedAT: Date,
//     createdBy: Date,
//     updatedBy: Date
//     }
// ]
// }

const PartSearch = () => {

    const [parts, setParts] = useState<any>()
    const [PN, setPN] = useState('')
    const {data, isLoading, isSuccess} = useGetPartByPartialPNQuery(PN)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setParts(data)
    }

    const header = ['No','Part Number', 'Description', 'Stock No', 'Financial Class']
    const rows = parts?.map((el: any, index: any) => {
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
                <Table.Td><Link href={`/part/detail/${el.partNumber}`} >{el.partNumber}</Link></Table.Td>
                <Table.Td>{el.description}</Table.Td>
                <Table.Td>{el.stockNo}</Table.Td>
                <Table.Td>{el.financialClass}</Table.Td>
                {/* <Table.Td>{dateFormatter(el.createdAT)}</Table.Td> */}
            </Table.Tr>
    })

    return(
        <Layout
            title="Part Search"
            description="Part Search">
            
            <Box mx={100} mt={30}  w={'100%'}>
                <Group >
                    <form onSubmit={handleSubmit} style={{display: 'flex', alignItems: 'flex-end', gap: '20px'}}>
                        <TextInput
                            label="Part Number"
                            placeholder="PN to Search"
                            onChange={(e: any) => setPN(e.target.value)}
                            required
                        />
                        <Button type="submit" mt="sm" loading={isLoading}> Submit</Button>
                    </form>
                </Group>
                <hr />
                {isSuccess && 
                <Group w={'100%'}>
                <Table.ScrollContainer minWidth={300} w={'100%'}>
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
                </Group>
                }
            </Box>
        </Layout>
    )
}

export default PartSearch