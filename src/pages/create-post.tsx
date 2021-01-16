import { useCreatePostMutation } from "../generated/graphql";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  Heading,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import Layout from "../components/layout";

export default function CreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { mutate } = useCreatePostMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries("posts");
      router.push("/");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
    reset();
    return;
  });

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <Heading mx="4">Create Post</Heading>

        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            placeholder="Enter title"
            ref={register({ required: true })}
            id="title"
            name="title"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Content</FormLabel>
          <Textarea
            type="text"
            placeholder="Enter content"
            ref={register({ required: true })}
            size="md"
            id="content"
            name="content"
          />
        </FormControl>

        <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
          Create Post
        </Button>
      </form>
    </Layout>
  );
}
