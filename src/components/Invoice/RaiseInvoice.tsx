import { useListState, randomId } from "@mantine/hooks";
import { Box, Button, Checkbox } from "@mantine/core";
import { modals } from "@mantine/modals";
import InvoiceForm from "./InvoiceForm";
import { useEffect, useState } from "react";

const initialValues = [
  {
    label: "Is the price and quantity confirmed and correct?",
    checked: false,
    key: randomId(),
  },
  {
    label: "Is the part shipped and information is updated properly?",
    checked: false,
    key: randomId(),
  },
  {
    label: "Is the part returned and information is updated properly?",
    checked: false,
    key: randomId(),
  },
  {
    label: "RID and SN is updated for all line item to be invoiced?",
    checked: false,
    key: randomId(),
  },
  {
    label: "Is all charges are included and correct?",
    checked: false,
    key: randomId(),
  },
];

export function IndeterminateCheckbox() {
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

  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Make sure the below actions are taken before rasing the invoice"
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      {items}
    </>
  );
}

export function RaiseInvoice({ order, partData, orderType }: any) {
  return (
    <>
      <Button
        onClick={() => {
          modals.openConfirmModal({
            size: "40%",
            title:
              "Make sure the below actions are taken before rasing the invoice",
            // confirmProps: { disabled: allChecked },
            labels: { confirm: "Confirm", cancel: "Cancel" },
            children: <IndeterminateCheckbox />,
            onConfirm() {
              modals.open({
                title: `Raise Invoice For ${order?.orderNo}`,
                size: "100%",
                children: (
                  <InvoiceForm
                    action="add"
                    data={order}
                    partData={partData}
                    orderType={orderType}
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
