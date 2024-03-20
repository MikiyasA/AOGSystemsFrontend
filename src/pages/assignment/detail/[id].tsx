import AssignmentDetail from "@/components/Assignment/AssignmentDetail";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";
import { useGetAssignmentByIdQuery } from "@/pages/api/apiSlice";
import { useRouter } from "next/router";

var detailData = [
  { key: "title", value: "Title" },
  { key: "startDate", value: "Start Date" },
  { key: "dueDate", value: "Due Date" },
  { key: "expectedFinishedDate", value: "Expected Finished Date" },
  { key: "assignedTo", value: "Assigned To" },
  { key: "reAssignedTo", value: "ReAssigned To" },
  { key: "reAssignedBy", value: "ReAssigned By" },
  { key: "reAssignedAt", value: "ReAssigned At" },
  { key: "finishedBy", value: "Finished By" },
  { key: "finishedDate", value: "Finished At" },
  { key: "reOpenedBy", value: "ReOpened By" },
  { key: "reOpenedAt", value: "ReOpened At" },
  { key: "status", value: "Status" },
  { key: "description", value: "Description" },
];

const DetailAssignment = () => {
  const route = useRouter();
  const { data: assignment, isLoading } = useGetAssignmentByIdQuery(
    route.query.id
  );
  return (
    <Layout
      title={`Assignment Detail of ${assignment ? assignment.title : ""}`}
      description="Assignment Detail"
    >
      {isLoading && <MyLoadingOverlay />}
      {assignment && (
        <AssignmentDetail data={assignment} detailData={detailData} />
      )}
    </Layout>
  );
};
export default withAuth(DetailAssignment, ["Coordinator", "TL", "Management"]);
