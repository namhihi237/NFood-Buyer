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

export const listCarts = atom({
  key: 'listCarts',
  default: [],
});


export const numberOfCarts = atom({
  key: 'numberOfCarts',
  default: 0,
});

export const myAddress = atom({
  key: 'address',
  default: '',
})