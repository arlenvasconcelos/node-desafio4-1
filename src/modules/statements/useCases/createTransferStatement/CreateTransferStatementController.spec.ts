import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;

const mockedUser = {
  name: "user",
  email: "user@user.com",
  password: "user",
}

let userToken = ''

describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    //Create a new user
    await request(app).post("/api/v1/users").send(mockedUser);

    const sessionResponse = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: mockedUser.email,
      password: mockedUser.password,
    })

    userToken = sessionResponse.body.token
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit statement", async () => {

    const response = await await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: 'description deposit statement'
      })
      .set({
        Authorization: `Bearer ${userToken}`
      })

    expect(response.statusCode).toBe(201);
    expect(response.body.type).toEqual('deposit');
  });

  it("should be able to create a withdraw statement", async () => {

    const response = await await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 10,
        description: 'description withdraw statement'
      })
      .set({
        Authorization: `Bearer ${userToken}`
      })

    expect(response.statusCode).toBe(201);
    expect(response.body.type).toEqual('withdraw');
  });

  it("should not be able to create a withdraw statement if insufficient funds",
    async () => {

      const response = await await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
          amount: 10,
          description: 'description withdraw statement'
        })
        .set({
          Authorization: `Bearer ${userToken}`
        })

      expect(response.statusCode).toBe(400);
    });

  it("should not be able to create a withdraw if user is not authenticated",async () => {

    const response = await await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 10,
        description: 'description withdraw statement'
      })

    expect(response.statusCode).toBe(401);
  });

  it("should not be able to create a deposit if user is not authenticated",async () => {

    const response = await await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: 'description deposit statement'
      })

    expect(response.statusCode).toBe(401);
  });

});
