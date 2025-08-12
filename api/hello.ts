export const config = {
  runtime: 'edge',
};

export default function handler(req: Request): Response {
  return new Response('Hello world');
}
