export const getPercentageDiff = (newNumber, originalNumber) => {
  if (!originalNumber) return "100";
  const increase = newNumber - originalNumber;
  const fraction = increase / originalNumber;

  const percentDiff = fraction * 100;

  return percentDiff.toFixed(2);
};

export const getFractionDiff = (newNumber, originalNumber) => {
  if (!originalNumber) return "100";
  const increase = newNumber - originalNumber;
  return increase / originalNumber;
};

export const getColors = (percent) => {
  const percentNumber = Number(percent);

  if (percentNumber === 0) return "AAAAAA";

  if (percentNumber < -75) return "390E0A";
  if (percentNumber < -50) return "C11101";
  if (percentNumber < -25) return "FE3A29";
  if (percentNumber < -0) return "FE998F";

  if (percentNumber > 75) return "297057";
  if (percentNumber > 50) return "33906F";
  if (percentNumber > 25) return "3DB088";
  if (percentNumber > 0) return "54C59D";
};

export const getColors2 = (percent) => {
  const percentNumber = Number(percent);

  if (percentNumber === 0) return "AAAAAA";

  if (percentNumber < -22.5) return "FF0000 ";
  if (percentNumber < -15) return "FF1A00";
  if (percentNumber < -7.5) return "FF3300";
  if (percentNumber < -0) return "FF4D00";

  if (percentNumber > 22.5) return "00FF00 ";
  if (percentNumber > 15) return "FFCC00 ";
  if (percentNumber > 7.5) return "FFB300";
  if (percentNumber > 0) return "FF9900";
};

export const hexToRgb = (hex) => {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return r + "," + g + "," + b;
};
