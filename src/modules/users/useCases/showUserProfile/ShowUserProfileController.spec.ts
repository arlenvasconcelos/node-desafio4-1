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

  it("should be able to show a user profile", async () => {

    const sessionResponse = await await request(app)
      .post("/api/v1/sessions")
      .send({
        email: mockedUser.email,
        password: mockedUser.password,
      })

    const {token} = sessionResponse.body

    const profileResponse = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(profileResponse.statusCode).toBe(200)
    expect(profileResponse.body.name).toEqual(mockedUser.name)
  });

  it("should not be able to show a profile if user is not authenticated", async () => {

    const profileResponse = await request(app)
      .get("/api/v1/profile")

    expect(profileResponse.statusCode).toBe(401)
  });

});
