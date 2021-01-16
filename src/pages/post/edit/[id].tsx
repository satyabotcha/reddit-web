import router, { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import {
  FormControl,
  FormLabel,
  Input,
  Heading,
  Textarea,
  Button,
  Spinner,
} from "@chakra-ui/react";
import Layout from "../../../components/layout";
import { useQueryClient } from "react-query";

export default function Post() {
  const queryClient = useQueryClient();
  const { query } = useRouter();

  const postId = typeof query.id === "string" ? +query.id : -1;

  const { isLoading, isError, data } = usePostQuery({ id: postId });

  const { handleSubmit, reset, formState, control } = useForm();

  const { mutate } = useUpdatePostMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries("posts");
      router.back();
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate({
      id: postId,
      content: data.content,
      title: data.title,
    });
    reset();
    return;
  });

  if (isLoading) {
    return (
      <Layout>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Layout>
    );
  }

  if (isError) {
    return <Layout>Something went wrong</Layout>;
  }

  if (!data?.post) {
    return <Layout>Post could not be found</Layout>;
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <Heading mx="4">Update Post</Heading>

        <FormControl>
          <FormLabel>Title</FormLabel>
          <Controller
            name="title"
            control={control}
            defaultValue={data.post.title}
            rules={{ required: true }}
            as={<Input />}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Content</FormLabel>
          <Controller
            name="content"
            control={control}
            defaultValue={data.post.content}
            rules={{ required: true }}
            as={<Textarea />}
          />
        </FormControl>

        <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
          Update Post
        </Button>
      </form>
    </Layout>
  );
}
