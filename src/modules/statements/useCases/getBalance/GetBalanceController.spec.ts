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

let userToken = ''

describe("Get Balance Controller", () => {

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

  it("should be able to get balance", async () => {

    const response = await await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${userToken}`
      })

    expect(response.statusCode).toBe(200);
  });

  it("should not be able to get balance if user is not authenticated",async () => {

    const response = await await request(app)
      .get("/api/v1/statements/balance")

    expect(response.statusCode).toBe(401);
  });

});
