describe('createApiClient', () => {
  it('exports a createApiClient function', async () => {
    const mod = await import('../lib/api-client');
    expect(typeof mod.createApiClient).toBe('function');
  });

  it('creates a client with health and chat methods', async () => {
    const { createApiClient } = await import('../lib/api-client');
    const client = createApiClient(async () => 'mock-token');
    expect(typeof client.health).toBe('function');
    expect(typeof client.chat).toBe('function');
  });
});
