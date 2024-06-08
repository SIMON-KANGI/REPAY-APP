import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentRole, selectCurrentUser } from "./AuthSlice";
import { selectCurrentRole,selectCurrentToken,selectCurrentUser } from "../../features/auth/Authslice";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

function RequireAuth({ allowedRoles }) {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);
  const user = useSelector(selectCurrentUser);
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      showToast("Not Logged In", false);
    } else if (!allowedRoles.includes(role)) {
    showToast("Unauthorized", true);
    }
  }, [user, role, allowedRoles,role]);

  const showToast = (message, userExists) => {
    toast({
      title: userExists ? "Unauthorized" : "Not Logged In",
      description: userExists ? "You are not allowed to perform this action." : "Please login before proceeding.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
