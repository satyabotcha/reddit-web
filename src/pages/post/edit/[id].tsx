import router, { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql"
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Textarea,
  Button
} from "@chakra-ui/react"

export default function Post () {
    const {query} = useRouter()
    
    const postId = typeof query.id === "string" ? +query.id : -1

    const {isLoading, isError, data } = usePostQuery(
        {id: postId},
        {enabled: postId !== -1})
    
    const {register, handleSubmit, reset, formState} = useForm({
        defaultValues: {
            title: data?.post ?  data.post.title: '',
            content: data?.post ?  data.post.content: ''
        }
    })

    const {mutate} = useUpdatePostMutation({
        onSettled: () => {
            router.back()
        }
    })

    const onSubmit = handleSubmit( (data) => {
        mutate({
            id: postId,
            content: data.content,
            title: data.title
        })
        reset()
        return
    })

    if (isLoading) {
     return <span>Loading...</span>
   }
 
   if (isError) {
     return <span>Something went wrong</span>
   }

   if (!data?.post){
     return <span>Post could not be found</span>
   }

    
    return(
        <>
        <Box width="50%" mt={8} mx="25%">

            <form onSubmit={onSubmit}>
            <Heading mx="4">Update Post</Heading>

            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input type="text" ref={register({required: true})} id="title" name="title"/>
            </FormControl>

            <FormControl>
                <FormLabel>Content</FormLabel>
                <Textarea type="text" ref={register({required: true})} size="md" id="content" name="content"/>
            </FormControl>

            <Button mt="4" type="submit" isLoading={formState.isSubmitting}>Update Post</Button>
            </form>

        </Box>
        </>
    )
}