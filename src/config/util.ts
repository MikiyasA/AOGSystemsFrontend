export const formatDate = (dateIn: any) => {
    const date = dateIn ? new Date(dateIn) : null;
    const formattedDate = date?.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

export const hasValue = (value: any) => {
  return value !== null;
}