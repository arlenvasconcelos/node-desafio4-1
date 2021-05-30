import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to create a new user", async () => {
    const newUser = {
      name:"user",
      email:"user@user.com",
      password:"123456"
    };

    const createdUser = await createUserUseCase.execute(newUser);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.email).toEqual("user@user.com");
  });

  it("Should not be able to create user with same email", () => {
    expect(async () => {
      const user = {
        name:"user",
        email:"user@user.com",
        password:"123456"
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
