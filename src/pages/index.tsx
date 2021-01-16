import {
  useDeletePostMutation,
  useLogoutUserMutation,
  useMeQuery,
} from "../generated/graphql";
import {
  Box,
  Button,
  Stack,
  Heading,
  Text,
  Flex,
  Link,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useQueryClient, useInfiniteQuery, QueryClient } from "react-query";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PostVote from "../components/postVotes";
import Layout from "../components/layout";
import { gql, GraphQLClient } from "graphql-request";
import { GetServerSideProps } from "next";
import { useFetch } from "../utils/useFetch";
import { Router, useRouter } from "next/router";

const meQuery = `
    {
    me {
        id
        username
        }
    }`;

const postQuery = gql`
  query Posts($take: Int!, $cursor: Int) {
    PaginatedPosts(take: $take, cursor: $cursor) {
      hasMore
      posts {
        id
        title
        content
        createdAt
        updatedAt
        points
        voteStatus
        creator {
          id
          username
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await useFetch(meQuery, {}, req.headers.cookie);

  const posts = await useFetch(postQuery, { take: 10 }, req.headers.cookie);

  if (user.data.me === null) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user.data,
      posts: posts.data,
    },
  };
};

const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!, {
  credentials: "include",
  mode: "cors",
});

function getPosts({ pageParam }: { pageParam?: number }) {
  return graphQLClient.request(postQuery, {
    take: 10,
    cursor: pageParam,
  });
}

export default function Index({ posts, user }) {
  const [loadmore, setLoadMore] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: logoutMutate } = useLogoutUserMutation({
    onSettled: () => {
      router.reload();
    },
  });

  const { data: userData } = useMeQuery({}, { initialData: user });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    "posts",
    getPosts,
    {
      initialData: {
        pageParams: undefined,
        pages: [posts],
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.PaginatedPosts?.posts) {
          return lastPage.PaginatedPosts.posts[
            lastPage.PaginatedPosts.posts.length - 1
          ]?.id;
        }
      },
      onSuccess: (data) =>
        setLoadMore(
          data.pages[data.pages.length - 1].PaginatedPosts?.hasMore as boolean
        ),
    }
  );

  const { mutate: deleteMutate } = useDeletePostMutation({
    onSettled: async () => await queryClient.invalidateQueries("posts"),
  });

  return (
    <Layout>
      <Flex>
        <Text>{userData.me.username}</Text>
        <Spacer />
        <Button>
          <Link href="/create-post">Create Post</Link>
        </Button>
        <Spacer />
        <Button onClick={() => logoutMutate({})}>Logout</Button>
      </Flex>
      <Stack spacing={8}>
        {data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.PaginatedPosts?.posts?.map((post) => (
              <Flex key={post?.id} p={5} shadow="md" borderWidth="1px">
                <PostVote post={post} />

                <Box flex="1">
                  <NextLink href={`/post/${post?.id}`} passHref>
                    <Link>
                      <Heading fontSize="xl">{post?.title}</Heading>
                    </Link>
                  </NextLink>

                  <Text>Posted by {post?.creator.username}</Text>

                  <Flex align="center">
                    <Text mt={4} flex="1">
                      {post?.content}
                    </Text>

                    {user?.me?.id !== post?.creator.id ? null : (
                      <Box>
                        <NextLink href={`/post/edit/${post?.id}`} passHref>
                          <Link>
                            <IconButton
                              aria-label="edit post"
                              icon={<EditIcon />}
                              ml="auto"
                              mr="4"
                            />
                          </Link>
                        </NextLink>

                        <IconButton
                          aria-label="delete post"
                          icon={<DeleteIcon />}
                          ml="auto"
                          onClick={() =>
                            deleteMutate({ id: post ? post.id : -1 })
                          }
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            ))}
          </React.Fragment>
        ))}
      </Stack>
      {loadmore ? (
        <Button
          my="8"
          onClick={() => fetchNextPage()}
          isDisabled={!loadmore}
          isLoading={isFetchingNextPage}
        >
          Load more
        </Button>
      ) : null}
    </Layout>
  );
}
