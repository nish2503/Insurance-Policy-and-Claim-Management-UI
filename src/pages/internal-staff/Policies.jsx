import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";

import { getInternalStaffPolicies } from "../../api/internalStaffApi";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const records = await fetchAllPages((page, size) =>
        getInternalStaffPolicies({ page, size }),
      );
      setPolicies(records);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  // Client-side filtering — mirrors the pattern already used on the Claims
  // screen — since the internal-staff policies endpoint doesn't currently
  // take a status query param the way admin's /policies list does.
  const visiblePolicies =
    status === "ALL"
      ? policies
      : policies.filter((p) => p.policyStatus === status);

  return (
    <DashboardLayout>
      <Card title="Policies">
        <BackButton />

        <DataTable
          emptyMessage="No Policies Found"
          columns={[
            {
              key: "policyNumber",
              label: "Policy Number",
            },
            {
              key: "customerName",
              label: "Customer",
            },
            {
              key: "planName",
              label: "Plan",
            },
            {
              key: "policyStatus",
              label: "Status",
              render: (row) => <StatusBadge status={row.policyStatus} />,
            },
          ]}
          data={visiblePolicies}
          searchKeys={[
            "policyNumber",
            "customerName",
            "planName",
            "policyStatus",
          ]}
          headerActions={({ pageRows, filteredRows }) => {
            const columns = [
              { label: "Policy Number", key: "policyNumber" },
              { label: "Customer", key: "customerName" },
              { label: "Plan", key: "planName" },
              { label: "Status", key: "policyStatus" },
            ];
            const meta = { "Status filter": status === "ALL" ? "All" : status };

            return (
              <div className="d-flex gap-2">
                <StatusFilter
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "PENDING_PAYMENT", label: "Pending Payment" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "EXPIRED", label: "Expired" },
                    { value: "CANCELLED", label: "Cancelled" },
                  ]}
                />

                <ExportPdfButton title="Policies (This Page)" fileName="internal-policies-page" label="Export Page" rows={pageRows} meta={meta} columns={columns} />
                <ExportPdfButton title="Policies (All)" fileName="internal-policies-all" label="Export All" rows={filteredRows} meta={meta} columns={columns} />
              </div>
            );
          }}
        />
      </Card>
    </DashboardLayout>
  );
}

export default Policies;