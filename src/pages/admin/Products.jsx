import { useEffect, useState } from "react";
import ProductFormModal from "../../components/common/ProductFormModal";

import {
  getProducts,
  getProductsByStatus,
  createProduct,
  updateProduct,
  deactivateProduct,
  activateProduct,
} from "../../api/productApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import ProductDetailsModal from "../../components/common/ProductDetailsModal";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Button from "../../components/common/Button";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [status]);

  async function loadProducts() {
    setLoading(true);

    try {
      let res;

      if (status === "ALL") {
        res = await getProducts();
      } else {
        res = await getProductsByStatus(status);
      }

      setProducts(res.data.records || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleProductStatus(product, activate) {
    const action = activate ? "activate" : "deactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${product.productName}"?`,
      )
    ) {
      return;
    }

    try {
      if (activate) {
        await activateProduct(product.productId);
      } else {
        await deactivateProduct(product.productId);
      }

      loadProducts();
    } catch (err) {
      console.log(err);

      alert(`Failed to ${action} product.`);
    }
  }

  async function handleSubmit(form) {
    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct.productId,

          form,
        );
      } else {
        await createProduct(form);
      }

      setShowForm(false);

      setEditingProduct(null);

      loadProducts();
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Products">
        <BackButton />

        <DataTable
          columns={[
            {
              key: "productId",
              label: "ID",
            },

            {
              key: "productName",
              label: "Product",
            },

            {
              key: "description",
              label: "Description",
            },

            {
              key: "activeStatus",
              label: "Status",

              render: (product) => (
                <StatusBadge
                  status={product.activeStatus ? "ACTIVE" : "INACTIVE"}
                />
              ),
            },

            {
              key: "actions",
              label: "Actions",

              render: (product) => (
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);

                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>

                  {product.activeStatus ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleProductStatus(product, false)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleProductStatus(product, true)}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={products}
          searchKeys={["productId", "productName", "description"]}
          searchPlaceholder="Search products..."
          headerActions={
            <div className="d-flex gap-2">
              <StatusFilter
                value={status}
                onChange={setStatus}
                options={[
                  {
                    value: "ALL",
                    label: "All Status",
                  },
                  {
                    value: true,
                    label: "Active",
                  },
                  {
                    value: false,
                    label: "Inactive",
                  },
                ]}
              />

              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
              >
                + Add Product
              </Button>
            </div>
          }
        />

        {!products.length && <EmptyState message="No Products Found" />}
      </Card>

      <ProductDetailsModal
        show={showModal}
        product={selectedProduct}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />
      <ProductFormModal
        show={showForm}
        onClose={() => {
          setShowForm(false);

          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}

export default Products;
