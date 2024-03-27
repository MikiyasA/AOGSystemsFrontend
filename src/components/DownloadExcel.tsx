import React from "react";
import { Button } from "@mantine/core";
import * as XLSX from "xlsx";
import { formatDate, camelToAllCapital } from "@/config/util";

const jsonToExcel = (data: any, filename: any) => {
  const excludedKeys = [
    "id",
    "partId",
    "followUpTabsId",
    "createdat",
    "updatedat",
    "createdby",
    "updatedby",
  ];

  // const camelToAllCapital = (str: string) => {
  //   return str.toUpperCase(); // Convert entire string to uppercase
  // };

  if (data) {
    const formattedData = data.map((item: any) => {
      const transformedItem: any = {};
      for (const key in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, key) &&
          !excludedKeys.includes(key.toLowerCase()) // Check if the lowercase key is not in the excluded keys list
        ) {
          const formattedValue = formatDate(item[key]);
          transformedItem[camelToAllCapital(key)] = formattedValue;
        }
      }
      return transformedItem;
    });

    // Convert formatted data to Excel sheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  } else {
    alert("There is no data to download");
  }
};

const DownloadExcel = ({ data }: any) => {
  const handleDownload = () => {
    jsonToExcel(data, "Downloaded data.xlsx");
  };

  return <Button onClick={handleDownload}>Download Excel</Button>;
};

export default DownloadExcel;
