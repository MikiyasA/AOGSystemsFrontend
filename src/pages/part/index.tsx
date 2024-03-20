import Layout from "@/hocs/Layout";
import withAuth from "@/hocs/withAuth";

const Part = () => {
  return (
    <Layout title="Part" description="Part">
      Part
    </Layout>
  );
};

export default withAuth(Part, ["Coordinator", "TL", "Management"]);
