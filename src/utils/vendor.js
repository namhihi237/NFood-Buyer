
import _ from 'lodash';

class Vendor {
  checkOpen(item) {
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const timeOpen = item?.timeOpen || [];

    // convert currentDay to string
    let currentDayString = "";
    if (currentDay === 0) {
      currentDayString = "8";
    } else {
      currentDayString = (currentDay + 1).toString();
    }

    // check timeOpen
    const timeOpenItem = _.find(timeOpen, { day: currentDayString, isOpen: true });
    if (!timeOpenItem) {
      return {
        isOpen: false,
        text: 'Chưa mở cửa'
      };
    }

    // check timeOpen
    const start = parseFloat(timeOpenItem.openTime.split(':')[0] + "." + timeOpenItem.openTime.split(':')[1]);
    const end = parseFloat(timeOpenItem.closeTime.split(':')[0] + "." + timeOpenItem.closeTime.split(':')[1]);
    const currentFloat = parseFloat(currentHour + "." + currentMinute);
    if (currentFloat < start || currentFloat > end) {
      return {
        isOpen: false,
        text: 'Chưa mở cửa'
      };
    }

    return {
      isOpen: true,
      text: 'Đang mở cửa'
    }
  }
}

export default new Vendor();