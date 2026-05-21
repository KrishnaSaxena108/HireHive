jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  }))
}));

const nodemailer = require('nodemailer');
const resolvers = require('../src/graphql/resolvers');

describe('contact form email', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('uses Nodemailer transport and sends a message', async () => {
    process.env.MAIL_TRANSPORT = 'json';
    process.env.EMAIL_USER = 'sender@example.com';
    process.env.EMAIL_PASS = 'secret';
    process.env.ADMIN_EMAIL = 'admin@example.com';

    const result = await resolvers.Mutation.submitContactForm(
      null,
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello from the contact form'
      }
    );

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      jsonTransport: true
    });

    expect(result).toEqual({
      id: expect.any(String),
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello from the contact form'
    });
  });
});
