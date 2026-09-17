import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Loader from "../common/Loader";
import { profileExists } from "../../api/customerApi";
import { useToast } from "../../context/ToastContext";

/**
 * Guards customer pages that require a completed profile (browsing plans,
 * purchasing a policy, viewing/paying policies, filing claims, etc).
 *
 * Previously "must have a profile" was only enforced once, right after
 * login (Login.jsx redirected to /customer/create-profile if profileExists
 * came back false). That left a gap: a customer who is already logged in
 * (token persisted in storage) and types a purchase URL directly, or clicks
 * a "Browse Plans" link from the dashboard before ever creating a profile,
 * would land straight on the page with no redirect/prompt at all — only the
 * backend would eventually reject the underlying request.
 *
 * This component re-checks profile existence at the point of entry to any
 * profile-dependent route, so the "Create Profile" prompt is enforced no
 * matter how the customer arrives.
 */
function RequireProfile({ children }) {
  const toast = useToast();
  const [status, setStatus] = useState("checking"); // "checking" | "has-profile" | "no-profile"

  useEffect(() => {
    let cancelled = false;

    profileExists()
      .then((response) => {
        if (cancelled) return;
        setStatus(response.data ? "has-profile" : "no-profile");
      })
      .catch(() => {
        if (cancelled) return;
        // If we can't confirm a profile exists, fail safe by sending the
        // customer to create one rather than letting them through.
        setStatus("no-profile");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "no-profile") {
      toast.info("Please complete your profile before continuing.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "checking") {
    return <Loader />;
  }

  if (status === "no-profile") {
    return <Navigate to="/customer/create-profile" replace />;
  }

  return children;
}

export default RequireProfile;