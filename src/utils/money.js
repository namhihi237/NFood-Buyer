
class MoneyUtils {
  convertStringToVND(money) {
    // convert format money VND
    if (!money) {
      return 0;
    }

    if (money.indexOf('.') !== -1) {
      money = money.replace(/\./g, '');
    }

    if (money.indexOf(',') !== -1) {
      money = money.replace(/,/g, '');
    }
    return money;
  }

  convertVNDToString(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  }
}

export default new MoneyUtils();