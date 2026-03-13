function ProductCard({ name, price, image }) {
  return (
    <div className="product-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <img src={image} alt={name} style={{ width: '150px' }} />
      <h3>{name}</h3>
      <p>Giá: {price} VNĐ</p>
      <button>Thêm vào giỏ hàng</button>
    </div>
  );
}

export default ProductCard;