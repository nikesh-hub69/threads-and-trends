export function getSessionId() {
  let sid = localStorage.getItem("tt_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("tt_session_id", sid);
  }
  return sid;
}