"use-client";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "../styles/Login.module.css";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useSessionStorage } from "@mantine/hooks";
import { useLoginUserMutation } from "./api/apiSlice";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AnyAaaaRecord } from "dns";
import { useRouter } from "next/router";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";

export default function Login() {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => {
        if (value?.includes(" ")) {
          return "Vendor Code cannot contain spaces";
        }
      },
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const callbackUrl = decodeURI((router.query?.callbackUrl as string) ?? "/");

  // const [login, { isLoading, isSuccess, error }] = useLoginUserMutation();
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { username, password } = form.values;
    const result = await signIn("credentials", {
      username: username,
      password: password,
      callbackUrl: callbackUrl ?? "/",
      redirect: false,
    });
    if (result?.ok) router.push(callbackUrl);
    if (result?.error) setErrorMessage(result?.error);
    console.log(result);
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="a" href="/register">
          Create account
        </Anchor>
      </Text>
      <form onSubmit={handleSubmit} method="POST">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Your Username"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
          />

          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" disabled={!form.isValid()}>
            Sign in
          </Button>
          {errorMessage && <Text color="red">{errorMessage}</Text>}
        </Paper>
      </form>
    </Container>
  );
}
