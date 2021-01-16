import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { usePostQuery } from "../../generated/graphql";
import { Heading, Text } from "@chakra-ui/react";

export default function Post() {
  const { query } = useRouter();
  const postId = typeof query.id === "string" ? +query.id : -1;
  const { isLoading, isError, data } = usePostQuery(
    { id: postId },
    { enabled: postId !== -1 }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Something went wrong</span>;
  }

  if (!data?.post) {
    return <span>Post could not be found</span>;
  }

  return (
    <Layout>
      <Heading my="4">{data.post.title}</Heading>
      <Text>{data.post.content}</Text>
    </Layout>
  );
}
