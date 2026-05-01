import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const mockVerifyIdToken = vi.fn();

vi.mock('../services/firebase-admin', () => ({
  getAuth: () => ({ verifyIdToken: mockVerifyIdToken }),
}));

describe('requireAuth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('returns 401 when Authorization header is missing', async () => {
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is not Bearer format', async () => {
    req.headers = { authorization: 'Basic some-credentials' };
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token verification fails', async () => {
    req.headers = { authorization: 'Bearer invalid-token' };
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user when token is valid', async () => {
    req.headers = { authorization: 'Bearer valid-token' };
    const decodedToken = { uid: 'user-123', email: 'test@example.com' };
    mockVerifyIdToken.mockResolvedValue(decodedToken);
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledOnce();
    expect((req as any).user).toEqual(decodedToken);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes only the token (not "Bearer ") to verifyIdToken', async () => {
    req.headers = { authorization: 'Bearer my-token-123' };
    mockVerifyIdToken.mockResolvedValue({ uid: 'u1' });
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('my-token-123');
  });
});
