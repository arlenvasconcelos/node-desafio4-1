import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;

const mockedUser = {
  name: "admin",
  email: "admin@admin.com",
  password: "admin",
}

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(mockedUser);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {

    const response = await await request(app)
      .post("/api/v1/sessions")
      .send({
        email: mockedUser.email,
        password: mockedUser.password,
      })

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toEqual(mockedUser.email);
  });

  it("should not be able to authenticate a user with wrong email", async () => {

    const response = await await request(app)
      .post("/api/v1/sessions")
      .send({
        email: 'wrong@email.com',
        password: mockedUser.password,
      })

    expect(response.statusCode).toBe(401);
  });

  it("should not be able to authenticate a user with wrong password", async () => {

    const response = await await request(app)
      .post("/api/v1/sessions")
      .send({
        email: mockedUser.email,
        password: 'wrong_password',
      })

    expect(response.statusCode).toBe(401);
  });
});
