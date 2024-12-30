import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserInfo from '../../../src/components/user_profile/user_info';

jest.mock('axios'); 

describe('UserInfo Component', () => {
  test('renders UserInfo with user data', async () => {
    jest.spyOn(require('../../../src/lib/auth'), 'getUserData').mockReturnValue({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      avatar: 'https://example.com/avatar.jpg',
    });

    require('axios').get.mockResolvedValue({
      data: {
        is_vip: true,
        vip_expiry: new Date('2025-12-31'),
      },
    });

    render(<UserInfo />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('VIP until 2025-12-31')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Change Password'));

    expect(screen.getByText('Change Password Modal Content')).toBeInTheDocument();
  });
});
