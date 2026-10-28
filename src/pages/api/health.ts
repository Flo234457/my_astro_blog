export const GET = () =>
  new Response(JSON.stringify({ status: 'error' }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });