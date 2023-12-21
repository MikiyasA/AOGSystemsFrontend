import { useEffect, useState } from 'react';
import { Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Title,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconEditCircle, IconEye, IconBolt, IconCircleFilled, IconCircleXFilled, IconCircleCheckFilled } from '@tabler/icons-react';
import classes from '../styles/Followup.module.css';
import { } from '@/pages/api/apiSlice';
import { modals } from '@mantine/modals';
import ActionMenu from './ActionMenu';
import coreClasses from '../styles/CoreFollowupTable.module.css'
import AssignmentDetail from './AssignmentDetail';
import AssignmentForm from './AssignmentForm';
import UserAction from './UserAction';
import UserDetail from './UserDetail';
import UserForm from './UserForm';

export interface RowData {
    firstName: string,
    lastName: string,
    createdAT: Date | null,
    updatedAT: Date | null,
    createdBy: string,
    updatedBy: string,
    isActive: boolean,
    userStatus: string,
    id: string,
    userName: string,
    email: string,
    phoneNumber: string,
}

interface ThProps {
  children?: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

  return (
    <Table.Th className={classes.th} >
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" wrap='nowrap'> 
          <Text fw={500} fz="sm"> {/*  className={classes.textWrap} > */}
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]?.toString().toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]?.toLocaleString().localeCompare(a[sortBy].toLocaleString());
      }

      return a[sortBy]?.toLocaleString().localeCompare(b[sortBy].toLocaleString());
    }),
    payload.search
  );
}
var detailData = [
  {key: 'userName', value: 'User Name'},
  {key: 'firstName', value: 'First Name'} ,
  {key: 'lastName', value: 'Las tName',} ,
  {key: 'email', value: 'Email'},
  {key: 'phoneNumber', value: 'Phone Number' } ,
  {key: 'isActive', value: 'Is Active' } ,
  {key: 'userStatus', value: 'User Status' } ,
  {key: 'createdAT', value: 'Created At'} ,
  ]

export function UserTable({data, table, tableTitle, isActive}: any) {

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const MAX_CHARACTERS = 50

  useEffect(()=>{
    setSortedData(data)
  },[data])

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  
  const rows = sortedData?.map((row: any, index: any) => {
      
      const today = new Date()
      const dueDate = new Date(row?.returnDueDate)
      const timeDifference = dueDate.getTime() - today.getTime()
      const remainingDays = Math.ceil(timeDifference / (1000*60*60*24))
  return(
    <Table.Tr key={index} style={{borderRadius: 10}}
        className={remainingDays < 13 ? remainingDays < 5 ? coreClasses.blinkRed : coreClasses.blinkYellow : ''}>

      <Table.Td p={5} m={0}>{index+1}</Table.Td>
      {table?.map((col: any, index: any) => {
        if (col.key === "createdAT" || col.key === "updatedAT") {
          const date = new Date(row[col.key]);
          const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          return <Table.Td key={`col-${index}`} p={5} m={0}>{formattedDate}</Table.Td>;
        } else if (col.key === "isActive"){
            return<Table.Td key={`col-${index}`} p={5} m={0}>{row.isActive ? <IconCircleCheckFilled style={{color: 'green'}}/> : <IconCircleXFilled style={{color: 'red'}}/>}</Table.Td>
        }else if (col.key === "roles"){
          // var roles = []
          // row?.roles.map((r) => {
          //   roles.join(',', )
          // })
          return<Table.Td key={`col-${index}`} p={5} m={0}>{row.roles?.join(', ')}</Table.Td>
        } else {
          return <Table.Td key={`col-${index}`} p={2} m={0}>{row[col.key]}</Table.Td>;
          
        }
      })}

      <Table.Td display={'flex'}>
        <IconEye cursor={'pointer'}  onClick={() => {
           modals.open({
            size: '100%',
            title: 'User Detail',
            children: (
              <UserDetail
                data={row} 
                detailData={detailData}
              />
            ),
           })
        }
        } />

        <IconEditCircle cursor={'pointer'} color='green' onClick={() => 
           modals.open({
            size: '100%',
            title: 'Update User',
            children: (
              <UserForm data={row} action='update'/>
            ),
           })
        } />
        <UserAction data={row}/>
      </Table.Td>

    </Table.Tr>
  )});

  return (
    <Group mx={30}> 
      <Center className={classes.tableTitle}>
        <Title >{tableTitle}</Title>
      </Center>
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Button onClick={() => 
      modals.open({
        size: '100%',
        title: 'Add Followup',
        children: (
          <AssignmentForm
            data={data}
            action='add'
          />
        )
      })}
      >Add Assignment</Button>


      <Table.ScrollContainer minWidth={200}>
        <Table horizontalSpacing="xl" verticalSpacing="xs"  layout="fixed" highlightOnHover striped>
          <Table.Tbody>
            <Table.Tr>
              <Th>Item#</Th>
              {table?.map((col: any, index: any) => {
                  return <Th key={`coll-${index}`}
                      sorted={sortBy === `${col.key}`}
                      reversed={reverseSortDirection}
                      onSort={() => setSorting(col.key)}
                    > {col.value} </Th>                  
                })
              }
              <Th>Action</Th>

            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows?.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                {data && data.length > 0 ? (
                  <Table.Td colSpan={Object.keys(data[0]).length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
                ) : null}
                
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ScrollArea>
    </Group>
  );
}