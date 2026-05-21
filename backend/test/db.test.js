const db = require('../models');

describe('database connection', () => {
  afterAll(async () => {
    await db.sequelize.close();
  });

  test('authenticates successfully with the configured database', async () => {
    await expect(db.sequelize.authenticate()).resolves.toBeUndefined();
  });

  test('can read the users table', async () => {
    const userCount = await db.User.count();
    expect(userCount).toEqual(expect.any(Number));
    expect(userCount).toBeGreaterThanOrEqual(0);
  });
});
