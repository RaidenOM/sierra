export const normalizePhoneNumber = (phone) => {
  // Remove all non-numeric characters except "+"
  let normalizedNumber = phone.replace(/\D/g, "");

  // Check if the number already starts with '+'
  if (normalizedNumber.startsWith("+")) {
    // If it starts with '+', it's already in international format, return as is
    return normalizedNumber;
  }

  // Check if the number is 10 digits (local number without country code)
  if (normalizedNumber.length === 10) {
    // Assuming it's an Indian number, prepend the country code (you can modify this for other countries)
    return "+91" + normalizedNumber;
  }

  // If the number is 12 digits (country code included but without '+')
  if (normalizedNumber.length === 12) {
    // Prepend the "+" to the country code and number
    return "+" + normalizedNumber;
  }

  // If it's a number with more or fewer digits, it's invalid. You can handle this differently if needed.
  return null; // Return null for invalid numbers
};
