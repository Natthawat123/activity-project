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

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return [null, null, null, null]; // Return nulls for invalid dates
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.getMonth();
  const year = date.getFullYear() + 543; // Convert to Thai year

  const th = `${day} ${thaiMonthNames[month]} ${year}`;
  const thdm = `${day} ${thaiMonthNames[month]}`;
  const en = `${day}/${month + 1}/${year - 543}`; // Adjust for zero-based month
  const s = dateString.slice(0, 10).replace(/-/g, ""); // YYYYMMDD format

  return [th, en, thdm, s];
};

export const dateSort = (dateString) => {
  return dateString.slice(0, 10).replace(/-/g, "");
};

export const range = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
};
