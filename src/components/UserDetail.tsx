import { Box, Group, SimpleGrid, Title } from "@mantine/core";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";

const UserDetail = ({data, detailData}: any) =>{

    return(
        <>
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            {detailData?.map((d: any) => {
                return(
                <Group display={'grid'} w={'max-content'} gap={2} style={{ alignContent:'baseline'}}>
                    {d.key !== "description" && <Title order={5} fw={600}>{d.value}</Title>}
                    <Title order={6} fw={"normal"}  pl={10}>
                    
                    {d.key === "createdAT" || d.key === "updatedAT" ? (
                            (() => {
                                const date = new Date(data[d.key]);
                                const formattedDate = date.toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                });
                                return formattedDate;
                            })()
                        ) : d.key === "isActive" ? <>
                                {d.isActive === true ? <IconCircleCheckFilled style={{color: 'green'}}/> :  <IconCircleXFilled style={{color: 'red'}}/>}
                            </> 
                        : data[d.key]
                    }
                    {/* {d.isActive === "isActive" ?  <IconCircleCheckFilled style={{color: 'green'}}/> : <IconCircleXFilled style={{color: 'red'}}/>} */}
                    </Title>
                </Group>
            )})
        
            }
        </SimpleGrid>
        
        </>
    )
}

export default UserDetail