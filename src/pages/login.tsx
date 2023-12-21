'use-client'
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
  } from '@mantine/core';
  import classes from '../styles/Login.module.css';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useSessionStorage } from '@mantine/hooks';
import { useLoginUserMutation } from './api/apiSlice';
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { AnyAaaaRecord } from 'dns';
import { useRouter } from 'next/router';



export default function Login() {

  const form = useForm({
      validateInputOnBlur: true,
      initialValues:{
        username: '',
        password: ''
      }
      // validate:
  })

  const initialData = {
    token: '',
    user: { 
      username: '',
      fullName: '',
      userId: '',
      email: ''
     },
    role: [],
  };
  const [value, setValue] = useSessionStorage({key: 'loginData', defaultValue: initialData});
  
  const router = useRouter();
  const callbackUrl = decodeURI((router.query?.callbackUrl as string) ?? '/');

  const [login, {isLoading, isSuccess, error}] = useLoginUserMutation()
  const handleSubmit = async (e: any) => {
      e.preventDefault()
      // const response = await fetch('/api/auth', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(form.values),
      // })
      // const data = await response.json()
      // console.log({data})
    // }
    //   console.log({form})
      const {username, password} = form.values
      // await signIn('credentials', { redirect: false });
      const result = await signIn("credentials", {
        username: username, 
        password: password,
        callbackUrl: callbackUrl ?? '/',
        redirect: false,
      });
      console.log({result})
      // if (result?.error) {
      //   console.log(result.error);
      // }
      // if (result?.ok) {
      //   console.log('result', result);
      // }
    };


      // try{
      //   const loginData = await login(form.values).unwrap()
      //   if(loginData) {
      //     const decoded: any = jwtDecode(loginData?.token)
      //     console.log({decoded})
      //     const userData = {
      //       token: loginData?.token,
      //       user: { 
      //         username: decoded.unique_name[1],
      //         fullName: decoded.given_name,
      //         userId: decoded.nameid,
      //         email: decoded.email
      //        },
      //       role: decoded.role,
      //     };
      //     setValue(userData)
      //   }

      // } catch(e) {
      //   console.log({e})
      //   console.log({error})
      // }
      
  

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="a" 
        href='/register'
        >
          Create account
        </Anchor>
      </Text>
        <form onSubmit={handleSubmit} method='POST'>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput 
              label="Username" 
              placeholder="Your Username" 
              required 
              {...form.getInputProps('username')}
              />
          <PasswordInput mt="md"
              label="Password" 
              placeholder="Your password" 
              required 
              {...form.getInputProps('password')}
              />

          <Group justify="space-between" mt="lg">
              <Anchor component="button" size="sm">
              Forgot password?
              </Anchor>
          </Group>
          <Button fullWidth mt="xl" type='submit' loading={isLoading}>
              Sign in
          </Button>
          </Paper>

        </form>
    </Container>
  );
}