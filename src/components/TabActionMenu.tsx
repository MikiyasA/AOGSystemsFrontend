import { Menu, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconBolt, IconEditCircle, IconEye, IconList } from "@tabler/icons-react"
import { notifications } from '@mantine/notifications'
import TabForm from "./TabForm"
import TabDetail from "./TabDetail"
import CustomTable from "./CustomTable"
import { useGetAllTabsQuery } from "@/pages/api/apiSlice"

const TabActionMenu = ({data, notAll}: any) => {
  
  const tableHeader = ["No", "Name", "Status", "Color", "Created Date", "Closed Date", "Action"]

  const {data: allTabs, isSuccess} = useGetAllTabsQuery('')

    return(
        <Menu width={200} shadow="md">
                <Menu.Target>
                  <IconBolt color={data?.color} style={{  placeSelf: 'center', margin: '0 20px 0 0'}} />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item  onClick={() => {
                      modals.open({
                      size: '50%',
                      title: 'Tab Detail',
                      children: (
                        <TabDetail data={data} />
                      ),
                      })}
                  }  leftSection={<IconEye color={data?.color} />}> Tab Detail
                  </Menu.Item>

                  <Menu.Item  onClick={() => {
                    modals.open({
                    size: '50%',
                    title: 'Update Tab',
                    children: (
                      <TabForm data={data} action='update' />
                    ),
                    })}
                  }  leftSection={<IconEditCircle color={data?.color} />}> Update Tab
                  </Menu.Item>
                  {!notAll && isSuccess &&
                    <Menu.Item  onClick={() => {
                      modals.open({
                      size: '50%',
                      title: 'All Tabs',
                      children: (
                        <CustomTable data={allTabs} header={tableHeader} />
                      ),
                      })}
                    }  leftSection={<IconList color={data?.color} />}> All Tabs
                    </Menu.Item>
                  }

                
            </Menu.Dropdown>
        </Menu>
    )
}

export default TabActionMenu