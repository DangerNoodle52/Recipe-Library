import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, includes } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login.jsx';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //later, login button with switch window location to 5173
  });
  test('login works correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            authenticated: true,
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
    //the submission of form
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);

    //wait and verify results
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });
});
