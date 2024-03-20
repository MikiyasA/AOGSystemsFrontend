import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { modals } from "@mantine/modals";
import MyLoadingOverlay from "@/components/MyLoadingOverlay";
import { Text, Box } from "@mantine/core";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const Auth = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    !allowedRoles.includes("Admin") && allowedRoles.push("Admin");

    useEffect(() => {
      status === "loading" && <MyLoadingOverlay />;
      const user = session?.user;
      const flattenedRoles = user?.role?.flat();

      if (status === "unauthenticated") {
        router.push("/login"); // Redirect to login page if no user session
      }
      if (
        allowedRoles.length > 0 &&
        user &&
        !flattenedRoles?.some((role) => allowedRoles.includes(role))
      ) {
        router.push("/401");
      }
    }, [status, router, session?.user]);

    return <WrappedComponent {...props} />;
  };

  return Auth;
};

export default withAuth;
