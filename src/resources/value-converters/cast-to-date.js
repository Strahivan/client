export class CastToDateValueConverter {
  toView(date) {
    if (!date) {
      return null;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = String(month).length === 1 ? ('0' + String(month)) : String(month);
    let day = d.getDate();
    day = String(day).length === 1 ? ('0' + String(day)) : String(day);

    return `${year}-${month}-${day}`;
  }

  fromView(date) {
    return (new Date(date)).toISOString();
  }
}

