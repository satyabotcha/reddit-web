import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import {useState} from 'react'
import { useForgotPasswordMutation } from "../generated/graphql"

export default function ForgotPassword(){
    const [show, setShow] = useState(false)
    const {register, reset, handleSubmit, formState} = useForm({
        defaultValues: {
            email: ''
        }
    })

    const{mutate} = useForgotPasswordMutation({
        onSuccess: () => setShow(true)
    })

    const onSubmit = handleSubmit( (data) => {
        mutate(data)
        reset()
        return 
    })


    return(
        <Box width="50%" mt={8} mx="25%">
        <Heading mx="4">Forgot Password</Heading>
        
        <form onSubmit={onSubmit}>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter email" ref={register({required: true})} name="email" id="email"/>
            </FormControl>

            <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
                {!show ? "Reset" : "Email sent"}
            </Button>

        </form>
        
        </Box>
    )
}