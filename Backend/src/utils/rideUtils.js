
export const calculateRideDurationHours = (fromPincode, toPincode) => {
  let hours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
  return hours === 0 ? 1 : hours;
};
