import Layout from "@/hocs/Layout";
import {
  Divider,
  Grid,
  Paper,
  Title,
  Text,
  Center,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const Home = () => {
  return (
    <Layout title="Home" description="Home">
      <Center
        style={{
          placeContent: "center",
          textAlignLast: "center",
          // margin: 30,
          width: "100%",
        }}
        m={30}
      >
        <Grid m={30} p={30}>
          <Grid.Col span={12}>
            <Title order={1} mb={20} c={"#074f07"}>
              Welcome to AOG Systems
            </Title>
            <Text size="lg">
              Welcome to the AOG Systems platform, your comprehensive solution
              for managing Aircraft On Ground (AOG) incidents efficiently. Our
            </Text>
            <Text>
              platform provides a range of tools and features to streamline your
              AOG-related processes, from request follow-ups to invoice
              management.
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                AOG Request Follow-ups
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>View a list of ongoing AOG requests.</List.Item>
                <List.Item>
                  Track the status of each request and any associated actions.
                </List.Item>
                <List.Item>
                  Add comments and updates to keep all stakeholders informed.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                Assignment Transfer to AOG Coordinator
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>
                  Assign tasks to AOG coordinators for efficient handling.
                </List.Item>
                <List.Item>
                  Monitor the progress of assignments and ensure timely
                  resolution.
                </List.Item>
                <List.Item>
                  Collaborate with team members to streamline workflows.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                Core Return Follow-ups
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>Monitor pending core return follow-ups.</List.Item>
                <List.Item>
                  Update core return statuses and manage associated
                  documentation.
                </List.Item>
                <List.Item>
                  Ensure the timely return of cores to minimize late return
                  penalty.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                Recording Cost Savings
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>
                  Record instances of cost savings achieved through efficient
                  processes.
                </List.Item>
                <List.Item>
                  Maintain a detailed log of cost-saving measures and their
                  impact.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                Sales Order and Loan Orders
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>
                  Create and manage sales orders and loan orders.
                </List.Item>
                <List.Item>
                  Add detailed order information, including customer/vendor
                  details and item specifications.
                </List.Item>
                <List.Item>
                  Facilitate order approvals and confirmations to expedite
                  transactions.
                </List.Item>
                <List.Item>
                  Raise invoice for specific order with selected part line item.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper p="lg" radius="md" style={{ marginBottom: 20 }}>
              <Title order={2} c={"#074f07"}>
                SOA Follow-ups
              </Title>

              <List
                ml={"10%"}
                style={{ textAlignLast: "start" }}
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                <Title mb={10} order={4}>
                  Current Feature:
                </Title>
                <List.Item>
                  Review statements of account (SOA) for vendors.
                </List.Item>
                <List.Item>
                  Update lists of pending payment invoices and reconcile
                  accounts.
                </List.Item>
                <List.Item>
                  Ensure accurate financial reporting and vendor relationships.
                </List.Item>
              </List>
            </Paper>
          </Grid.Col>
        </Grid>
      </Center>
    </Layout>
  );
};

export default Home;
