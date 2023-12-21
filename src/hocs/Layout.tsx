'use-client'
import React, { useEffect } from 'react'
import { Center, Group } from '@mantine/core'
import Head from 'next/head'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { useSessionStorage } from '@mantine/hooks'
import { useRouter } from 'next/router'

type Props = {
    children: React.ReactNode,
    title: string, 
    description: string,
}

const Layout = ({children, title, description}: Props) => {

  const [loginData, setLoginData] = useSessionStorage({key: 'loginData'});
  
  const router = useRouter()
  useEffect(() => { 
    console.log('loginData', loginData?.token)
    if(!loginData){
        // router.push('/')
    }
    
}, [loginData])
  
return (
    <Group>
        <Head>
            <title>{title}</title>
            <meta name='description'  content={description}/>
        </Head>
        <Group  w='100%'>
            <Navbar/>
            
            {children}
        </Group>
    </Group>
)

}

export default Layout