export async function onRequest({ params }) {
  const guildId = params.guild

  const guildResponse = await fetch(
    `https://create.discordforms.app/api/discord/session?guild_id=${guildId}&checkIfAdmin=true`, {
      credentials: "same-origin"
    }
  ).then(res => res.text());

  return new Response(guildResponse)
}