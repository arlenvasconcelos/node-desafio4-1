import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("Should be able to get a statement operation", async () => {

    const newUser = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    const createdUser = await createUserUseCase.execute(newUser);

    const newStatement = {
      user_id: createdUser.id || '',
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'description'
    };

    const createdStatement = await createStatementUseCase.execute(newStatement);

    const statementOperation = await getBalanceUseCase.execute(
      {
        user_id: createdUser.id || '',
      }
    )

    expect(createdStatement.amount).toEqual(statementOperation.balance);
  });

  it("Should not be able to get balance with invalid user id", async () => {

    expect(async () => {
      const createdStatement = await getBalanceUseCase.execute(
        {
          user_id: 'invalid_user_id'
        }
      );
    }).rejects.toBeInstanceOf(AppError)
  });

});
