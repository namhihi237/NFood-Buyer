import { atom, selector } from 'recoil';

export const gps = atom({
  key: 'gps',
  default: false,
});

export const location = atom({
  key: 'location',
  default: {

  },
});