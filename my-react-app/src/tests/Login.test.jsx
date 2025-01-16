import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, includes } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login.jsx';

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('login works correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            email: 'test@gmail.com',
            password: 'dangerousnoodles',
          }),
      })
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    //inputs
    const emailInput = screen.getByPlaceholderText(/Email.../i);
    const passwordInput = screen.getByPlaceholderText(/Password.../i);

    //the click
    const loginButton = screen.getByPlaceholderText('Login');
    fireEvent.click(loginButton);

    //wait and verify results
    await waitFor(() => {
      expect(window.location.href).includes('/search');
    });
  });
});
