import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          background: '#fff',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100vw',
          '@media (max-width: 600px)': {
            width: '100%',
          },
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            <ShoppingCartOutlined style={{ marginRight: '8px' }} />
            Giỏ Hàng
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#999',
              }}
            >
              <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <p>Giỏ hàng của bạn trống</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    borderLeft: '3px solid #7c3aed',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{item.name}</h4>
                    <p style={{ margin: '0 0 12px 0', color: '#7c3aed', fontWeight: 'bold' }}>
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: '#ddd',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        style={{
                          width: '40px',
                          border: '1px solid #ddd',
                          textAlign: 'center',
                          borderRadius: '4px',
                          padding: '4px',
                        }}
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: '#7c3aed',
                          color: '#fff',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Tổng: {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: '#ff4d4f',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        <DeleteOutlined /> Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              borderTop: '1px solid #e0e0e0',
              padding: '20px',
              background: '#f9f9f9',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <span>Tổng cộng:</span>
              <span style={{ color: '#7c3aed' }}>{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={() => {
                navigate('/checkout');
                setIsCartOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              Thanh toán
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
