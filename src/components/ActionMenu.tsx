import { ColorSwatch, Group, Menu, Text, Tooltip } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconBolt } from "@tabler/icons-react"
import FollowupDetail from "./FollowupDetail"
import { notifications } from '@mantine/notifications'


const ActionMenu = ({row, setColor}: any) => {

  const colorList = ['Transparent', 'Green', 'Yellow', 'Red', 'Blue', 'Pink',  'Violet', 'Cyan', 'Lime', 'Orange']
  return (
      <Menu width={200} shadow="md">
              <Menu.Target>
                <IconBolt />
              </Menu.Target>
      
              <Menu.Dropdown>
                <Menu.Item  onClick={() => {
                  modals.open({
                  size: '70%',
                  title: 'Followup Detail',
                  children: (
                    <FollowupDetail data={row} />
                  ),
                  })}
              }  >
                  Followup Detail
                </Menu.Item>

                <Menu.Item>
                  Set Color for row
                  <Group mt={20}>
                    {colorList.map((c, i) => (
                      <Tooltip key={i} label={c}>
                        <ColorSwatch color={c}
                          onClick={() => {
                            setColor(row.id, c)
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Group>
                </Menu.Item>

                </Menu.Dropdown>
              </Menu>

  )
}

export default ActionMenu