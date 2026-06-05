import { AuthResponse } from './auth.models';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
  });

  it('starts unauthenticated with no tokens', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.getAccessToken()).toBeNull();
    expect(store.getRefreshToken()).toBeNull();
    expect(store.hasRole('ADMIN')).toBe(false);
  });

  it('stores session tokens, user data, and role membership', () => {
    const response = createAuthResponse();

    store.setSession(response);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.getAccessToken()).toBe(response.accessToken);
    expect(store.getRefreshToken()).toBe(response.refreshToken);
    expect(store.hasRole('ADMIN')).toBe(true);
    expect(store.hasRole('CUSTOMER')).toBe(false);
  });

  it('emits user changes when session state changes', () => {
    const emissions = new Array<AuthResponse['user'] | null>();
    const subscription = store.user$.subscribe((user) => {
      emissions.push(user);
    });
    const response = createAuthResponse();

    store.setSession(response);
    store.clearSession();
    subscription.unsubscribe();

    expect(emissions).toEqual([null, response.user, null]);
  });

  it('clears session state', () => {
    store.setSession(createAuthResponse());

    store.clearSession();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.getAccessToken()).toBeNull();
    expect(store.getRefreshToken()).toBeNull();
    expect(store.hasRole('ADMIN')).toBe(false);
  });
});

function createAuthResponse(): AuthResponse {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
    user: {
      id: 'user-1',
      email: 'admin@example.com',
      roles: ['ADMIN'],
      permissions: ['CREATE_PRODUCT'],
    },
  };
}
