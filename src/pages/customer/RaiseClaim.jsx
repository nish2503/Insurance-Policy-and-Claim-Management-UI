import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import BackButton from "../../components/common/BackButton";
import {
  getMyClaims,
  getMyPolicies,
  raiseClaim,
  uploadClaimDocument,
} from "../../api/customerApi";
import { useToast } from "../../context/ToastContext";
import { fetchAllPages } from "../../utils/fetchAllPages";

// Native date inputs have no built-in "no future dates" rule, so we cap the
// picker itself at today in addition to the submit-time check below — this
// stops a future incident date from being selectable in the first place.
// Local calendar date, not UTC (UTC is still "yesterday" in India before 05:30).
// Today's date in the browser's LOCAL calendar, as YYYY-MM-DD.
// (Defined here rather than imported so this page has no extra dependency.)
// new Date().toISOString() would give the UTC date, which in India is still
// yesterday between midnight and 05:30.
function todayLocalISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const TODAY_ISO = todayLocalISO();

// Claim statuses that still count as "in progress". The backend refuses a new
// claim while one of these is open on the same policy, so the form says so up
// front instead of failing on submit.
const OPEN_CLAIM_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "RECOMMENDED_APPROVAL",
  "RECOMMENDED_REJECTION",
];

const formatINR = (value) => Number(value || 0).toLocaleString("en-IN");

