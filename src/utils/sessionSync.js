// Multi-tab session sync.
//
// Auth state (token/role) lives in localStorage, which is shared across
// every tab on the same origin. Without this, the following bleeds
// silently: log in as Admin in tab 1, then log in as a different user (or
// role) in tab 2 — tab 2's login overwrites localStorage, and tab 1 keeps
// running with its old in-memory UI/redux state but starts sending its
// *next* API call with tab 2's token (api/axios.js reads the token fresh
// from localStorage on every request). Tab 1 never gets told anything
// changed; it just quietly starts acting as the wrong user.
//
// The `storage` event fires in *other* tabs (not the one that made the
// change) whenever localStorage is modified, so it's the right hook to
// detect this. When it fires for our auth keys, force a hard reload of
// this tab — that re-reads the now-current token/role from scratch (via
// authSlice's initialState) and lets the route guards decide, from a
// clean slate, whether this tab should now show a login screen or a
// different role's dashboard. This makes a cross-tab login/logout an
// explicit, visible resync instead of a silent, unnoticed bleed.
export function initSessionSync() {
  window.addEventListener("storage", (event) => {
    if (event.key !== "token" && event.key !== "role") return;
    if (event.newValue === event.oldValue) return;

    window.location.reload();
  });
}

export default initSessionSync;