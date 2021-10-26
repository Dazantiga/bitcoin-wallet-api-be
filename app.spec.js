const request = require("supertest");
const app = require("./server");

describe("Test app server", () => {
  it("should get route welcome", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("message");
  });
});
