import { useListState, randomId } from "@mantine/hooks";
import { Box, Button, Checkbox } from "@mantine/core";
import { modals } from "@mantine/modals";
import InvoiceForm from "./InvoiceForm";

const initialValues = [
  { label: "All Parts include", checked: false, key: randomId() },
  { label: "Receive sms notifications", checked: false, key: randomId() },
  { label: "Receive push notifications", checked: false, key: randomId() },
];

export function RaiseInvoice({ salesOrder, partData }: any) {
  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handlers.setItemProp(index, "checked", event.currentTarget.checked)
      }
    />
  ));

  const checkBox = (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Receive all notifications"
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      <>{items}</>
    </>
  );

  return (
    <>
      <Button
        onClick={() => {
          modals.openConfirmModal({
            title: "Please confirm your action",
            confirmProps: { disabled: allChecked },
            labels: { confirm: "Confirm", cancel: "Cancel" },
            children: <Box>{checkBox}</Box>,
            onConfirm() {
              modals.open({
                title: `Raise Invoice For ${salesOrder?.orderNo}`,
                size: "90%",
                children: (
                  <InvoiceForm
                    action="add"
                    data={salesOrder}
                    partData={partData}
                    orderType="sales"
                  />
                ),
              });
            },
          });
        }}
      >
        Raise Invoice
      </Button>
    </>
  );
}
