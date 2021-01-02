import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton } from "@chakra-ui/react"
import React, { useState } from "react"
import { useQueryClient } from "react-query"
import { useVotePostMutation, VoteType } from "../generated/graphql"




export default function PostVote({post} : {post: any}){
    const queryClient = useQueryClient()
    
    const {mutate: voteMutate} = useVotePostMutation({
        onSuccess: () => queryClient.invalidateQueries("posts")
    })
    
    const [loadingState, setLoadingState] = useState <"upvote-loading" | "downvote-loading" | "not-loading"> ("not-loading")
    
    return(
        <Flex direction="column" alignItems="center" justifyContent="center" mr="4">

            <IconButton colorScheme={post.voteStatus === 1 ? "green" : undefined} isLoading={loadingState === "upvote-loading"}  aria-label="upvote" icon={<TriangleUpIcon boxSize="1.5em"/>} 
            onClick={() => {
                setLoadingState("upvote-loading")
                voteMutate({
                postId: post?.id as number,
                vote: VoteType["Upvote"]
                }, {
                onSettled: () => setLoadingState("not-loading")
                })
                setLoadingState("upvote-loading")
                
            }}/>

            {post?.points}

            

            <IconButton colorScheme={post.voteStatus === -1 ? "red" : undefined} aria-label="upvote" isLoading={loadingState === "downvote-loading"} icon={<TriangleDownIcon boxSize="1.5em"/>} 
            onClick={() => {
                setLoadingState("downvote-loading")
                voteMutate({
                postId: post?.id as number,
                vote: VoteType["Downvote"]
                }, {
                onSettled: () => setLoadingState("not-loading")
                })
            }}/>
            </Flex>
    )

}