// Test simple para verificar que Jest funciona
describe('App Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const appName = 'spacexlaunches';
    expect(appName).toBe('spacexlaunches');
    expect(appName.length).toBeGreaterThan(0);
  });

  it('should handle array operations', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
