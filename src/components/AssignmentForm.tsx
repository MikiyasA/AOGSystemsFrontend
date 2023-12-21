import { Box, Button, Group, Select, SimpleGrid, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import { IconColorPicker } from "@tabler/icons-react";
import { Color } from '@tiptap/extension-color';
import { useAddAssignmentMutation, useUpdateAssignmentMutation, useUpdateFollowupMutation } from "@/pages/api/apiSlice";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { modals } from "@mantine/modals";


const AssignmentForm = ({data, action}:  any) => {

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id: data.id,
            title: data?.title,
            description: data?.description,
            startDate: data?.startDate,
            dueDate: data?.dueDate,
            expectedFinishedDate: data?.expectedFinishedDate,
            finishedDate: data?.finishedDate,
            status: data?.status
        },
        validate: {
            title: (v: string) => (v?.length < 10 ? 'Title must be provided and should be 10 character minimum' : null),
        }
    })
    useEffect(() => {
        form.setFieldValue('status',data.status === undefined ? 'Created': data.status)
    },[])
    const editor = useEditor({
        extensions: [
          StarterKit,
          Underline,
          Link,
          Superscript,
          SubScript,
          Highlight,
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
          TextStyle,
          Color,
        ],
        content: data.description,
        onUpdate({editor}) {
            form.setValues({ description: editor.getHTML()})
        },
    });

    const [addAssignment, {isLoading: addLoading, error: addError, isSuccess: addSuccess }] = useAddAssignmentMutation()
    const [updateAssignment, {isLoading: updateLoading, error: updateError, isSuccess: updateSuccess} ] = useUpdateAssignmentMutation()

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()
        if(action === 'add'){
            const {data: addReturn}: any = await addAssignment(form.values)
            addReturn?.isSuccess  ? notifications.show({
                title: 'Success',
                message:  addReturn?.message || 'Assignment Add Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  addError?.data?.message || addError?.data?.errors?.Description[0] || addError?.data?.title || 'Error occurs on add Assignment',
                color: 'red',
            })
        } else if (action  === 'update') {
            const {data: updateReturn}: any = await updateAssignment(form.values)
            updateReturn?.isSuccess ? notifications.show({
                title: 'Success',
                message:  updateReturn?.message || 'Assignment updated Successfully 👍',
                color: 'green',
            }) : notifications.show({
                title: 'Failure',
                message:  updateError?.data.message || updateError?.data.title ||'Error occurs on update Assignment',
                color: 'red',
            })
        }
    }

    useEffect(()=>{
        addSuccess && modals.closeAll()
        updateSuccess && modals.closeAll()
    },[addSuccess, updateSuccess])

    console.log({form})


    return(
        <>
        <form onSubmit={handleFormSubmit}>
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4   }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            
            <TextInput 
                label="Title"
                placeholder="Title of Task"
                {...form.getInputProps('title')}
                required
            />
            <DateInput
                label="Start Date"
                placeholder="Task Start Date"
                minDate={new Date()}
                value={form.values.startDate && new Date(form.values.startDate)}
                onChange={(e: any) => form.setValues({startDate: new Date(e && e?.toString())})}
                error={form.errors.startDate}
                clearable
            />
            <DateInput
                label="Due Date"
                placeholder="Task Due Date"
                minDate={new Date()}
                value={form.values.dueDate && new Date(form.values.dueDate)}
                onChange={(e: any) => form.setValues({dueDate: new Date(e.toString())})}
                error={form.errors.dueDate}
                required
                clearable
            />
            <DateInput
                label="Expected Finished Date"
                placeholder="Task Expected Finished Date"
                minDate={new Date()}
                value={form.values.expectedFinishedDate && new Date(form.values.expectedFinishedDate)}
                onChange={(e: any) => form.setValues({expectedFinishedDate: new Date(e.toString())})}
                error={form.errors.expectedFinishedDate}
                clearable
            />
            <DateInput
                label="Finished Date"
                placeholder="Task Finished Date"
                minDate={new Date()}
                value={form.values.finishedDate && new Date(form.values.finishedDate)}
                onChange={(e: any) => form.setValues({finishedDate: new Date(e.toString())})}
                error={form.errors.finishedDate}
                clearable
            />
            <Select
                label="Status"
                placeholder="Status"
                data={['Created', 'Assigned', 'In-work', 'Finished', 'Closed']}
                defaultValue='Created'
                searchable
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps('status')}
                required
            />
        </SimpleGrid>
            <Box mt={20} > Task Description
                <Group w={'100%'}>
                <RichTextEditor editor={editor} w={'98%'} h={'25pc'}
                
                >
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                        <RichTextEditor.H5 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ColorPicker
                            colors={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6',
                            '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14', ]}
                        />

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control interactive={false}>
                            <IconColorPicker size="1rem" stroke={1.5} />
                            </RichTextEditor.Control>
                            <RichTextEditor.Color color="#F03E3E" />
                            <RichTextEditor.Color color="#7048E8" />
                            <RichTextEditor.Color color="#1098AD" />
                            <RichTextEditor.Color color="#37B24D" />
                            <RichTextEditor.Color color="#F59F00" />
                        </RichTextEditor.ControlsGroup>

                        {/* <RichTextEditor. */}

                        <RichTextEditor.UnsetColor />


                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
                </Group>
            </Box>
            <Button type="submit" mt="sm" loading={addLoading || updateLoading}> Submit</Button>
        </form>
        </>
    )
}

export default AssignmentForm