import type {
  ParameterizedContext,
  DefaultState,
  DefaultContext,
  Next,
} from "koa";

export async function handleErrors(
  ctx: ParameterizedContext<DefaultState, DefaultContext>,
  next: Next
) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    // ctx.app.emit("error", err, ctx);
  }
}
