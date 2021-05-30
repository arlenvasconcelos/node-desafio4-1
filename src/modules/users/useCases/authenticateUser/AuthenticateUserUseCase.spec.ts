import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

const mockedUser = {
  name:"user",
  email:"user@user.com",
  password:"123456"
};

describe("Show user profile", () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );

    await createUserUseCase.execute(mockedUser);
  });

  it("Should be able to authenticate a user", async () => {
    const authResponse = await authenticateUserUseCase.execute(
      {
        email: mockedUser.email,
        password:mockedUser.password
      }
    );

    expect(authResponse).toHaveProperty("token");
    expect(authResponse.user.email).toEqual("user@user.com");
  });

  it("Should not be able to authenticate a user with wrong email", () => {
    expect(async () => {
      await authenticateUserUseCase.execute(
        {
          email: "teste@email.com",
          password:mockedUser.password
        }
      );

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate a user with wrong password", () => {
    expect(async () => {
      await authenticateUserUseCase.execute(
        {
          email: mockedUser.email,
          password:"wrong_password"
        }
      );

    }).rejects.toBeInstanceOf(AppError);
  });
});
