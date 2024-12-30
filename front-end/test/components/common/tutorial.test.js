import React from 'react';
import renderer from 'react-test-renderer';
import Tutorial from '../../../src/components/common/tutorial';

describe('Components > Tutorial', () => {
  it('renders a snapshot for Tutorial using renderer', () => {
    const tree = renderer.create(
        <Tutorial />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
