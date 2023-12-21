import { ColorSwatch, Group, SimpleGrid, Title } from "@mantine/core"


const TabDetail = ({data}: any) => {

    return (
        <SimpleGrid
        cols={{ base: 1, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
        <Group display={'grid'} w={'max-content'} gap={2} style={{ alignContent:'baseline'}}>
            <Title order={5} fw={600}>Name</Title>
            <Title order={6} fw={"normal"}  pl={10}>{data?.name}</Title>
        </Group>

        <Group display={'grid'} w={'max-content'} gap={2} style={{ alignContent:'baseline'}}>
            <Title order={5} fw={600}>Status</Title>
            <Title order={6} fw={"normal"}  pl={10}>{data?.status}</Title>
        </Group>

        <Group display={'grid'} w={'max-content'} gap={2} style={{ alignContent:'baseline'}}>
            <Title order={5} fw={600}>Total No Request</Title>
            <Title order={6} fw={"normal"}  pl={10}>{data?.followUps.length}</Title>
        </Group>

        <Group display={'grid'} w={'max-content'} gap={2} style={{ alignContent:'baseline'}}>
            <Title order={5} fw={600}>Tab Color</Title>
            <Title order={6} fw={"normal"}  pl={10}><ColorSwatch color={data?.color} /></Title>
        </Group>

        </SimpleGrid>
    )
}

export default TabDetail