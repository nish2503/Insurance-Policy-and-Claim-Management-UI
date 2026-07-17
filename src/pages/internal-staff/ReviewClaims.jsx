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
import ClaimDetailPanel from "../../components/common/ClaimDetailPanel";
import ExportPdfButton from "../../components/common/ExportPdfButton";

import {
  getInternalStaffClaims,
  reviewClaim,
  getClaimDetails,
  viewClaimDocument,
} from "../../api/internalStaffApi";

import { validateRemarks, validateForm } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

// Statuses an internal-staff user may pick up for review. CLC-RUL-002: only
// an agent moves a claim to Under Review; CLC-RUL-003: only an agent
// recommends approval/rejection from there.
const REVIEWABLE_STATUSES = ["SUBMITTED", "UNDER_REVIEW"];

function ReviewClaims() {
  const toast = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [decision, setDecision] = useState("");
  const [remarks, setRemarks] = useState("");
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    setLoading(true);
    try {
      const response = await getInternalStaffClaims({ size: 100 });
      setClaims(
        response.data.records || response.data.content || response.data || [],
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load claims"));
    } finally {
      setLoading(false);
    }
  }

  async function openReview(claim) {
    setShowModal(true);
    setDetailLoading(true);
    setSelectedClaim(null);
    setDecision("");
    setRemarks("");
    setTouched({});
    setFieldErrors({});

    try {
      // getClaimDetails hits the same /claims/{id} endpoint as admin's
      // getClaimById — the response already embeds documents, status
      // history, and the past-claims timeline, so one call is enough.
      const response = await getClaimDetails(claim.claimId);
      setSelectedClaim(response.data);
    } catch (error) {
      // A claim can get locked/progressed by another internal-staff user
      // between the list load and this click — surface it as a toast
      // instead of opening a modal with nothing useful in it.
      toast.error(
        getApiErrorMessage(
          error,
          "This claim is locked or currently being processed by another internal staff member",
        ),
      );
      setShowModal(false);
      loadClaims();
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setSelectedClaim(null);
  }

  async function openDocument(documentId) {
    try {
      const response = await viewClaimDocument(documentId);
      window.open(response.request.responseURL, "_blank");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to open document"));
    }
  }

  const validatorMap = {
    decision: (value) => (value ? "" : "Please select a recommendation"),
    remarks: (value) => validateRemarks(value, "Remarks", 15),
  };

  function runFieldValidation(field, value) {
    const message = validatorMap[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runFieldValidation(field, value);
  }

  async function submitReview() {
    if (!selectedClaim) return;

    const { errors, isValid } = validateForm(
      { decision, remarks },
      validatorMap,
    );

    setFieldErrors(errors);
    setTouched({ decision: true, remarks: true });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await reviewClaim(selectedClaim.claimId, {
        recommendedStatus: decision,
        remarks: remarks.trim(),
      });

      toast.success(
        decision === "RECOMMENDED_APPROVAL"
          ? "Approval recommended successfully"
          : "Rejection recommended successfully",
      );

      closeModal();
      loadClaims();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to submit recommendation"));
    } finally {
      setSubmitting(false);
    }
  }

  const pendingClaims = claims.filter((claim) =>
    REVIEWABLE_STATUSES.includes(claim.claimStatus),
  );

  const isReviewable =
    selectedClaim && REVIEWABLE_STATUSES.includes(selectedClaim.claimStatus);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Review Claims Queue">
        <BackButton />

        {pendingClaims.length > 0 ? (
          <DataTable
            columns={[
              { key: "claimNumber", label: "Claim No." },
              { key: "customerName", label: "Customer" },
              { key: "policyNumber", label: "Policy No." },
              {
                key: "claimAmount",
                label: "Amount",
                render: (r) => `₹${r.claimAmount}`,
              },
              {
                key: "claimStatus",
                label: "Status",
                render: (row) => <StatusBadge status={row.claimStatus} />,
              },
              {
                key: "createdDate",
                label: "Submitted",
                render: (row) =>
                  row.createdDate
                    ? new Date(row.createdDate).toLocaleDateString()
                    : "—",
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <Button size="sm" onClick={() => openReview(row)}>
                    {row.claimStatus === "UNDER_REVIEW"
                      ? "Resume Review"
                      : "Start Review"}
                  </Button>
                ),
              },
            ]}
            data={pendingClaims}
            searchKeys={["claimNumber", "customerName", "policyNumber"]}
            searchPlaceholder="Search claims..."
            headerActions={
              <ExportPdfButton
                title="Review Claims Queue"
                rows={pendingClaims}
                columns={[
                  { label: "Claim No.", key: "claimNumber" },
                  { label: "Customer", key: "customerName" },
                  { label: "Policy No.", key: "policyNumber" },
                  { label: "Amount", value: (row) => `₹${row.claimAmount}` },
                  { label: "Status", key: "claimStatus" },
                  {
                    label: "Submitted",
                    value: (row) =>
                      row.createdDate
                        ? new Date(row.createdDate).toLocaleDateString()
                        : "-",
                  },
                ]}
              />
            }
          />
        ) : (
          <EmptyState message="No Pending Claims" />
        )}
      </Card>

      <Modal
        show={showModal}
        onClose={closeModal}
        title={
          selectedClaim
            ? `Claim ${selectedClaim.claimNumber}`
            : "Loading Claim..."
        }
      >
        {detailLoading && <Loader />}

        {!detailLoading && selectedClaim && (
          <>
            <ClaimDetailPanel
              claim={selectedClaim}
              onViewDocument={openDocument}
            />

            {isReviewable ? (
              <div className="claim-decision-form mt-3 pt-3 border-top">
                <h6 className="mb-3">Recommendation</h6>

                <label className="form-label">
                  Recommendation <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    touched.decision && fieldErrors.decision ? "is-invalid" : ""
                  }`}
                  value={decision}
                  onChange={(e) => {
                    setDecision(e.target.value);
                    if (touched.decision)
                      runFieldValidation("decision", e.target.value);
                  }}
                  onBlur={(e) => handleBlur("decision", e.target.value)}
                >
                  <option value="">-- Choose Recommendation --</option>
                  <option value="RECOMMENDED_APPROVAL">
                    Recommend Approval
                  </option>
                  <option value="RECOMMENDED_REJECTION">
                    Recommend Rejection
                  </option>
                </select>
                {touched.decision && fieldErrors.decision && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.decision}
                  </div>
                )}

                <label className="form-label mt-3">
                  Remarks <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    touched.remarks && fieldErrors.remarks ? "is-invalid" : ""
                  }`}
                  rows="3"
                  placeholder="Provide justification (min. 15 characters)"
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (touched.remarks)
                      runFieldValidation("remarks", e.target.value);
                  }}
                  onBlur={(e) => handleBlur("remarks", e.target.value)}
                />
                {touched.remarks && fieldErrors.remarks && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.remarks}
                  </div>
                )}

                <div className="mt-3 d-flex gap-2">
                  <Button
                    variant="success"
                    disabled={submitting}
                    onClick={submitReview}
                  >
                    {submitting ? "Submitting..." : "Submit Recommendation"}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={submitting}
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="alert alert-secondary mt-3">
                This claim has already moved past internal-staff review (
                {selectedClaim.claimStatus}) and cannot be recommended again.
              </div>
            )}
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default ReviewClaims;