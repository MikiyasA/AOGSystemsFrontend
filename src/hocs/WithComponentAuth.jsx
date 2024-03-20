import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const WithComponentAuth = ({ children, allowedRoles = [] }) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const flattenedRoles = user?.role?.flat();

  !allowedRoles.includes("Admin") && allowedRoles.push("Admin");

  const [accessGranted, SetAccessGranted] = useState(false);
  useEffect(() => {
    if (Array.isArray(flattenedRoles)) {
      SetAccessGranted(flattenedRoles?.some((role) => allowedRoles.includes(role)));
    } else {
      SetAccessGranted(false); // If user role is not an array, access is not granted
    }
  }, [allowedRoles, flattenedRoles]);

  return accessGranted ? children : null;
};

WithComponentAuth.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default WithComponentAuth;
