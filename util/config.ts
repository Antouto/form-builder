import { env } from "process";

export const AVATAR_URL =
  "https://cdn.discordapp.com/avatars/942858850850205717/a_437f281f490a388866b7be0b3cd7cc33.gif?size=4096";

export function getApiUri() {
  return process.env?.NEXT_PUBLIC_API_URL == null
    ? "https://create.discordforms.app"
    : process.env.NEXT_PUBLIC_API_URL;
}
