export function onRequest({ params }) {
  return new Response(`Hello, world! ${params.guild}`)
}