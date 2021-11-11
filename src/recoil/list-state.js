import { atom, selector } from 'recoil';

export const gps = atom({
  key: 'gps',
  default: false,
});

export const locationGPS = atom({
  key: 'location',
  default: {
    latitude: null,
    longitude: null,
  },
});