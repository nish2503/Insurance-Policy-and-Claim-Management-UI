function ProductList({ products }) {
  return (
    <div className="mt-5">
      <h3>Products</h3>

      <ol>
        {products.map((product) => (
          <li key={product.id}>{product.productName}</li>
        ))}
      </ol>
    </div>
  );
}

export default ProductList;
