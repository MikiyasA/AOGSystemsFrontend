import { useAddPartMutation, useUpdatePartMutation } from "@/pages/api/apiSlice"
import { Box, Button, SimpleGrid, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"


const PartForm = ({data, action}: any) => {

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id: data?.id,
            partNumber: data?.partNumber,
            description: data?.description,
            stockNo: data?.stockNo,
            financialClass: data?.financialClass,
        },
    })

    const [addPart, {isLoading: addIsLoading, isSuccess: addIsSuccess, error: addError}] = useAddPartMutation()
    const [updatePart, {isLoading: updateIsLoading, isSuccess: updateIsSuccess, error: updateError}] = useUpdatePartMutation()

    const handleFormSubmit = async (e:any) =>{
        e.preventDefault()
        if(action === 'add'){
            const addReturn = await addPart(form.values).unwrap()
            addReturn.isSuccess ? notifications.show({
                title: 'Success',
                message:  addReturn?.message || 'Part Add Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  addError?.message || 'Error occurs on add Part',
                color: 'red',
            })
        } else if (action  === 'update') {
            const updateReturn = await updatePart(form.values).unwrap()
            console.log(updateReturn)
            updateReturn.isSuccess ? notifications.show({
                title: 'Success',
                message:  updateReturn?.message || 'Part Add Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  updateError?.data.message || 'Error occurs on add Part',
                color: 'red',
            })
        }
    }
    addIsSuccess && modals.closeAll()
    updateIsSuccess && modals.closeAll()
    return(
        <Box w={'100%'}>
            <form onSubmit={handleFormSubmit}>
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 3 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing={{ base: 'md', sm: 'xl' }}
                    >
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
                        label="Financial Class"
                        placeholder="Financial Class"
                        {...form.getInputProps('financialClass')}
                    />
                
                </SimpleGrid>
            <Button type="submit" mt="sm" loading={addIsLoading || updateIsLoading}> Submit</Button>
            </form>
        </Box>
    )
}

export default PartForm