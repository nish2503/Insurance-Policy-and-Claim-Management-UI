import { jwtDecode } from "jwt-decode";

// The signed JWT is the source of truth for who is logged in and which role
// they have. Previously route guards and the sidebar trusted the plain
// "role" value in localStorage, so editing it in devtools (role=ADMIN)
// rendered the admin UI for a customer. A token can't be edited without
// breaking its signature, which the backend rejects.

export function getSession() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = jwtDecode(token);
    if (!payload?.role) return null;

    // exp is in seconds
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

    return {
      token,
      role: payload.role,
      email: payload.sub,
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}

export function getSessionRole() {
  return getSession()?.role ?? null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
}

export function homePathForRole(role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "INTERNAL_STAFF":
      return "/internal-staff";
    case "CUSTOMER":
      return "/customer";
    default:
      return "/";
  }
}

// Opens a claim document in a new tab. The tab is opened synchronously on the
// click (before the network call) because browsers block window.open() calls
// made after an await as popups.
export async function openDocumentInNewTab(fetchDocumentLink, documentId, onError) {
  const tab = window.open("", "_blank");
  try {
    const response = await fetchDocumentLink(documentId);
    const url = response.data?.documentUrl;
    if (!url) throw new Error("Document link missing");
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.assign(url);
    }
  } catch (error) {
    if (tab) tab.close();
    onError?.(error);
  }
}