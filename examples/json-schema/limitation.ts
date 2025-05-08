import { jsonSchema } from "@typem/json-schema";
import type { Description, Format, Title } from "typem";

type Trade = {
  id: number;
  date: string & Format<"date-time">;
  product: string & Format<"uuid"> & Description<"The product ID">;
  quantity: number & Description<"The trade quantity">;
  account: string & Format<"uuid"> & Description<"The account ID">;
  isBuy: boolean & Description<"True if the trade is a buy">;
  comment?: string & Description<"The trade comment">;
} & Title<"Trade"> &
  Description<"A trade record">;

const tradeSchema = jsonSchema<Trade>();

console.log(tradeSchema());
