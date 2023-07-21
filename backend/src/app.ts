import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { config } from "dotenv";
import session from "koa-session";
import { router } from "./controller.js";

const errorHandler = () => {
  return async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    try {
      await next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      ctx.status = err?.statusCode || err?.status || 500;
      ctx.body = {
        message: err?.message || "server error",
      };
    }
  };
};

const logger = () => {
  return async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    await next();
    console.log(ctx.method, ctx.url, ctx.status);
  };
};

export function createApp() {
  config(); // load dotenv

  const app = new Koa({
    keys: [process.env.SECRET || ""],
    proxy: true,
  });

  const session_config = {
    key: "my.session",
    maxAge: 3600 * 2,
    autoCommit: false,
    overwrite: false,
    httpOnly: true,
    signed: true,
    secure: false,
  };

  // Middlewares
  app.use(logger());
  app.use(errorHandler());
  app.use(session(session_config, app));
  app.use(bodyParser());

  // Routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
