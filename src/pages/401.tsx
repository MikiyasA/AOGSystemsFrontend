import {
  Box,
  Text,
  Container,
  Title,
  Group,
  Button,
  useStyles,
  Center,
} from "@mantine/core";
import React from "react";
import { connect } from "react-redux";
import classes from "../styles/NothingFoundBackground.module.css";
import { useRouter } from "next/router";

export const Unauthorized = () => {
  const router = useRouter();

  return (
    <Center>
      <Container m={100}>
        <div className={classes.label}>401</div>
        <Title className={classes.title}>
          You Are not authorized to access this page.
        </Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          This page is restricted by role. If you must access this page, please
          contact system support to get required role
        </Text>
        <Group justify="center">
          <Button size="md" onClick={() => router.push("/")}>
            Go To Home Page
          </Button>
          <Button size="md" onClick={() => router.push("/login")}>
            Go To Login Page
          </Button>
        </Group>
      </Container>
    </Center>
  );
};

export default Unauthorized;
