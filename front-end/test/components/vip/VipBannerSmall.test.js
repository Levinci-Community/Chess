// src/__test__/components/VipBannerSmall.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import VipBannerSmall from '../../../src/components/vip/VipBannerSmall';

jest.mock('../../../src/components/vip/updateVipNow', () => () => <div>UpdateVipNow Component</div>);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "vip.title": "VIP Title",
        "vip.description": "VIP Description",
        "vip.month": "month",
        "vip.better_puzzle": "Better Puzzle",
        "vip.better_puzzle_info": "Better Puzzle Info",
        "vip.powerful_ai": "Powerful AI",
        "vip.powerful_ai_info": "Powerful AI Info",
        "vip.special_tag": "Special Tag",
        "vip.special_tag_info": "Special Tag Info"
      };
      return translations[key];
    },
  }),
}));

describe('Components > VipBannerSmall', () => {
  it('renders a snapshot for VipBannerSmall using renderer', () => {
    const tree = renderer.create(<VipBannerSmall />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
