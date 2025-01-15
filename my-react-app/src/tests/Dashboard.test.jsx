import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard.jsx';

//container for dashboard tests
describe('Dashboard', () => {
  test('search by name works correctly', async () => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            meals: [
              {
                idMeal: '1',
                strMeal: 'Spaghetti',
                strMealThumb: 'image-url',
                strArea: 'Italian',
                strCategory: 'Pasta',
              },
            ],
          }),
      })
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Input search term
    const searchInput = screen.getByPlaceholderText(/Recipe name.../i);
    fireEvent.change(searchInput, { target: { value: 'spaghetti' } });

    // Click search
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    // Wait for and verify results
    await waitFor(() => {
      expect(screen.getByText('Spaghetti')).toBeDefined();
    });
  });
});
