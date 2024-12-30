// __mocks__/gapi-script.js
export const gapi = {
  load: jest.fn(),
  client: {
    init: jest.fn(),
  },
};
export const gapiComplete = jest.fn();
