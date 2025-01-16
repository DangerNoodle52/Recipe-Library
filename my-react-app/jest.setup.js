jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  Schema: jest.fn(),
  model: jest.fn(),
  Schema: {
    Types: {
      ObjectId: String,
    },
  },
}));
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};
module.exports = {
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
};
