import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show a user profile", async () => {
    const newUser = {
      name:"user",
      email:"user@user.com",
      password:"123456"
    };

    const createdUser = await createUserUseCase.execute(newUser);

    const userProfile = await showUserProfileUseCase.execute(createdUser.id ?? '');

    expect(userProfile).toHaveProperty("id");
    expect(createdUser.email).toEqual("user@user.com");
  });

  it("Should not be able to show a user profile if user does not exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('non-existing id');

    }).rejects.toBeInstanceOf(AppError);
  });
});
