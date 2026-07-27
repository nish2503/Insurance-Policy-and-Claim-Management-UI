import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

import { getMyClaims } from "../../api/customerApi";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal display states
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Inline withdrawal tracking state variable
  const [confirmId, setConfirmId] = useState(null);

  const [status, setStatus] = useState("ALL");

  const toast = useToast();

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const res = await getMyClaims();
      setClaims(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      console.log("Error loading claims:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelClaim(claimId) {
    try {
      await api.put(`/claims/${claimId}/cancel`);
      toast.success("Claim withdrawn successfully.");
      loadClaims();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not withdraw claim. Please try again."
      );
    }
  }

  async function openViewClaimModal(claim) {
    try {
      const res = await api.get(`/claims/${claim.claimId}`);
      setSelectedClaim(res.data);
    } catch (error) {
      console.log("Could not load claim document details:", error);
      setSelectedClaim(claim);
    }
    setShowModal(true);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const visibleClaims =
    status === "ALL"
      ? claims
      : claims.filter((c) => c.claimStatus === status);

  return (
    <DashboardLayout>
      <Card title="My Claims">
        <BackButton />

        {claims.length ? (
          <DataTable
            emptyMessage="No Claims Match This Filter"
            columns={[
              { key: "claimNumber", label: "Claim Number" },
              { key: "policyNumber", label: "Policy Number" },
              { key: "claimAmount", label: "Amount" },
              { key: "claimReason", label: "Reason" },
              { key: "incidentDateFormatted", label: "Date of Incident" },
              { key: "createdDateFormatted", label: "Date Raised" },
              { key: "claimStatusCustom", label: "Status" },
              {
                key: "action",
                label: "Actions",
                render: (row) => {
                  const isCancellable =
                    row.claimStatus === "SUBMITTED" || row.claimStatus === "UNDER_REVIEW";
                  const isConfirming = confirmId === row.claimId;

                  if (!isCancellable) {
                    return (
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openViewClaimModal(row)}
                        >
                          View
                        </Button>
                        <span
                          className="text-muted small align-self-center px-2"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Processed
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="d-flex flex-column gap-1">
                      {!isConfirming ? (
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => openViewClaimModal(row)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setConfirmId(row.claimId)}
                          >
                            Withdraw
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="p-2 rounded bg-light border border-warning d-flex flex-column gap-1"
                          style={{ maxWidth: "160px" }}
                        >
                          <small className="text-dark fw-bold text-center" style={{ fontSize: "0.75rem" }}>
                            Withdraw claim?
                          </small>
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => {
                                handleCancelClaim(row.claimId);
                                setConfirmId(null);
                              }}
                            >
                              Yes
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => setConfirmId(null)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={visibleClaims.map((c) => ({
              ...c,
              claimAmount: `₹${c.claimAmount}`,
              incidentDateFormatted: c.incidentDate
                ? new Date(c.incidentDate).toLocaleDateString()
                : "N/A",
              createdDateFormatted: c.createdDate
                ? new Date(c.createdDate).toLocaleDateString()
                : "N/A",
              claimStatusCustom: <StatusBadge status={c.claimStatus} />,
            }))}
            searchKeys={["claimNumber", "policyNumber", "claimReason", "claimStatus"]}
            headerActions={
              <div className="d-flex gap-2">
                <StatusFilter
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "SUBMITTED", label: "Submitted" },
                    { value: "UNDER_REVIEW", label: "Under Review" },
                    { value: "RECOMMENDED_APPROVAL", label: "Recommended Approval" },
                    { value: "RECOMMENDED_REJECTION", label: "Recommended Rejection" },
                    { value: "APPROVED", label: "Approved" },
                    { value: "REJECTED", label: "Rejected" },
                  ]}
                />

                <ExportPdfButton
                  title="My Claims"
                  rows={visibleClaims}
                  meta={{ "Status filter": status === "ALL" ? "All" : status }}
                  columns={[
                    { label: "Claim Number", key: "claimNumber" },
                    { label: "Policy Number", key: "policyNumber" },
                    { label: "Amount", value: (row) => `₹${row.claimAmount}` },
                    { label: "Reason", key: "claimReason" },
                    {
                      label: "Date of Incident",
                      value: (row) =>
                        row.incidentDate
                          ? new Date(row.incidentDate).toLocaleDateString()
                          : "N/A",
                    },
                    {
                      label: "Date Raised",
                      value: (row) =>
                        row.createdDate
                          ? new Date(row.createdDate).toLocaleDateString()
                          : "N/A",
                    },
                    { label: "Status", key: "claimStatus" },
                  ]}
                />
              </div>
            }
          />
        ) : (
          // 🛠️ REPLACE YOUR OLD EMPTYSTATE PROPERTY REGION WITH THIS PRECISE LAYOUT:
<EmptyState 
  message={
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-3">
      {/* 📋 Clean Clipboard Icon Wrapper - Spaced perfectly without floating artifact folders */}
      <div className="mb-3 text-muted display-6" style={{ fontSize: "2.4rem" }}>
        📋
      </div>
      <h5 className="font-weight-bold text-dark mb-2" style={{ letterSpacing: "-0.01em" }}>
        No Claims Found
      </h5>
      <p className="text-muted small mb-4" style={{ maxWidth: "340px", lineHeight: "1.5", fontSize: "0.875rem" }}>
        You haven't filed any insurance settlement requests yet. If you recently experienced an incident, you can start your request right now.
      </p>
      <Link 
        to="/customer/raise-claim" 
        className="btn btn-primary font-weight-bold shadow-sm px-4 py-2 d-inline-flex align-items-center gap-2"
        style={{ letterSpacing: "0.01em", borderRadius: "8px" }}
      >
        <span>➕</span> File a New Claim
      </Link>
    </div>
  } 
/>

        )}
      </Card>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedClaim(null);
        }}
        title={selectedClaim ? `Claim ${selectedClaim.claimNumber}` : "Claim Details"}
      >
        {selectedClaim && (
          <>
            <div className="mb-4 p-3 bg-light rounded border">
              <h6 className="border-bottom pb-1 fw-bold text-secondary">Basic Specifications</h6>
              <p className="mb-1"><strong>Claim Code:</strong> {selectedClaim.claimNumber}</p>
              <p className="mb-1"><strong>Policy Number:</strong> {selectedClaim.policyNumber}</p>
              <p className="mb-1"><strong>Claim Amount:</strong> ₹{String(selectedClaim.claimAmount).replace("₹", "")}</p>
              <p className="mb-1">
                <strong>Date of Incident:</strong>{" "}
                {selectedClaim.incidentDate
                  ? new Date(selectedClaim.incidentDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mb-1">
                <strong>Date Raised:</strong>{" "}
                {selectedClaim.createdDate
                  ? new Date(selectedClaim.createdDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mb-0">
                <strong>Current Status:</strong>
                <span className="badge bg-dark text-capitalize ms-1">
                  {selectedClaim.claimStatus?.toLowerCase().replace("_", " ")}
                </span>
              </p>
            </div>

            <div className="mb-4 p-3 bg-light rounded border">
              <h6 className="border-bottom pb-1 fw-bold text-secondary">Incident Explanation</h6>
              <p className="mb-0 text-muted fst-italic">"{selectedClaim.claimReason}"</p>
            </div>

            <div className="mb-4 p-3 bg-light rounded border">
              <h6 className="border-bottom pb-1 fw-bold text-secondary">Uploaded Documents</h6>
              {selectedClaim.documents && selectedClaim.documents.length > 0 ? (
                <div className="list-group mt-2">
                  {selectedClaim.documents.map((doc, index) => (
                    <div
                      key={doc.documentId || index}
                      className="list-group-item d-flex justify-content-between align-items-center py-2 bg-white"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark text-primary"></i>
                        <span className="text-truncate" style={{ maxWidth: "250px" }}>
                          {doc.documentName || `Document_${index + 1}`}
                        </span>
                      </div>
                      <a
                        href={doc.documentReference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        📥 View File
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-0 text-muted small fst-italic">No documents uploaded for this claim.</p>
              )}
            </div>

            <div className="mb-3 p-3 bg-white rounded border">
              <h6 className="border-bottom pb-1 fw-bold text-secondary">Review Notes</h6>
              <div className="mb-3 mt-2 small">
                <p className="mb-1"><strong>Agent Evaluation Remarks:</strong></p>
                <p className="text-muted border-start ps-2 mb-3 bg-light p-2 rounded">
                  {selectedClaim.internalStaffRemarks || "No review remarks recorded yet."}
                </p>
                <p className="mb-1"><strong>Manager Final Decision Remarks:</strong></p>
                <p className="text-muted border-start ps-2 mb-0 bg-light p-2 rounded">
                  {selectedClaim.adminRemarks || "No final decision remarks recorded yet."}
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button onClick={() => { setShowModal(false); setSelectedClaim(null); }}>
                Close Panel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default MyClaims;