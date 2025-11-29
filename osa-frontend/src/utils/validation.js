export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
 
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

export const validatePhoneNumber = (phone) => {
  
  const re = /^[\d\s\-+()]+$/; 
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
};

export const getErrorMessage = (field, type = 'required') => {
  const messages = {
    required: `${field} is required`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    phone: 'Please enter a valid phone number',
    date: 'Please enter a valid date',
    dateRange: 'End date must be after start date'
  };
  return messages[type] || `Invalid ${field}`;
};
