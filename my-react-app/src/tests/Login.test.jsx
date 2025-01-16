import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, includes } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login.jsx';

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //later, login button with switch window location to 5173
    const windowLocation = new URL('http://localhost:3000');
    vi.spyOn(window, 'location', 'get').mockImplementation(
      () => windowLocation
    );
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
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    //fireEvent simulates person filling out email and password fields
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'dangerousnoodles' } });
    //the click
    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);

    //wait and verify results
    await waitFor(() => {
      expect(window.location.href).to.include('http://localhost:5173/search');
    });
  });
});
