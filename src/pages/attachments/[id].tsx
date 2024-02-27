import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGetAttachmentByIdQuery } from "../api/apiSlice";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { API_URL } from "@/config";

const OpenFiles = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: attachment, error } = useGetAttachmentByIdQuery(id);

  const [fileUrl, setFileUrl] = useState<any>(null);
  console.log(fileUrl);
  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        // Fetch the file content using the API endpoint
        const response = await fetch(
          `${API_URL}/Attachment/DownloadAttachment/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    if (id) {
      fetchFileUrl();
    }
  }, [id]);

  return (
    <div>
      {fileUrl && (
        <Worker workerUrl={`${attachment?.filePath}`}>
          <Viewer fileUrl={fileUrl} />
        </Worker>
      )}
    </div>
  );
};

export default OpenFiles;
