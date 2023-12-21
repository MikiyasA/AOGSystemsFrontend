import { Container, Title, Text, Anchor, Paper, TextInput, PasswordInput, Button } from "@mantine/core"
import classes from '../styles/Login.module.css';
import { useForm } from "@mantine/form";
import { useCreateUserMutation } from "./api/apiSlice";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useRouter } from "next/router";


const Register = () => {

    const form: any = useForm({
        validateInputOnBlur: true,
        initialValues: {
            userName: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
        },
        validate: {
            userName: (value) => (value.length < 5 ? 'First name must have at least 5 letters' : null),
            // password: (v) => (v === form.values.confirmPassword ? null : 'Password and Confirm Password must be the same' ),
            confirmPassword: (v) => (v === form.values.password ? null : 'Password and Confirm Password must be the same' ),
            firstName: (value) => (value.length < 3 ? 'First name must have at least 3 letters' : null),
            lastName: (value) => (value.length < 3 ? 'Last name must have at least 3 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phoneNumber: (value) => (/^\+\d+$/.test(value) ? null : 'Phone number should be provided in form of +xxx---'),
        }
    })

    const router = useRouter()
    const [registerUser, {isLoading, isSuccess, error}] = useCreateUserMutation()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const {data: registerData}: any = await registerUser(form.values).unwrap()
        registerData.succeeded ? notifications.show({
            title: 'Success',
            message:  registerData?.message || 'User Registered Successfully 👍',
            color: 'green',
        })
         : notifications.show({
            title: 'Failure',
            message:  registerData?.errors[0].description || error || 'There is a problem on User Registration',
            color: 'red',
        })
        if(registerData.succeeded){
            router.push('/login')
        }

    }

    
    return(
    <Container size={700} my={40}>
      <Title ta="center" className={classes.title}>
        Registration Form!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do you have an account ?{' '}
        <Anchor size="sm" component="a" href="/login">
          login hear
        </Anchor>
      </Text>
        <form onSubmit={handleSubmit} method='POST' style={{padding: '0 20px'}}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput 
              label="Username" 
              placeholder="Your Username" 
              required 
              {...form.getInputProps('userName')}
          />
          <PasswordInput mt="md"
              label="Password" 
              placeholder="Your password" 
              required 
              {...form.getInputProps('password')}
           />
           <PasswordInput mt="md"
              label="Confirm Password" 
              placeholder="Confirm Your password" 
              required 
              {...form.getInputProps('confirmPassword')}
           />
           <TextInput 
              label="First Name" 
              placeholder="Your First Name" 
              required 
              {...form.getInputProps('firstName')}
           />
           <TextInput 
              label="Last Name" 
              placeholder="Your Last Name" 
              required 
              {...form.getInputProps('lastName')}
           />
           <TextInput 
              label="Email" 
              placeholder="Your Email" 
              required 
              {...form.getInputProps('email')}
           />
           <TextInput 
              label="Phone No" 
              placeholder="Your Phone No" 
              required 
              {...form.getInputProps('phoneNumber')}
           />

          
          <Button fullWidth mt="xl" type='submit' loading={isLoading}>
              Register
          </Button>
          </Paper>

        </form>
    </Container>
    )
}

export default Register