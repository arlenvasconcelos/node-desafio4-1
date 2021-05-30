import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createdUser: User;

describe("Create statement", () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );

    const newUser = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    createdUser = await createUserUseCase.execute(newUser);

  });

  it("Should be able to create a new deposit statement", async () => {


    const newStatement = {
      user_id: createdUser.id || '',
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'description'
    };

    const createdStatement = await createStatementUseCase.execute(newStatement);

    expect(createdStatement).toHaveProperty("id");
  });

  it("Should be able to create a new withdraw statement", async () => {

    const newStatement = {
      user_id: createdUser.id || '',
      type: 'withdraw' as OperationType,
      amount: 10,
      description: 'description'
    };

    const createdStatement = await createStatementUseCase.execute(newStatement);

    expect(createdStatement).toHaveProperty("id");
  });

  it("Should not be able to create a new withdraw statement if insufficient funds", async () => {
    expect(async () => {
      const newStatement = {
        user_id: createdUser.id || '',
        type: 'withdraw' as OperationType,
        amount: 10,
        description: 'description'
      };

      const createdStatement = await createStatementUseCase.execute(newStatement);

    }).rejects.toBeInstanceOf(AppError);
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
