import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const cleanNumber = (phone) => {
  return phone.replace(/[^\d+]/g, ""); // Keep only digits and +
};

export const normalizePhoneNumber = (phone) => {
  const cleanedNumber = cleanNumber(phone);

  // if the cleanedNumber is already in international format return it
  const internationalFormatRegex = /^\+\d{1,3}\d{10}$/;
  if (internationalFormatRegex.test(cleanedNumber)) {
    return cleanedNumber; // Return as is
  }

  // if not, add the default country code based on device settings
  const deviceRegion = "IN";
  try {
    const parsedNumber = phoneUtil.parse(cleanedNumber, deviceRegion);

    // format the parsed number
    const formattedNumber = phoneUtil.format(
      parsedNumber,
      PhoneNumberFormat.E164
    );
    return formattedNumber;
  } catch (error) {
    console.log(error);
    return "-1";
  }
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};