function RaiseClaim() {
  const navigate = useNavigate();
  const toast = useToast();
  const [policies, setPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimReason, setClaimReason] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [file, setFile] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  // Coverage figures for the selected policy: total, already approved and what
  // is actually still claimable (total - approved), which is the limit the
  // backend enforces in ClaimServiceImpl.raiseClaim.
  const [coverage, setCoverage] = useState(null);
  const [openClaimNumber, setOpenClaimNumber] = useState("");
  const [claimsByPolicy, setClaimsByPolicy] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      // All pages (the unpaged call returned only 10 policies), and only
      // policies a claim can actually be raised on: ACTIVE, coverage started,
      // not past the end date.
      const records = await fetchAllPages((page, size) =>
        getMyPolicies({ page, size }),
      );
      setPolicies(
        records.filter(
          (p) =>
            p.policyStatus === "ACTIVE" &&
            (!p.startDate || p.startDate <= TODAY_ISO) &&
            (!p.endDate || p.endDate >= TODAY_ISO),
        ),
      );
      // Claims are needed to work out how much coverage is left on each
      // policy: the backend subtracts APPROVED claims from the coverage
      // amount, and blocks a new claim while another one is still open.
      const claims = await fetchAllPages((page, size) =>
        getMyClaims({ page, size }),
      );

      const byPolicy = {};
      for (const claim of claims) {
        const key = claim.policyNumber;
        if (!key) continue;
        if (!byPolicy[key]) byPolicy[key] = { approved: 0, openClaim: null };
        if (claim.claimStatus === "APPROVED") {
          byPolicy[key].approved += Number(claim.claimAmount || 0);
        } else if (OPEN_CLAIM_STATUSES.includes(claim.claimStatus)) {
          byPolicy[key].openClaim = claim.claimNumber;
        }
      }
      setClaimsByPolicy(byPolicy);
    } catch (error) {
      console.error("Error loading customer active policy files:", error);
    }
  }

  function handlePolicyChange(e) {
    const selectedId = e.target.value;

    setPolicyId(selectedId);
    setClaimAmount("");

    if (fieldErrors.policyId) {
      setFieldErrors((prev) => ({
        ...prev,
        policyId: "",
      }));
    }

    if (!selectedId) {
      setCoverage(null);
      setOpenClaimNumber("");
      return;
    }

    const matchedPolicy = policies.find(
      (p) => String(p.policyId || p.id) === String(selectedId),
    );

    if (!matchedPolicy) {
      setCoverage(null);
      setOpenClaimNumber("");
      return;
    }

    const total = Number(matchedPolicy.coverageAmount || 0);
    const history = claimsByPolicy[matchedPolicy.policyNumber] || {
      approved: 0,
      openClaim: null,
    };

    setCoverage({
      total,
      approved: history.approved,
      remaining: Math.max(total - history.approved, 0),
    });
    setOpenClaimNumber(history.openClaim || "");
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // User opened the file picker and cancelled — leave any previously
      // chosen file/error state as-is rather than crashing on
      // selectedFile.type below.
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        file: "Only PDF, PNG and JPG files are allowed.",
      }));

      e.target.value = "";
      setFile(null);
      return;
    }

    if (fieldErrors.file) {
      setFieldErrors((prev) => ({
        ...prev,
        file: "",
      }));
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        file: "File size exceeds the 5MB limit. Please upload a smaller document.",
      }));

      e.target.value = "";

      setFile(null);

      return;
    }

    setFile(selectedFile);
  }

  function handleInputChange(setter, name) {
    return (e) => {
      setter(e.target.value);

      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };
  }

  // True as soon as the typed amount passes the claimable limit.
  const exceedsRemaining =
    Boolean(coverage) && claimAmount !== "" && Number(claimAmount) > coverage.remaining;

  function handleCancel() {
    navigate("/customer/claims");
  }

  function validateForm() {
    const errors = {};

    if (!policyId)
      errors.policyId ="Please select an active policy";
    else if (openClaimNumber)
      errors.policyId = `Claim ${openClaimNumber} is still being processed on this policy. You can raise a new claim once it is decided or withdrawn.`;
    else if (coverage && coverage.remaining <= 0)
      errors.policyId =
        "The full coverage on this policy has already been claimed.";

    if (!file) {
      errors.file = "Please upload a supporting document for your claim";
    }

    if (!claimAmount) errors.claimAmount = "Claim amount is required";
    else if (Number(claimAmount) <= 0)
      errors.claimAmount =
        "Claim amount must be a positive value greater than zero";
    else if (!Number.isInteger(Number(claimAmount)))
  errors.claimAmount = "Claim amount must be a whole number (no decimals)";
    else if (coverage && Number(claimAmount) > coverage.remaining)
      errors.claimAmount = `Claim amount cannot exceed the remaining coverage of ₹${formatINR(
        coverage.remaining,
      )} on this policy`;

    if (!claimReason.trim()) {
      errors.claimReason = "Please provide a reason for your claim";
    } else if (claimReason.trim().length < 10) {
      errors.claimReason = "Please provide a descriptive reason (minimum 10 characters)";
    }

    if (!incidentDate)
      errors.incidentDate = "Date of incident is required";
    else if (incidentDate > TODAY_ISO)
      errors.incidentDate = "Incident date cannot be set in the future";

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setFieldErrors({});

    const clientErrors = validateForm();

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);

    try {
      let uploadedDocument = [];

      if (file) {
        const uploadResponse = await uploadClaimDocument(file);

        uploadedDocument = [
          {
            documentName: file.name,

            documentType: file.type,

            documentReference:
              uploadResponse.data.fileUrl || uploadResponse.data,
          },
        ];
      }

      await raiseClaim({
        policyId: Number(policyId),

        claimAmount: Number(claimAmount),

        claimReason: claimReason,

        incidentDate: incidentDate,

        supportingDocuments: uploadedDocument,
      });

      toast.success("Claim request submitted successfully!");

      setPolicyId("");

      setClaimAmount("");

      setClaimReason("");

      setIncidentDate("");

      setFile(null);

      setMaxCoverage(null);

      document.getElementById("claimForm").reset();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit claim request. Please verify and retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Raise Claim">
        <form
          onSubmit={handleSubmit}
          id="claimForm"
          className="mt-4"
          noValidate
        >
          <div className="mb-3">
            <label className="form-label font-weight-bold">
              Select Policy <span className="text-danger">*</span>
            </label>

            <select
              className={`form-select ${
                fieldErrors.policyId ? "is-invalid" : ""
              }`}
              value={policyId}
              onChange={handlePolicyChange}
              disabled={submitting}
            >
              <option value="">Select a Policy</option>

              {policies.map((p) => (
                <option key={p.policyId || p.id} value={p.policyId || p.id}>
                  {p.policyNumber} -{p.planName || "Insurance Plan"}
                </option>
              ))}
            </select>
            {fieldErrors.policyId && (
              <div className="invalid-feedback d-block">
                {fieldErrors.policyId}
              </div>
            )}
          </div>

          {coverage && (
            <div
              className={`alert py-2 ${
                coverage.remaining > 0 ? "alert-info" : "alert-warning"
              }`}
            >
              <div>
                <strong>
                  Remaining coverage you can claim: ₹{formatINR(coverage.remaining)}
                </strong>
              </div>
              <div className="small">
                Total coverage ₹{formatINR(coverage.total)}
                {coverage.approved > 0 && (
                  <> · already approved ₹{formatINR(coverage.approved)}</>
                )}
              </div>
            </div>
          )}

          {openClaimNumber && (
            <div className="alert alert-warning py-2">
              Claim <strong>{openClaimNumber}</strong> is still being processed on
              this policy. Only one claim can be open at a time.
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              Claim Amount <span className="text-danger">*</span>
            </label>

            <input
              type="number"
              min="1"
              step="1"
              max={coverage ? coverage.remaining : undefined}
              className={`form-control ${
                fieldErrors.claimAmount || exceedsRemaining ? "is-invalid" : ""
              }`}
              value={claimAmount}
              onChange={handleInputChange(setClaimAmount, "claimAmount")}
              disabled={submitting || !policyId}
            />
            {/* Live check while typing, so the limit is clear before submit. */}
            {exceedsRemaining && !fieldErrors.claimAmount && (
              <div className="invalid-feedback d-block">
                Only ₹{formatINR(coverage.remaining)} of coverage is left on this
                policy.
              </div>
            )}
            {fieldErrors.claimAmount && (
              <div className="invalid-feedback d-block">
                {fieldErrors.claimAmount}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Reason for Claim <span className="text-danger">*</span></label>

            <textarea
              className={`form-control ${
                fieldErrors.claimReason ? "is-invalid" : ""
              }`}
              rows="4"
              value={claimReason}
              onChange={handleInputChange(setClaimReason, "claimReason")}
            />
            {fieldErrors.claimReason && (
              <div className="invalid-feedback d-block">
                {fieldErrors.claimReason}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Incident</label>

            <input
              type="date"
              max={TODAY_ISO}
              className={`form-control ${
                fieldErrors.incidentDate ? "is-invalid" : ""
              }`}
              value={incidentDate}
              onChange={handleInputChange(setIncidentDate, "incidentDate")}
            />
            {fieldErrors.incidentDate && (
              <div className="invalid-feedback d-block">
                {fieldErrors.incidentDate}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Upload Supporting Document</label>

            <input
              type="file"
              className={`form-control ${fieldErrors.file ? "is-invalid" : ""}`}
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleFileChange}
              disabled={submitting}
            />
            {fieldErrors.file ? (
              <div className="invalid-feedback d-block">{fieldErrors.file}</div>
            ) : (
              <small className="text-muted">
                Accepted formats: PDF, PNG, JPG (Maximum 5 MB)
              </small>
            )}
          </div>

          {/* CONTROL PANEL BUTTONS */}

          <div className="mt-4 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-danger px-4 shadow-sm"
              disabled={submitting || !policyId || exceedsRemaining || Boolean(openClaimNumber)}
            >
              {submitting
                ? "Uploading & Processing..."
                : "Submit"}
            </button>

            <button
              type="button"
              className="btn btn-secondary px-4 shadow-sm"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default RaiseClaim;