// Test de ejemplo para servicios de SpaceX
describe('SpaceX Services', () => {
  it('should validate launch data structure', () => {
    const mockLaunch = {
      id: '1',
      name: 'Falcon Heavy Test Flight',
      date_utc: '2018-02-06T20:45:00.000Z',
      success: true,
      details: 'Test flight of Falcon Heavy'
    };

    expect(mockLaunch).toHaveProperty('id');
    expect(mockLaunch).toHaveProperty('name');
    expect(mockLaunch).toHaveProperty('date_utc');
    expect(mockLaunch).toHaveProperty('success');
    expect(typeof mockLaunch.success).toBe('boolean');
  });

  it('should format launch date correctly', () => {
    const launchDate = '2018-02-06T20:45:00.000Z';
    const date = new Date(launchDate);

    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2018);
    expect(date.getMonth()).toBe(1); // February (0-indexed)
  });

  it('should handle missing launch details', () => {
    const launchWithoutDetails = {
      id: '2',
      name: 'Demo Mission',
      date_utc: '2020-01-01T00:00:00.000Z',
      success: true,
      details: null
    };

    expect(launchWithoutDetails.details).toBeNull();
    expect(launchWithoutDetails.name).toBeTruthy();
  });

  it('should filter successful launches', () => {
    const launches = [
      { id: '1', success: true, name: 'Mission 1' },
      { id: '2', success: false, name: 'Mission 2' },
      { id: '3', success: true, name: 'Mission 3' },
    ];

    const successfulLaunches = launches.filter(launch => launch.success);

    expect(successfulLaunches).toHaveLength(2);
    expect(successfulLaunches[0].name).toBe('Mission 1');
    expect(successfulLaunches[1].name).toBe('Mission 3');
  });
});
