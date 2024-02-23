import { Modal, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useGetAttachmentByIdQuery } from "../api/apiSlice";

const OpenFiles = () => {
  const route = useRouter();
  const { id } = route.query;

  const { data: attachment } = useGetAttachmentByIdQuery(id);

  console.log(parsedData);
  return (
    <>
      <div>OpenFiles</div>
    </>
  );
};
export default OpenFiles;
