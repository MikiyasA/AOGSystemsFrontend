import { Box, Text } from "@mantine/core";
import { API_URL } from ".";
import { modals } from "@mantine/modals";
import { getSession } from "next-auth/react";

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
  const session: any = await getSession();
  await fetch(`${API_URL}/Attachment/DownloadAttachment/${attachmentId}`, {
    headers: {
      Authorization: `Bearer ${session?.token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        modals.open({
          title: "Error on Downloading File",
          size: "40%",
        });
        throw new Error(`${res.statusText}`);
      }
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}${fileType}`;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error exporting to Excel:", error);
    });
}