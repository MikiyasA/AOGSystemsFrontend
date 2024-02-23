import { API_URL } from ".";

export const formatDate = (value: any) => {
  if (typeof value === 'string') {
    // Check if the value can be parsed as a valid date
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      // If it's a valid date, format it
      return dateValue.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    const htmlRegex = /<[^>]*>/g;
    if (htmlRegex.test(value)) {
      // If it's HTML content, extract text content
      return value.replace(htmlRegex, '');
    }

  }
  return value;
};

export const hasValue = (value: any) => {
  return value !== null;
}

export const getUserNameById = (users: any, id: any) => {
  
  // Find the user with the matching ID
  const user = users?.find((user: any) => user.id === id);

  // Return the first name if the user is found, otherwise return null
  return user ? `${user.firstName} ${user.lastName}` : null;
};

export const camelToAllCapital = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .toUpperCase(); // Convert entire string to uppercase
};

export const downloadFile = async (attachmentId: any, fileName: any, fileType: any) => {
  try {
    const downloadUrl = `${API_URL}/Attachment/DownloadAttachment/${attachmentId}`;
    const response = await fetch(downloadUrl);
    const blob = await response.blob();

    // Create a temporary link to trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}${fileType}`; // Set the file name for download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

