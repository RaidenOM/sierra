import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import * as Localization from "expo-localization";

const phoneUtil = PhoneNumberUtil.getInstance();

export const normalizePhoneNumber = (phone) => {
  // Remove all non-numeric characters except "+"
  let normalizedNumber = phone.replace(/\D/g, "");

  // Keep only the last 10 digits
  if (normalizedNumber.length > 10) {
    normalizedNumber = phone.slice(-10);
  }

  console.log(normalizedNumber);

  // Get the current country code from the device's locale (e.g., "IN", "US")
  const countryCode = "IN"; // e.g., "IN", "US"

  if (!countryCode) {
    return null; // Country code not found
  }

  try {
    // Parse the phone number using the current country code
    const number = phoneUtil.parseAndKeepRawInput(
      normalizedNumber,
      countryCode
    );

    return phoneUtil
      .format(number, PhoneNumberFormat.INTERNATIONAL)
      .replace(/[^+\d]/g, "");
  } catch (error) {
    console.error("Error normalizing phone number:", error);
    return null; // Return null if parsing fails
  }
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+\d{1,3}\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return false;
  }
  return true;
};
