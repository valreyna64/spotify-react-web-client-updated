import type { IncomingMessage, ServerResponse } from 'http';
const handler = require('../../api/hello');

describe('hello API handler', () => {
  it('responds with Hello world', () => {
    const req = {} as IncomingMessage;
    const res = { statusCode: 0, end: jest.fn() } as unknown as ServerResponse;
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith('Hello world');
  });
});
