// Test básico para verificar que los hooks de testing funcionan
describe('Testing Utils', () => {
  it('should handle basic operations', () => {
    const value = 'test';
    expect(value).toBe('test');
  });

  it('should handle async operations', async () => {
    const mockAsyncFunction = jest.fn().mockResolvedValue('success');
    const result = await mockAsyncFunction();

    expect(result).toBe('success');
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle object operations', () => {
    const obj = { name: 'SpaceX', launches: 100 };
    expect(obj).toHaveProperty('name');
    expect(obj.launches).toBeGreaterThan(0);
  });
});
