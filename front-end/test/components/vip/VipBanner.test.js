import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VipBanner from '../../../src/components/vip/vipBanner';

// Mock dependencies and hooks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "vip.title": "VIP Title",
        "vip.description": "VIP Description",
        "vip.month": "month",
        "vip.better_puzzle": "Better Puzzle",
        "vip.better_puzzle_info_description": "Better Puzzle Info",
        "vip.powerful_ai": "Powerful AI",
        "vip.powerful_ai_info_description": "Powerful AI Info",
        "vip.special_tag": "Special Tag",
        "vip.special_tag_info_description": "Special Tag Info",
        "vip.upgrade_your_vip": "Upgrade Your VIP",
      };
      return translations[key];
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../src/lib/number', () => ({
  formatNumber: (number) => number.toString(),
}));

describe('VipBanner', () => {
  test('renders the VipBanner component', () => {
    render(
      <BrowserRouter>
        <VipBanner />
      </BrowserRouter>
    );

    // Check for the title displayed
    expect(screen.getByText('VIP Title')).toBeInTheDocument();

    // Check for the description
    expect(screen.getByText('VIP Description')).toBeInTheDocument();

    // Check for price displayed
    expect(screen.getByText('200000')).toBeInTheDocument();
    expect(screen.getByText('vnđ / month')).toBeInTheDocument();

    // Check for feature list items
    expect(screen.getByText('Better Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Better Puzzle Info')).toBeInTheDocument();
    expect(screen.getByText('Powerful AI')).toBeInTheDocument();
    expect(screen.getByText('Powerful AI Info')).toBeInTheDocument();
    expect(screen.getByText('Special Tag')).toBeInTheDocument();
    expect(screen.getByText('Special Tag Info')).toBeInTheDocument();
  });

  test('navigates to /billing on button click', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <VipBanner />
      </BrowserRouter>
    );

    const button = screen.getByText(/Upgrade Your VIP/i);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/billing');
  });
});
