import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://api.satyabotcha.com/graphql", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ query, variables }),
    });
    
    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};


export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  title: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  points: Scalars['Int'];
  userId: Scalars['Int'];
  creator: User;
  voteStatus?: Maybe<Scalars['Int']>;
  content: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  posts: Array<Post>;
};


export type UserPostsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<PostWhereUniqueInput>;
  after?: Maybe<PostWhereUniqueInput>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<FieldError>;
  user?: Maybe<User>;
};

export type Upvotes = {
  __typename?: 'Upvotes';
  post: Post;
  postId: Scalars['Int'];
  user: User;
  userId: Scalars['Int'];
  value: Scalars['Int'];
};

export enum VoteType {
  Upvote = 'upvote',
  Downvote = 'downvote'
}

export type PostWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  PaginatedPosts?: Maybe<PaginatedPosts>;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryPaginatedPostsArgs = {
  take: Scalars['Int'];
  cursor?: Maybe<Scalars['Int']>;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<Post>;
  updatePost?: Maybe<Post>;
  deletePost?: Maybe<Scalars['Boolean']>;
  createUser?: Maybe<UserResponse>;
  loginUser?: Maybe<UserResponse>;
  logoutUser?: Maybe<Scalars['Boolean']>;
  forgotPassword?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<UserResponse>;
  votePost?: Maybe<Scalars['Boolean']>;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
  content: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationVotePostArgs = {
  postId: Scalars['Int'];
  vote: VoteType;
};

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'content' | 'createdAt' | 'updatedAt' | 'points' | 'voteStatus'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id'>
  ) }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'createdAt' | 'updatedAt'>
  )> }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword?: Maybe<(
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  )> }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content'>
  )> }
);

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser?: Maybe<(
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  )> }
);

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logoutUser'>
);

export type CreateUserMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser?: Maybe<(
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  )> }
);

export type VotePostMutationVariables = Exact<{
  postId: Scalars['Int'];
  vote: VoteType;
}>;


export type VotePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'votePost'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostSnippetFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: Maybe<Scalars['Int']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { PaginatedPosts?: Maybe<(
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts?: Maybe<Array<Maybe<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )>>> }
  )> }
);

export const PostSnippetFragmentDoc = `
    fragment PostSnippet on Post {
  id
  title
  content
  createdAt
  updatedAt
  points
  voteStatus
  creator {
    username
    id
  }
}
    `;
export const RegularUserFragmentDoc = `
    fragment RegularUser on User {
  id
  username
}
    `;
export const CreatePostDocument = `
    mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
    createdAt
    updatedAt
  }
}
    `;
export const useCreatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePostMutation, TError, CreatePostMutationVariables, TContext>) => 
    useMutation<CreatePostMutation, TError, CreatePostMutationVariables, TContext>(
      (variables?: CreatePostMutationVariables) => fetcher<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables)(),
      options
    );
export const DeletePostDocument = `
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;
export const useDeletePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePostMutation, TError, DeletePostMutationVariables, TContext>) => 
    useMutation<DeletePostMutation, TError, DeletePostMutationVariables, TContext>(
      (variables?: DeletePostMutationVariables) => fetcher<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables)(),
      options
    );
export const ForgotPasswordDocument = `
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export const useForgotPasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ForgotPasswordMutation, TError, ForgotPasswordMutationVariables, TContext>) => 
    useMutation<ForgotPasswordMutation, TError, ForgotPasswordMutationVariables, TContext>(
      (variables?: ForgotPasswordMutationVariables) => fetcher<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, variables)(),
      options
    );
export const ResetPasswordDocument = `
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export const useResetPasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>) => 
    useMutation<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>(
      (variables?: ResetPasswordMutationVariables) => fetcher<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, variables)(),
      options
    );
export const UpdatePostDocument = `
    mutation UpdatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    id
    title
    content
  }
}
    `;
export const useUpdatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>) => 
    useMutation<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>(
      (variables?: UpdatePostMutationVariables) => fetcher<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, variables)(),
      options
    );
export const LoginUserDocument = `
    mutation loginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export const useLoginUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginUserMutation, TError, LoginUserMutationVariables, TContext>) => 
    useMutation<LoginUserMutation, TError, LoginUserMutationVariables, TContext>(
      (variables?: LoginUserMutationVariables) => fetcher<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, variables)(),
      options
    );
export const LogoutUserDocument = `
    mutation LogoutUser {
  logoutUser
}
    `;
export const useLogoutUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LogoutUserMutation, TError, LogoutUserMutationVariables, TContext>) => 
    useMutation<LogoutUserMutation, TError, LogoutUserMutationVariables, TContext>(
      (variables?: LogoutUserMutationVariables) => fetcher<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, variables)(),
      options
    );
export const CreateUserDocument = `
    mutation createUser($email: String!, $username: String!, $password: String!) {
  createUser(username: $username, password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>) => 
    useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      (variables?: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables)(),
      options
    );
export const VotePostDocument = `
    mutation VotePost($postId: Int!, $vote: VoteType!) {
  votePost(postId: $postId, vote: $vote)
}
    `;
export const useVotePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<VotePostMutation, TError, VotePostMutationVariables, TContext>) => 
    useMutation<VotePostMutation, TError, VotePostMutationVariables, TContext>(
      (variables?: VotePostMutationVariables) => fetcher<VotePostMutation, VotePostMutationVariables>(VotePostDocument, variables)(),
      options
    );
export const MeDocument = `
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;
export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables, 
      options?: UseQueryOptions<MeQuery, TError, TData>
    ) => 
    useQuery<MeQuery, TError, TData>(
      ['Me', variables],
      fetcher<MeQuery, MeQueryVariables>(MeDocument, variables),
      options
    );
export const PostDocument = `
    query Post($id: Int!) {
  post(id: $id) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;
export const usePostQuery = <
      TData = PostQuery,
      TError = unknown
    >(
      variables: PostQueryVariables, 
      options?: UseQueryOptions<PostQuery, TError, TData>
    ) => 
    useQuery<PostQuery, TError, TData>(
      ['Post', variables],
      fetcher<PostQuery, PostQueryVariables>(PostDocument, variables),
      options
    );
export const PostsDocument = `
    query Posts($take: Int!, $cursor: Int) {
  PaginatedPosts(take: $take, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;
export const usePostsQuery = <
      TData = PostsQuery,
      TError = unknown
    >(
      variables: PostsQueryVariables, 
      options?: UseQueryOptions<PostsQuery, TError, TData>
    ) => 
    useQuery<PostsQuery, TError, TData>(
      ['Posts', variables],
      fetcher<PostsQuery, PostsQueryVariables>(PostsDocument, variables),
      options
    );