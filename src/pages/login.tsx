import { Button, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"
import { Box, Link } from "@chakra-ui/react"
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form"
import { Heading } from "@chakra-ui/react"
import { useLoginUserMutation } from "../generated/graphql";
import NextLink from 'next/link'


export default function Login(){
    const router = useRouter()
    const {register, reset, handleSubmit, formState, setError, errors} = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const {mutate} = useLoginUserMutation({
        onSettled: (data) => {
            // user failed to register -> errors returned from server
            if (data?.loginUser?.errors?.field){
                const field = data.loginUser?.errors?.field
                const message = data.loginUser?.errors?.message as string | undefined

                setError(field as "email" | "password", {
                    message
                })  
            }
            // user successfully registered
            else{
                router.push('/')
            }

        }
    })
    

    const onSubmit = handleSubmit( (data) => {
        mutate(data)
        reset()
        return 
    })



    return(
        <Box width="50%" mt={8} mx="25%">
        <Heading mx="4">Login</Heading>
        
        <form onSubmit={onSubmit}>
            <FormControl isInvalid={errors.email ? true : false }>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter email" ref={register({required: true})} name="email" id="email"/>
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid= {errors.password ? true : false}>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Enter password" ref={register({required: true})} name="password" id="password"/>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage> 
            </FormControl>

            <Box my="2">
            <NextLink href="/forgot-password">
                <Link>Forgot Password?</Link>
            </NextLink>
            </Box>
                
            
            <Button mt="4" type="submit" isLoading={formState.isSubmitting}>Login</Button>

        </form>
        
        </Box>
    )
}