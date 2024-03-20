import { ColorSwatch, Group, Menu, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBolt } from "@tabler/icons-react";
import FollowupDetail from "./FollowupDetail";
import RemarkForm from "./RemarkForm";
import WithComponentAuth from "@/hocs/WithComponentAuth";

const ActionMenu = ({ row, setColor }: any) => {
  const colorList = [
    "Transparent",
    "Green",
    "Yellow",
    "Red",
    "Blue",
    "Pink",
    "Violet",
    "Cyan",
    "Lime",
    "Orange",
  ];
  return (
    <Menu width={200} shadow="md">
      <Menu.Target>
        <IconBolt />
      </Menu.Target>

      <Menu.Dropdown>
        <WithComponentAuth allowedRoles={["Coordinator", "TL"]}>
          <Menu.Item
            onClick={() => {
              modals.open({
                size: "70%",
                title: `Add Remark for RID ${row.rid}`,
                children: <RemarkForm aOGFollowUpId={row.id} action="add" />,
              });
            }}
          >
            Add Remark
          </Menu.Item>
        </WithComponentAuth>

        {setColor && (
          <Menu.Item>
            Set Color for row
            <Group mt={20}>
              {colorList.map((c, i) => (
                <Tooltip key={i} label={c}>
                  <ColorSwatch
                    color={c}
                    onClick={() => {
                      setColor(row.id, c);
                    }}
                  />
                </Tooltip>
              ))}
            </Group>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionMenu;
