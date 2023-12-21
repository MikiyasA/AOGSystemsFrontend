import PartForm from "@/components/PartForm"
import Layout from "@/hocs/Layout"
import { Group } from "@mantine/core"


const AddPart = () => {

    return(
        <Layout
            title='Add Part'
            description='Add Part'
        >
            <Group style={{marginLeft: '10pc', width: '80%'}}>
                <PartForm
                    action='add'
                />
            </Group>
        </Layout>
    )
}

export default AddPart