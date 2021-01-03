import { GetServerSideProps } from 'next'
import { GraphQLClient } from 'graphql-request'
import { MeQuery, useCreatePostMutation } from '../generated/graphql'
import { useForm } from 'react-hook-form'
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Textarea,
  Button
} from "@chakra-ui/react"
import { useRouter } from 'next/router'



export const getServerSideProps: GetServerSideProps = async ({req}) => {
    console.log(req.headers.cookie);
    
    const endpoint = "https://api.satyabotcha.com/graphql"

    const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
    headers: req.headers.cookie ? {
        cookie: req.headers.cookie
    } : undefined
  })

  const query = `{
    me {
        id
        username
        }
    }`

    const data = await graphQLClient.request<MeQuery>(query)

    if(!data.me){
        return{
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
  
}




export default function CreatePost(){
    const router = useRouter()
    const {register, handleSubmit, reset, formState} = useForm({
        defaultValues: {
            title: '',
            content: ''
        }
    })

    const {mutate} = useCreatePostMutation({
        onSettled: () => {
            router.push('/')
        }
    })

    const onSubmit = handleSubmit( (data) => {
        mutate(data)
        reset()
        return
    })

    

    return (
        <>
        
        <Box width="50%" mt={8} mx="25%">
            <form onSubmit={onSubmit}>
            <Heading mx="4">Create Post</Heading>

            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input type="text" placeholder="Enter title" ref={register({required: true})} id="title" name="title" />
            </FormControl>

            <FormControl>
                <FormLabel>Content</FormLabel>
                <Textarea type="text" placeholder="Enter content" ref={register({required: true})} size="md" id="content" name="content" />
            </FormControl>

            <Button mt="4" type="submit" isLoading={formState.isSubmitting}>Create Post</Button>
            </form>

        </Box>
        </>
    )
}



