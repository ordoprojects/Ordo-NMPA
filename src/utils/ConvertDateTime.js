import React from 'react';

const ConvertDateTime = (timestamp, dateFormat = 'DD-MM-YYYY') => {
  // Convert timestamp to Date object
  const dateObject = new Date(timestamp);

  // Extract date components
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Month is zero-based
  const year = dateObject.getFullYear();

  // Format date based on the provided dateFormat
  let formattedDate;
  switch(dateFormat) {
    case 'DD-MM-YYYY':
      formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
      break;
    case 'MM-DD-YYYY':
      formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;
      break;
    case 'YYYY-MM-DD':
      formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
      break;
    default:
      formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
  }

  // Extract time components
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  // Format time as 12-hour clock format
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return { formattedDate, formattedTime };
};

export default ConvertDateTime;
