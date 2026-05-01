describe('Frontend smoke test', () => {
  it('has NEXT_PUBLIC_FIREBASE_PROJECT_ID defined', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
  });

  it('has NEXT_PUBLIC_API_URL defined', () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
  });
});
