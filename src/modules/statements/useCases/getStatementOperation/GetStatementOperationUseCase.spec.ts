import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operations", () => {
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
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

    const statementOperation = await getStatementOperationUseCase.execute(
      {
        statement_id: createdStatement.id || '',
        user_id: createdUser.id || '',
      }
    )

    expect(statementOperation).toHaveProperty("id");
  });

  it("Should not be able to create a new statement with invalid user id", async () => {

    expect(async () => {
      const newStatement = {
        user_id: 'invalid_user_id',
        type: 'deposit' as OperationType,
        amount: 10,
        description: 'description'
      };

      const createdStatement = await createStatementUseCase.execute(newStatement);
    }).rejects.toBeInstanceOf(AppError)
  });

});
