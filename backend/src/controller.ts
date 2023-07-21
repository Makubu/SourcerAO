import Router from "koa-router";
import { create as createIpfs, IPFSHTTPClient } from "kubo-rpc-client";

export const router = new Router();

function getIpfsClient(): IPFSHTTPClient {
  const ipfsClient = createIpfs({ url: "http://ipfs:5001/api/v0" }); // use local gateway
  return ipfsClient;
}

router.get("/access_token", async (ctx, next) => {
  const code = ctx.query.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const url = `https://github.com/login/oauth/access_token?code=${code}&client_id=${clientId}&client_secret=${clientSecret}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  ctx.status = res.status;
  console.log(res.status, res.statusText, url);
  if (res.ok) {
    const json = await res.json();
    ctx.body = json;
  }

  await next();
});

router.post("/upload", async (ctx, next) => {
  const data = JSON.stringify(ctx.request.body);
  const ipfsClient = getIpfsClient();
  const res = await ipfsClient.add(JSON.stringify(data));
  ctx.body = res;
  await next();
});

router.get("/download/:cid", async (ctx, next) => {
  const { cid } = ctx.params;
  const ipfsClient = getIpfsClient();

  const resp = await ipfsClient.cat(cid);
  let content: number[] = [];
  for await (const chunk of resp) {
    content = [...content, ...chunk];
  }
  const data = Buffer.from(new Uint8Array(content)).toString("utf8");
  ctx.body = JSON.parse(data);
  await next();
});
