import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {

    const mockedUser = {
      name: "user",
      email: "user@user.com",
      password: "user",
    }
    const response = await request(app).post("/api/v1/users").send(mockedUser);

    expect(response.statusCode).toBe(201);
  });

  it("should not be able to create a new user with same email", async () => {

    const response = await request(app).post("/api/v1/users").send(
      {
        name: "user",
        email: "user@user.com",
        password: "user",
      }
    );

    expect(response.statusCode).toBe(400);
  });

  it("should not be able to create a new user without email", async () => {

    const response = await request(app).post("/api/v1/users").send(
      {
        name: "test",
        password: "test",
      }
    );

    expect(response.statusCode).toBe(500);
  });
});
