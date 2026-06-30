import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import BackButton from "../../components/common/BackButton";

import {
  getAgentClaims,
  reviewClaim,
  getClaimDetails,
  getClaimHistory,
  viewClaimDocument,
} from "../../api/agentApi";

function ReviewClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [decision, setDecision] = useState("");
  const [remarks, setRemarks] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const currentUserId = storedUser?.id || storedUser?.userId || null;

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const response = await getAgentClaims();

      setClaims(
        response.data.records || response.data.content || response.data || [],
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function openReview(claim) {
    setFieldErrors({});
    setGlobalError(""); // Wipes any past error states cleanly

    try {
      const details = await getClaimDetails(claim.claimId);
      const history = await getClaimHistory(claim.claimId);

      setSelectedClaim({
        ...claim,
        documents: details.data.documents || [],
        history: history.data.records || history.data.content || history.data || [],
        policyCoverageAmount: details.data.policyCoverageAmount,
        remainingCoverageAmount: details.data.remainingCoverageAmount,
        previousClaimCount: details.data.previousClaimCount,
        totalApprovedClaimAmount: details.data.totalApprovedClaimAmount,
        pastClaimsTimeline: details.data.pastClaimsTimeline || [],
      });

      setShowModal(true);
    } catch (error) {
      console.log("Open review collision error:", error);
      
      // 🔄 FIX: Instead of native alert(), map the error string to show on the UI screen instantly
      setGlobalError(
        error.response?.data?.message || "Access Denied: This claim is locked or currently being processed by another agent."
      );
      
      // Still open the modal framework so the error alert banner can render on screen
      setShowModal(true); 
      
      // Refresh background table tracking values to show latest changes
      loadClaims();
    }
  }


  async function openDocument(documentId) {
    try {
      const response = await viewClaimDocument(documentId);

      window.open(response.request.responseURL, "_blank");
    } catch (error) {
      alert("Unable to open document");
    }
  }

  function validateReviewForm() {
    const errors = {};

    if (!decision) {
      errors.decision = "Please select recommendation action";
    }

    if (!remarks.trim()) {
      errors.remarks = "Remarks are required";
    } else if (remarks.trim().length < 15) {
      errors.remarks = "Minimum 15 characters required";
    }

    return errors;
  }

  async function submitReview() {
    if (!selectedClaim) return;

    const errors = validateReviewForm();

    if (Object.keys(errors).length) {
      setFieldErrors(errors);

      return;
    }

    try {
      await reviewClaim(
        selectedClaim.claimId || selectedClaim.id,

        {
          recommendedStatus: decision,

          remarks: remarks.trim(),
        },
      );

      alert("Claim recommendation submitted successfully");

      setShowModal(false);

      setSelectedClaim(null);

      setDecision("");

      setRemarks("");

      loadClaims();
    } catch (error) {
      setGlobalError(
        error.response?.data?.message || "Failed to submit review",
      );
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const pendingClaims = claims.filter(
    (claim) =>
      claim.claimStatus === "SUBMITTED" || claim.claimStatus === "UNDER_REVIEW",
  );

  return (
    <DashboardLayout>
      <Card title="Review Claims Queue">
        <BackButton />

        {pendingClaims.length > 0 ? (
          <DataTable
            columns={[
              {
                key: "claimNumber",
                label: "Claim",
              },

              {
                key: "customerName",
                label: "Customer",
              },

              {
                key: "claimAmount",
                label: "Amount",
              },

              {
                key: "claimStatus",
                label: "Status",

                render: (row) => <StatusBadge status={row.claimStatus} />,
              },

              {
                key: "action",

                label: "Action",

                render: (row) => {
                  const isUnderReview = row.claimStatus === "UNDER_REVIEW";

                  return (
                    <Button onClick={() => openReview(row)}>
                      {isUnderReview ? "Resume Review" : "Start Review"}
                    </Button>
                  );
                },
              },
            ]}
            data={pendingClaims}
          />
        ) : (
          <EmptyState message="No Pending Claims" />
        )}
      </Card>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);

          setSelectedClaim(null);
        }}
        title="Claim Assessment Processing Panel"
      >
        {selectedClaim && (
          <>
            {globalError && (
              <div className="alert alert-danger">{globalError}</div>
            )}

            <div className="mb-3 p-3 bg-light rounded">
              <h6>Current Claim Specifications</h6>

              <p>
                Customer:
                {selectedClaim.customerName}
              </p>

              <p>
                Policy Number:
                {selectedClaim.policyNumber}
              </p>

              <p>Amount: ₹{selectedClaim.claimAmount}</p>
            </div>

            <h6>Historical Claims Timeline Tracker</h6>

            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>

                  <th>Claim ID</th>

                  <th>Amount</th>

                  <th>Reason</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {selectedClaim.pastClaimsTimeline?.length > 0 ? (
                  selectedClaim.pastClaimsTimeline.map((past, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(past.incidentDate).toLocaleDateString()}
                      </td>

                      <td>{past.claimNumber}</td>

                      <td>₹{past.amount}</td>

                      <td>{past.reason}</td>

                      <td>
                        <span className="badge bg-warning">{past.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No history found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h6>Submitted Evidence Documents</h6>

            {selectedClaim.documents?.length > 0 ? (
              selectedClaim.documents.map((doc) => (
                <Button
                  key={doc.documentId}
                  onClick={() => openDocument(doc.documentId)}
                >
                  Doc 📄 {doc.documentName}
                </Button>
              ))
            ) : (
              <p>No documents uploaded</p>
            )}

            <h5 className="mt-4">Attach Recommendation Assessment</h5>

            <select
              className={`form-select ${
                fieldErrors.decision ? "is-invalid" : ""
              }`}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="">-- Choose Decision --</option>

              <option value="RECOMMENDED_APPROVAL">Recommend Approval</option>

              <option value="RECOMMENDED_REJECTION">Recommend Rejection</option>
            </select>

            {fieldErrors.decision && (
              <div className="text-danger">{fieldErrors.decision}</div>
            )}

            <textarea
              className={`form-control mt-3 ${
                fieldErrors.remarks ? "is-invalid" : ""
              }`}
              rows="3"
              placeholder="Provide justification"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            {fieldErrors.remarks && (
              <div className="text-danger">{fieldErrors.remarks}</div>
            )}

            <Button onClick={submitReview}>Submit Recommendation</Button>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default ReviewClaims;
