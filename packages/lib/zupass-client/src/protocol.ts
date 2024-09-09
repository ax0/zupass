import { z } from "zod";
import { ZappSchema } from "./zapp";

export enum WindowMessageType {
  ZUPASS_CLIENT_CONNECT = "zupass-client-connect"
}

export enum RPCMessageType {
  ZUPASS_CLIENT_INVOKE = "zupass-client-invoke",
  ZUPASS_CLIENT_INVOKE_RESULT = "zupass-client-invoke-result",
  ZUPASS_CLIENT_INVOKE_ERROR = "zupass-client-invoke-error",
  ZUPASS_CLIENT_READY = "zupass-client-ready",
  ZUPASS_CLIENT_SHOW = "zupass-client-show",
  ZUPASS_CLIENT_HIDE = "zupass-client-hide"
}

export const RPCMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_INVOKE),
    serial: z.number(),
    fn: z.string(),
    args: z.array(z.unknown())
  }),
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_INVOKE_RESULT),
    result: z.unknown(),
    serial: z.number()
  }),
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_INVOKE_ERROR),
    error: z.string(),
    serial: z.number()
  }),
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_READY)
  }),
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_SHOW)
  }),
  z.object({
    type: z.literal(RPCMessageType.ZUPASS_CLIENT_HIDE)
  })
]);

export const WindowMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(WindowMessageType.ZUPASS_CLIENT_CONNECT),
    zapp: ZappSchema
  })
]);

export type WindowMessage = z.infer<typeof WindowMessageSchema>;
export type RPCMessage = z.infer<typeof RPCMessageSchema>;

export function postWindowMessage(
  window: Window,
  message: WindowMessage,
  targetOrigin: string,
  transfer: Transferable[] = []
): void {
  window.postMessage(message, targetOrigin, transfer);
}

export function postRPCMessage(port: MessagePort, message: RPCMessage): void {
  port.postMessage(message);
}