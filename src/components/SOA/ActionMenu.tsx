import { Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBolt } from "@tabler/icons-react";
import { BuyerRemarkForm, FinanceRemarkForm } from "./SOAForms";
import WithComponentAuth from "@/hocs/WithComponentAuth";

const SOAActionMenu = ({ invoiceNo, invoiceId }: any) => {
  return (
    <Menu width={200} shadow="md">
      <Menu.Target>
        <IconBolt />
      </Menu.Target>
      <Menu.Dropdown>
        <WithComponentAuth
          allowedRoles={["Coordinator", "TL", "Management", "Buyer", "Finance"]}
        >
          <Menu.Item
            onClick={() =>
              modals.open({
                title: `Add Buyer Remark for ${invoiceNo}`,
                size: "40%",
                children: (
                  <BuyerRemarkForm invoiceId={invoiceId} action="add" />
                ),
              })
            }
          >
            Add Buyer Remark
          </Menu.Item>
        </WithComponentAuth>
        <WithComponentAuth allowedRoles={["Finance"]}>
          <Menu.Item
            onClick={() =>
              modals.open({
                title: `Add Finance Remark for ${invoiceNo}`,
                size: "40%",
                children: (
                  <FinanceRemarkForm invoiceId={invoiceId} action="add" />
                ),
              })
            }
          >
            Add Finance Remark
          </Menu.Item>
        </WithComponentAuth>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SOAActionMenu;
