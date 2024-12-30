import React from 'react';
import renderer from 'react-test-renderer';
import Sidebar from '../../../src/components/common/sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";

const data = [
  { id: 1, title: 'Home', link: '/' },
  { id: 2, title: 'About', link: '/about' },
];

describe('Components > Sidebar', () => {
  it('renders a snapshot for Sidebar using renderer', () => {
    const tree = renderer.create(
      <ChakraProvider>
        <Router>
          <Sidebar data={data} isOpen={true} onClose={() => {}} />
        </Router>
      </ChakraProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
