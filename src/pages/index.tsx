import { PostsQuery, useDeletePostMutation, useLogoutUserMutation, useMeQuery } from "../generated/graphql"
import { Box, Button, Stack, Heading, Text, Flex, Link, IconButton } from "@chakra-ui/react"
import NextLink from 'next/link'
import { useQueryClient, useInfiniteQuery } from "react-query"
import { GraphQLClient } from "graphql-request";
import React, {useState} from "react";
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import PostVote from "../components/postVotes";




export default function Index(){

  const [loadmore, setLoadMore] = useState(false)


  const queryClient = useQueryClient()

  const {mutate: logoutMutate} = useLogoutUserMutation({
    onSettled: (data) => {
      queryClient.setQueryData(["Me", {}], data)
    } 
  })
  const {data, isLoading, isError} =  useMeQuery({})


  const endpoint = process.env.NEXT_PUBLIC_API_URL!

   const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
  })

  const postQuery = `
  query Posts($take: Int!, $cursor: Int){
  PaginatedPosts(take: $take, cursor: $cursor){
    hasMore
    posts{
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
  `

const getPosts = ({pageParam = null}: {pageParam?: number | null}) => {
  return graphQLClient.request(postQuery, {take: 10, cursor: pageParam})
}
  
  
const {data: postsData, fetchNextPage, isFetchingNextPage} = 
useInfiniteQuery<PostsQuery>("posts", getPosts , {
  getNextPageParam: (lastPage) => {
    if(lastPage.PaginatedPosts?.posts){
      return lastPage.PaginatedPosts.posts[lastPage.PaginatedPosts.posts.length  - 1]?.id
    }
  },
  onSuccess: (data) => setLoadMore(data.pages[data.pages.length - 1].PaginatedPosts?.hasMore as boolean)
})

const {mutate: deleteMutate} = useDeletePostMutation({
  onSettled: () => queryClient.invalidateQueries("posts")
})



  if (isLoading) {
     return <span>Loading...</span>
   }
 
   if (isError) {
     return <span>Something went wrong</span>
   }

   if (!data?.me){
     return (
       <Box>
         <Link href="/login">Login</Link>
         <Link href="register">Register</Link>
       </Box>
       
     )
   }

  return(
    <>
    <Box width="50%" mt={8} mx="25%">
      {data.me.username}
      <Link href="/create-post">Create Post</Link>
      <Button onClick={() => logoutMutate({})}>Logout</Button>

      <Stack spacing={8}>
      {postsData?.pages.map( (page, index) =>

        <React.Fragment key={index}>
          {page.PaginatedPosts?.posts?.map( (post) => 
            <Flex key={post?.id} p={5} shadow="md" borderWidth="1px">

              <PostVote post={post}/>

              <Box flex="1">

                <NextLink href={`post/${post?.id}`} passHref>
                <Link>
                <Heading fontSize="xl">{post?.title}</Heading>
                </Link>
                </NextLink>

                <Text >Posted by {post?.creator.username}</Text>

                <Flex align="center">

                <Text mt={4} flex="1">{post?.content}</Text>

                  {data.me?.id !== post?.creator.id ? null : (<Box>

                  <NextLink href={`post/edit/${post?.id}`} passHref>
                    <Link>
                      <IconButton  
                      aria-label="edit post" 
                      icon={<EditIcon/>} 
                      ml="auto"
                      mr="4"/>
                    </Link>
                  </NextLink>

                  <IconButton  
                    aria-label="delete post" 
                    icon={<DeleteIcon/>} 
                    ml="auto"
                    onClick={() => deleteMutate({id: post? post.id : -1 })} />
                    </Box>)}
                </Flex>

              </Box>

            </Flex>
          )}
        </React.Fragment> 
      )}
      </Stack>


      { loadmore ? 
        <Button my="8" onClick={() => fetchNextPage()} isDisabled={!loadmore} isLoading={isFetchingNextPage}>
          Load more
        </Button>
        : null
    }
      
    </Box>
    </>
  )
}


