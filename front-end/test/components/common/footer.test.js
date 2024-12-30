// Example test for Footer component

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for enhanced matchers

import Footer from '../../../src/components/common/footer'; // adjust import path as per your project structure

describe('Footer Component', () => {
  test('renders UTE CHESS CLUB logo and name', () => {
    render(<Footer />);

    // Check for UTE CHESS CLUB text
    expect(screen.getByText('UTE CHESS CLUB')).toBeInTheDocument();

    // Check for logo alt text
    expect(screen.getByAltText('UTE CHESS CLUB')).toBeInTheDocument();
  });

  // Add more tests for links and other components as needed
});
