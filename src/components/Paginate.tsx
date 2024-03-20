import { Pagination, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import DownloadExcel from "./DownloadExcel";

interface PaginateProps {
  metadata: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
  form: any;
}

function Paginate({ metadata, form, data }: any) {
  const [activePage, setActivePage] = useState(1);
  const handlePageChange = async (newNo: number) => {
    setActivePage(newNo);
    await form?.setFieldValue("page", newNo);
  };
  return (
    <Group>
      <Pagination
        total={metadata?.totalPages}
        color="green"
        value={activePage}
        onChange={handlePageChange}
        withEdges
      />
      <DownloadExcel data={data} />
    </Group>
  );
}

export default Paginate;
