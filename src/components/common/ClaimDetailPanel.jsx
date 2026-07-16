import StatusBadge from "./StatusBadge";
import Button from "./Button";

// Shared, read-only claim detail view: summary facts, claim reason, any
// internal-staff / admin remarks already on record, supporting documents,
// and the full status history timeline (HIS-BR-001 to 004). Used by Admin's
// Approve Claim screen; intended to be reused by the internal-staff Review
// Claims screen too so the two don't drift into duplicate markup.
function ClaimDetailPanel({ claim, onViewDocument }) {
  if (!claim) return null;

  const sortedHistory = claim.history?.length
    ? [...claim.history].sort(
        (a, b) => new Date(b.updatedDate) - new Date(a.updatedDate),
      )
    : [];

  return (
    <div className="claim-detail-panel">
      <style>{`
        .claim-detail-panel {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .claim-detail-summary {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          gap: 16px !important;
          padding: 16px !important;
          background: var(--bg-main) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 12px !important;
          margin-bottom: 20px !important;
        }
        .claim-detail-label {
          display: block !important;
          font-size: 0.72rem !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.04em !important;
          color: var(--text-muted) !important;
          margin-bottom: 4px !important;
        }
        .claim-detail-summary p {
          margin: 0 !important;
          font-weight: 600 !important;
          color: var(--text-main) !important;
        }
        .claim-detail-section {
          margin-bottom: 22px !important;
        }
        .claim-detail-section h6 {
          font-weight: 700 !important;
          color: var(--text-main) !important;
          margin-bottom: 10px !important;
        }
        .claim-detail-docs {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        .claim-history-timeline {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .claim-history-entry {
          padding: 12px 14px !important;
          border-left: 3px solid var(--primary, #3b82f6) !important;
          background: var(--bg-main) !important;
          border-radius: 0 10px 10px 0 !important;
        }
        .claim-history-transition {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin-bottom: 4px !important;
        }
        .claim-history-arrow {
          color: var(--text-muted) !important;
          font-weight: 700 !important;
        }
        .claim-history-meta {
          font-size: 0.78rem !important;
          color: var(--text-muted) !important;
          margin: 0 0 4px 0 !important;
        }
        .claim-history-remarks {
          font-size: 0.88rem !important;
          color: var(--text-main) !important;
          margin: 0 !important;
        }
      `}</style>

      <div className="claim-detail-summary">
        <div>
          <span className="claim-detail-label">Claim Number</span>
          <p>{claim.claimNumber}</p>
        </div>
        <div>
          <span className="claim-detail-label">Status</span>
          <p>
            <StatusBadge status={claim.claimStatus} />
          </p>
        </div>
        <div>
          <span className="claim-detail-label">Customer</span>
          <p>{claim.customerName}</p>
        </div>
        <div>
          <span className="claim-detail-label">Policy Number</span>
          <p>{claim.policyNumber}</p>
        </div>
        <div>
          <span className="claim-detail-label">Claim Amount</span>
          <p>₹{claim.claimAmount}</p>
        </div>
        <div>
          <span className="claim-detail-label">Policy Coverage</span>
          <p>
            {claim.policyCoverageAmount != null
              ? `₹${claim.policyCoverageAmount}`
              : "—"}
          </p>
        </div>
        <div>
          <span className="claim-detail-label">Remaining Coverage</span>
          <p>
            {claim.remainingCoverageAmount != null
              ? `₹${claim.remainingCoverageAmount}`
              : "—"}
          </p>
        </div>
        <div>
          <span className="claim-detail-label">Incident Date</span>
          <p>
            {claim.incidentDate
              ? new Date(claim.incidentDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      <div className="claim-detail-section">
        <h6>Claim Reason</h6>
        <p>{claim.claimReason || "—"}</p>
      </div>

      {(claim.internalStaffRemarks || claim.adminRemarks) && (
        <div className="claim-detail-section">
          {claim.internalStaffRemarks && (
            <>
              <h6>
                Internal Staff Remarks
                {claim.reviewedByName ? ` — ${claim.reviewedByName}` : ""}
              </h6>
              <p>{claim.internalStaffRemarks}</p>
            </>
          )}
          {claim.adminRemarks && (
            <>
              <h6>
                Admin Remarks
                {claim.decidedByName ? ` — ${claim.decidedByName}` : ""}
              </h6>
              <p>{claim.adminRemarks}</p>
            </>
          )}
        </div>
      )}

      <div className="claim-detail-section">
        <h6>Supporting Documents</h6>
        {claim.documents?.length ? (
          <div className="claim-detail-docs">
            {claim.documents.map((doc) => (
              <Button
                key={doc.documentId}
                variant="secondary"
                size="sm"
                onClick={() => onViewDocument(doc.documentId)}
              >
                📄 {doc.documentName}
                {doc.documentType ? ` (${doc.documentType})` : ""}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-muted">No documents submitted</p>
        )}
      </div>

      <div className="claim-detail-section">
        <h6>Status History</h6>
        {sortedHistory.length ? (
          <div className="claim-history-timeline">
            {sortedHistory.map((h) => (
              <div className="claim-history-entry" key={h.historyId}>
                <div className="claim-history-transition">
                  {h.previousStatus ? (
                    <StatusBadge status={h.previousStatus} />
                  ) : (
                    <span className="text-muted">New</span>
                  )}
                  <span className="claim-history-arrow">→</span>
                  <StatusBadge status={h.newStatus} />
                </div>
                <p className="claim-history-meta">
                  {h.updatedByFullName || "System"}
                  {h.updatedDate
                    ? ` · ${new Date(h.updatedDate).toLocaleString()}`
                    : ""}
                </p>
                {h.remarks && (
                  <p className="claim-history-remarks">{h.remarks}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No status history recorded yet</p>
        )}
      </div>

      {claim.pastClaimsTimeline?.length > 0 && (
        <div className="claim-detail-section">
          <h6>Customer's Past Claims On This Policy</h6>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Claim No.</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Incident Date</th>
              </tr>
            </thead>
            <tbody>
              {claim.pastClaimsTimeline.map((past) => (
                <tr key={past.claimNumber}>
                  <td>{past.claimNumber}</td>
                  <td>₹{past.amount}</td>
                  <td>{past.reason}</td>
                  <td>
                    <StatusBadge status={past.status} />
                  </td>
                  <td>
                    {past.incidentDate
                      ? new Date(past.incidentDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClaimDetailPanel;