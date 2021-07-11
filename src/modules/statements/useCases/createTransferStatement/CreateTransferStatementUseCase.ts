import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferStatementError } from "./CreateTransferStatementError";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";

enum OperationType {
  TRANSFER = 'transfer',
}

@injectable()
export class CreateTransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, amount, description, sender_id }: ICreateTransferStatementDTO) {

    if (user_id === sender_id){
      throw new CreateTransferStatementError.SameUserAndSender();
    }

    if(!sender_id) {
      throw new CreateTransferStatementError.UserNotFound();
    }

    const user = await this.usersRepository.findById(user_id);
    const sender = await this.usersRepository.findById(sender_id);

    if(!user || !sender) {
      throw new CreateTransferStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferStatementError.InsufficientFunds()
    }


    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return statementOperation;
  }
}
