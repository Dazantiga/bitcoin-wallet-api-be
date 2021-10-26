const { formatDate, formatDateBR, calculateBitcoin } = require("./helpers");

describe("Test Helpers", () => {
  it("should get formatDate", async () => {
    const result = formatDate(new Date(2021, 9, 26));
    expect(result).toBe("2021-10-26");
  });

  it("should get formatDateBR", async () => {
    const result = formatDateBR(new Date(2021, 9, 26));
    expect(result).toBe("26/10/2021");
  });

  it("should get calculateBitcoin", async () => {
    const result = calculateBitcoin(500, 200000);
    expect(result).toBe(0.0025);
  });
});
