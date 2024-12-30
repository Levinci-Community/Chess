import React from 'react';
import renderer from 'react-test-renderer';
import { ChakraProvider } from "@chakra-ui/react";
import ChatBox from '../../../src/components/chat/chatbox';
import appSettings from '../../../src/settings/appSettings';

jest.mock('../../../src/lib/auth', () => ({
  getUserData: () => ({ id: '1', username: 'testuser' }),
}));

jest.mock('../../../src/settings/appSettings', () => ({
  OPENAI_KEY: appSettings.OPENAI_KEY,
}));

describe('ChatBox component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ChakraProvider>
        <ChatBox />
      </ChakraProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
