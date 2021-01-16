export async function useFetch(
  query: string,
  variables: unknown,
  cookie: string
) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await res.json();
}
