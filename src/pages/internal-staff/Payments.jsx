import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import { getInternalStaffPayments } from "../../api/internalStaffApi";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const res = await getInternalStaffPayments();
      setPayments(res.data.records || res.data.content || res.data || []);
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

  const visiblePayments =
    status === "ALL"
      ? payments
      : payments.filter((p) => p.paymentStatus === status);

  return (
    <DashboardLayout>
      <Card title="Premium Payments">
        <BackButton />

        <DataTable
            emptyMessage="No Payments Found"
            columns={[
              {
                key: "paymentId",
                label: "ID",
              },
              {
                key: "policyNumber",
                label: "Policy Number",
              },
              {
                key: "customerNameCustom",
                label: "Customer Name",
              },
              {
                key: "transactionReference",
                label: "Transaction Ref",
              },
              {
                key: "amountCustom",
                label: "Amount",
              },
              {
                key: "paymentMode",
                label: "Mode",
              },
              {
                key: "paymentStatusCustom",
                label: "Status",
              },
            ]}
            data={visiblePayments.map((p) => ({
              ...p,
              customerNameCustom: p.customerName || "N/A",
              amountCustom: `₹${p.amount}`,
              paymentStatusCustom: <StatusBadge status={p.paymentStatus} />,
            }))}
            searchKeys={[
              "policyNumber",
              "customerNameCustom",
              "transactionReference",
              "paymentMode",
              "paymentStatus",
            ]}
            headerActions={
              <div className="d-flex gap-2">
                <StatusFilter
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "SUCCESS", label: "Success" },
                    { value: "FAILED", label: "Failed" },
                    { value: "PENDING", label: "Pending" },
                  ]}
                />

                <ExportPdfButton
                  title="Premium Payments"
                  rows={visiblePayments}
                  meta={{ "Status filter": status === "ALL" ? "All" : status }}
                  columns={[
                    { label: "ID", key: "paymentId" },
                    { label: "Policy Number", key: "policyNumber" },
                    { label: "Customer Name", value: (row) => row.customerName || "N/A" },
                    { label: "Transaction Ref", key: "transactionReference" },
                    { label: "Amount", value: (row) => `₹${row.amount}` },
                    { label: "Mode", key: "paymentMode" },
                    { label: "Status", key: "paymentStatus" },
                  ]}
                />
              </div>
            }
          />
      </Card>
    </DashboardLayout>
  );
}

export default Payments;