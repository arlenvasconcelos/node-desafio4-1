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
let statement_id = ''

describe("Get Statement Operation Controller", () => {

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

    const response = await await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: 'description deposit statement'
      })
      .set({
        Authorization: `Bearer ${userToken}`
      })

      statement_id = response.body.id
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able get a statement operation", async () => {

    const getOperationResponse = await await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${userToken}`
      })

    expect(getOperationResponse.statusCode).toBe(200);
    expect(getOperationResponse.body.id).toBe(statement_id);
  });

  it("should not be able to get a non-existing statement operation",async () => {

    const response = await await request(app)
      .get(`/api/v1/statements/wrong_statement_id`)
      .set({
        Authorization: `Bearer ${userToken}`
      })

    expect(response.statusCode).toBe(500);
  });

  it("should not be able to get statement operation if user is not authenticated",async () => {

    const response = await await request(app)
      .get(`/api/v1/statements/${statement_id}`)

    expect(response.statusCode).toBe(401);
  });

});
