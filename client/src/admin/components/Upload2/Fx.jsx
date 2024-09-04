export const formatDate = (dateString) => {
  const thaiMonthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const date = new Date(dateString);
  const day = String(date.getDate());
  const month = String(date.getMonth());
  const year = date.getFullYear();
  const th = `${day} ${thaiMonthNames[date.getMonth()]} ${year + 543}`;
  const thdm = `${day} ${thaiMonthNames[date.getMonth()]}`;
  const en = `${day}${month}${year}`;

  return { th, en, thdm };
};

export const range = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 1);
  const days = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d).toISOString().split("T")[0]);
  }
  return days;
};

export function dateToUint32(dateString) {
  const [year, month, day] = dateString.split("-");

  const uint32Date = parseInt(year + month + day, 10);

  return uint32Date;
}

export function formatToThaiDate(dateNumber) {
  if (Array.isArray(dateNumber)) {
    return dateNumber.map((d) => formatSingleDate(d));
  } else {
    return [formatSingleDate(dateNumber)];
  }
}

export function formatSingleDate(dateNumber) {
  // Debugging line
  if (
    typeof dateNumber === "string" ||
    typeof dateNumber === "number" ||
    typeof dateNumber === "bigint"
  ) {
    const dateStr = dateNumber.toString().padStart(8, "0");
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.slice(6, 8), 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);

      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      const buddhistYear = year + 543;
      const thaiDate = `${day} ${thaiMonths[month]} ${buddhistYear}`;

      return thaiDate;
    } else {
      console.error("Invalid date parts:", year, month, day);
      return "Invalid date";
    }
  } else {
    console.error("Invalid dateNumber format:", dateNumber);
    return "Invalid date";
  }
}
