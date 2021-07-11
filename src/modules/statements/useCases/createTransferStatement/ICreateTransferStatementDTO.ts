import { Statement } from "../../entities/Statement";

export type ICreateTransferStatementDTO =
Pick<
  Statement,
  'user_id' |
  'sender_id' |
  'description' |
  'amount'
>
