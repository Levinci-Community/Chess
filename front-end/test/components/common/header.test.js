import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../../../src/components/common/header'; 
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../src/lib/auth', () => ({
  getUserData: () => ({
    id: 1,
    name: 'Test User',
    avatar: '/test-avatar.png',
    role: 'USER'
  }),
}));

jest.mock('../../../src/components/common/sidebar', () => (props) => <div data-testid="sidebar" {...props} />);
jest.mock('../../../src/components/common/tutorial', () => () => <div data-testid="tutorial">Tutorial Component</div>);

describe('Components > Header', () => {
  it('renders a snapshot for Header using renderer', () => {
    const tree = renderer.create(
      <Router>
            <Header />
          </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
