import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferStatementError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class SameUserAndSender extends AppError {
    constructor() {
      super('Same user and sender ids', 400);
    }
  }
}
