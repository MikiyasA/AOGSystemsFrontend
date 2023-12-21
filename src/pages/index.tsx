import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/hocs/Layout'
import { FollowupTable } from '@/components/FollowupTable'
import { useGetAllActiveFollowUpsQuery, useGetAllActiveFollowUpsTabsQuery, useGetPartByIdQuery } from './api/apiSlice'
import { Box, Group, Tabs } from '@mantine/core'
import { IconBold, IconBolt, IconChecklist, IconCirclePlus, IconEyeCheck, IconEyeExclamation, IconSettingsBolt } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import TabForm from '@/components/TabForm'
import TabActionMenu from '@/components/TabActionMenu'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  var {data, isSuccess, isLoading, isFetching} = useGetAllActiveFollowUpsQuery('')
 
  isFetching && console.log("is fetching")

  var homeBaseTable = [
    {key: "rid", value: "RID"},
    {key: "airCraft", value: "A/C"},
    {key: "customer", value: "Customer"},
    {key: "partNumber", value: "PN"},
    {key: "description", value: "Description"},
    {key: "stockNo", value: "STK#"},
    {key: "poNumber", value: "PO"},
    {key: "orderType", value: "Type"},
    {key: "quantity", value: "Qty"},
    {key: "vendor", value: "Vendor"},
    {key: "edd", value: "EDD"},
    {key: "awbNo", value: "AWB No"},
    {key: "remarks", value: "Remarks"},
  ]

  var outStationTable = [
    {key: "aogStation", value: "AOG Station"},
    ...homeBaseTable,
  ]

  var receivingTable = [
    {key: "rid", value: "RID"},
    {key: "airCraft", value: "A/C"},
    {key: "customer", value: "Customer"},
    {key: "partNumber", value: "PN"},
    {key: "description", value: "Description"},
    {key: "poNumber", value: "PO"},
    {key: "quantity", value: "Qty"},
    {key: "vendor", value: "Vendor"},
    {key: "awbNo", value: "AWB No"},
    {key: "edd", value: "EDD"},
    {key: "remarks", value: "Remarks"},
  ]

  // const outStationData = data?.filter((w: any) => w.workLocation === 'Out Station' && w.status !== 'Under Receiving')
  // const homeBaseData = data?.filter((w: any) => w.workLocation === 'Home Base' && w.status !== 'Under Receiving')
  // const toolData = data?.filter((w: any) => w.workLocation === 'Tool' && w.status !== 'Under Receiving')

  // const underReceivingData = data?.filter((w: any) => w.status === 'Under Receiving')
  
  const needHigherMgntAttnData = data?.filter((w: any) => w.needHigherMgntAttn === true)

  const {data: activeTabs, isLoading: tabIsLoading, isSuccess: tabIsSuccess} = useGetAllActiveFollowUpsTabsQuery('')

  return (
    <Layout 
    title='AOG Follow Up'
    description='Follow Up table '
    >
      <Group> <hr/>
        <Tabs defaultValue="Main Follow-up" color='green'>

          {tabIsSuccess &&
          <Tabs.List  >
            <Tabs.Tab color='green' value="needHigherMgntAttn" leftSection={<IconEyeCheck color='green'/>}>
              Needs High Mgnt Attention
            </Tabs.Tab>
            {activeTabs.map((tab: any, index: any) => (
              <Group key={index}>
              <Tabs.Tab key={index} color={tab.color} value={tab.name} leftSection={<IconChecklist color={tab.color}/>}>
                  {tab.name} 
                </Tabs.Tab>
                  {/* <IconBolt color='green' style={{  placeSelf: 'center', margin: '0 20px 0 0'}} 
                    onClick={() => alert()}
                  /> */}
                  <TabActionMenu data={tab} />
              </Group>
              ))}
              <IconCirclePlus color='green' cursor={'pointer'}
                onClick={() => modals.open({
                  size: '60%',
                  title: 'Followup Detail',
                  children: (
                    <TabForm action='add'/>
                  ),
                })}
              />
          </Tabs.List>}
            
            <Tabs.Panel value="needHigherMgntAttn">
              <FollowupTable 
                  data={needHigherMgntAttnData} 
                  table={homeBaseTable}
                  tableTitle="Followups Needs High Management Attention" />
            </Tabs.Panel>
              {activeTabs?.map((tab: any, index: any) => (
                <Tabs.Panel key={index-1} value={tab.name}>
                <Group mt={30}>
                  {isSuccess && (
                    <>
                    {tab.name === 'Main Follow-up'  ? (<>
                    <FollowupTable 
                      tab={tab}
                      data={tab?.followUps.filter((w: any) => w.workLocation === 'Out Station' && w.status !== 'Under Receiving')} 
                      table={outStationTable}
                      tableTitle="Out Station Followup" 
                    />
                    <FollowupTable 
                      tab={tab}
                      data={tab?.followUps.filter((w: any) => w.workLocation === 'Home Base' && w.status !== 'Under Receiving')} 
                      table={homeBaseTable}
                      tableTitle="Home Base Followup" 
                    />
                    <FollowupTable 
                      tab={tab}
                      data={tab?.followUps.filter((w: any) => w.status === 'Under Receiving')} 
                      table={receivingTable}
                      tableTitle="Part Under Receiving" 
                    />
                    </>) : (
                      <FollowupTable 
                        tab={tab}
                        data={tab?.followUps} 
                        table={homeBaseTable}
                        tableTitle={tab.name} 
                      />
                    )}
                    </>
                  )}
                </Group>
                </Tabs.Panel> )
              )}
        </Tabs>

      </Group>
    </Layout>
  )
}
