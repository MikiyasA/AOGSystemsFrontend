import { useAddCoreFollowupMutation, useAddRemarkMutation, useGetAllActiveFollowUpsTabsQuery, useGetPartByIdQuery, useUpdateCoreFollowupMutation, useUpdateFollowupMutation } from "@/pages/api/apiSlice";
import { Box, Button, Checkbox, Group, NumberInput, Select, SimpleGrid, Stack, TextInput } from "@mantine/core"
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from "@mantine/modals";
import { IconSelectAll } from "@tabler/icons-react";
import { Input } from "postcss";
import { useEffect } from "react";
import FollowUpForm from "./AddFollowUp";
import { notifications } from "@mantine/notifications";
import { UpdateFollowupRType } from "@/config/type";

interface RowData {
    rid: string;
    requestDate: Date;
    airCraft: string;
    tailNo: string;
    workLocation: string;
    aogStation: string;
    customer: string;
    partNumber: string;
    description: string;
    stockNo: string;
    financialClass: string;
    poNumber: string;
    orderType: string;
    quantity: number | any;
    uom: string;
    vendor: string;
    edd: Date | null | undefined;
    status: string;
    awbNo: string;
    needHigherMgntAttn: boolean;
  }


const CoreForm = ({data, action}: any) => {

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id: data?.id,
            poNo: data?.poNo,
            poCreatedDate: data?.poCreatedDate,
            aircraft: data?.aircraft,
            tailNo: data?.tailNo,
            partNumber: data?.partNumber,
            description: data?.description,
            stockNo: data?.stockNo,
            vendor: data?.vendor,
            partReceiveDate: data?.partReceiveDate,
            returnDueDate: data?.returnDueDate,
            returnProcessedDate: data?.returnProcessedDate,
            awbNo: data?.awbNo,
            returnedPart: data?.returnedPart,
            podDate: data?.podDate,
            remark: data?.remark,
            status: data?.status
        },
        validate: {
            // rid: (v) => (v?.length < 4 ? 'RID must be provided and should be 4 character minimum' : null),
            // requestDate: (v) => (v === null ? 'Request Date is mandatory' : null)

        }
    })
    const [addCoreFollowup, {isLoading: addCFisLoading, isSuccess: addCFisSuccess, error: addError}] = useAddCoreFollowupMutation()
    const [updateCoreFollowup, {isLoading: updateCFisLoading, isSuccess: updateCFisSuccess, error: updateError}] = useUpdateCoreFollowupMutation()

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()
        if(action === 'add'){
            const {data: addReturn}: any = await addCoreFollowup(form.values)
            addReturn?.isSuccess ? notifications.show({
                title: 'Success',
                message:  addReturn?.message || 'Core Followup Add Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  addError?.data?.message || 'Error occurs on add Core Followup',
                color: 'red',
            })
        } else if (action  === 'update') {
            const {data: updateReturn}: any = await updateCoreFollowup(form.values)
            updateReturn?.isSuccess ? notifications.show({
                title: 'Success',
                message:  updateReturn?.message || 'Core Followup Add Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  updateError?.data.message || updateError?.data.title ||'Error occurs on update Core Followup',
                color: 'red',
            })
        }
    }

    useEffect(()=>{
        addCFisSuccess || updateCFisSuccess && modals.closeAll()
    },[addCFisSuccess, updateCFisSuccess])

   
    return(
        <>
        <form onSubmit={handleFormSubmit}>
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            
            <TextInput 
                 label="PO No"
                placeholder="Order No"
                {...form.getInputProps('poNo')}
                required
            />
            <DateInput
                label="PO Created Date"
                 placeholder="Order Created Date"
                defaultValue={new Date()}
                value={form.values.poCreatedDate && new Date(form.values.poCreatedDate)}
                onChange={(e: any) => form.setValues({poCreatedDate: new Date(e.toString())})}
                error={form.errors.poCreatedDate}
                required
            />
            <Select
                label="Aircraft Type"
                placeholder="Pick Aircraft"
                data={['A350', 'B737', 'B777', 'B787', 'Q400', 'B767', 'B757']}
                searchable
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps('aircraft')}
                required
            />
            <TextInput 
                label="Tail No"
                placeholder="Tail No"
                 {...form.getInputProps('tailNo')}
                 required
            />
            <TextInput 
                 label="Part Number"
                placeholder="Part Number"
                 {...form.getInputProps('partNumber')}
                 required
            />
            <TextInput 
                 label="Description"
                placeholder="Description"
                 {...form.getInputProps('description')}
                 required
            />
            <TextInput 
                 label="Stock No"
                placeholder="Stock No"
                 {...form.getInputProps('stockNo')}
            />
            <TextInput 
                label="Vendor"
                placeholder="Vendor"
                 {...form.getInputProps('vendor')}
                 required
            />
            <DateInput
                label="Part Receive Date"
                 placeholder="Part Receive Date"
                defaultValue={new Date()}
                value={form.values.partReceiveDate && new Date(form.values.partReceiveDate)}
                onChange={(e: any) => form.setValues({partReceiveDate: new Date(e.toString())})}
                error={form.errors.partReceiveDate}
                clearable
            />
            <DateInput
                label="Return Due Date"
                 placeholder="Return Due Date"
                defaultValue={new Date()}
                value={form.values.returnDueDate && new Date(form.values.returnDueDate)}
                onChange={(e: any) => form.setValues({returnDueDate: new Date(e.toString())})}
                error={form.errors.returnDueDate}
                clearable
            />
            <DateInput
                label="Return Processed Date"
                 placeholder="Return Processed Date"
                defaultValue={new Date()}
                value={form.values.returnProcessedDate && new Date(form.values.returnProcessedDate)}
                onChange={(e: any) => form.setValues({returnProcessedDate: new Date(e.toString())})}
                error={form.errors.returnProcessedDate}
                clearable
            />
            <TextInput 
                label="AWB"
                placeholder="AWB"
                 {...form.getInputProps('awbNo')}
            />
            <TextInput 
                label="Returned Part"
                placeholder="Returned Part"
                 {...form.getInputProps('returnedPart')}
            />
            <DateInput
                label="POD Date"
                placeholder="POD Date"
                value={form.values.podDate && new Date(form.values.podDate)}
                onChange={(e: any) => {                        
                        const dateValue = e ? new Date(e?.toString()) : null;
                        form.setValues({ podDate: dateValue }); }}
                error={form.errors.podDate}
                clearable
            />
            <Select
                label="Status"
                placeholder="Order Type"
                data={['Part Received', 'Part Installed', 'Awaiting Core Unit', 'Document Sent', 'Under Shipping', 'Delivered To Supplier', 'Closed']}
                allowDeselect={false}
                searchable
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps('status')}
            />
            
            <Select
                // label="Status"
                label={form.getInputProps('status').value ? "Status" : "Select an Option"}
                placeholder="Status"
                data={['Request Received', 'On Quote', 'Order Placed', 'On Hold', 'Under Shipping', 'Under Receiving', 'Received', 'Received & Advised', 'Closed']}
                defaultValue="Request Received"
                searchable
                nothingFoundMessage="Nothing found..."
                // allowDeselect={false}
                {...form.getInputProps('status')}
            />
            
            <TextInput 
                label="Remark"
                placeholder="Remark"
                 {...form.getInputProps('remark')}
            />
            </SimpleGrid>
            <Button type="submit" mt="sm" loading={addCFisLoading || updateCFisLoading}> Submit</Button>
            </form>
        </>
    )
}
export default CoreForm