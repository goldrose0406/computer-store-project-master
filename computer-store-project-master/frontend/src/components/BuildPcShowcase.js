import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import '../styles/BuildPcShowcase.css';

const showcaseImages = [
  { id: 1, src: '/images/showcase/anh1.webp', alt: 'Ảnh build PC 1', className: 'build-pc-gallery-item item-1', placeholder: 'Ảnh 1' },
  { id: 2, src: '/images/showcase/anh2.webp', alt: 'Ảnh build PC 2', className: 'build-pc-gallery-item item-2', placeholder: 'Ảnh 2' },
  { id: 3, src: '/images/showcase/anh3.webp', alt: 'Ảnh build PC 3', className: 'build-pc-gallery-item item-3', placeholder: 'Ảnh 3' },
  { id: 4, src: '/images/showcase/anh4.webp', alt: 'Ảnh build PC 4', className: 'build-pc-gallery-item item-4', placeholder: 'Ảnh 4' },
  { id: 5, src: '/images/showcase/anh5.webp', alt: 'Ảnh build PC 5', className: 'build-pc-gallery-item item-5', placeholder: 'Ảnh 5' }
];

const benefits = [
  'Được nhận chương trình vệ sinh máy tính miễn phí TRỌN ĐỜI.',
  'Được các chuyên gia PC tư vấn trực tiếp với thời gian phản hồi nhanh chóng.',
  'Bảo hành 1-đổi-1 trong vòng 1 tháng đầu tiên nếu lỗi phát sinh từ sản phẩm.',
  'Giao hàng nhanh trong ngày, miễn phí giao hàng và lắp đặt trong nội thành.',
  'Hỗ trợ bảo trì, cài đặt phần mềm miễn phí.',
  'Giảm trực tiếp voucher 200 nghìn khi mua kèm màn hình máy tính.'
];

function BuildPcShowcase() {
  return (
    <section className="build-pc-showcase">
      <div className="build-pc-showcase__inner">
        <div className="build-pc-showcase__content">
          <h2 className="build-pc-showcase__title">BUILD PC GIÁ TỐT TẠI NHÓM 10 STORE</h2>
          <p className="build-pc-showcase__subtitle">
            Nếu công nghệ là sự đam mê của bạn - chúng ta cùng nhau chung hành trình
          </p>

          <div className="build-pc-showcase__description">
            <p>
              Có người từng hỏi: <em>"Tay làm kỹ thuật máy tính có chai sạn không?"</em> Mỗi ngành nghề
              đều để lại dấu ấn riêng trên đôi bàn tay của người làm nghề. Với kỹ thuật máy tính, dấu
              vết ấy không phô ra bên ngoài, nhưng hiện hữu trong sự tỉ mỉ và cẩn trọng ở từng thao tác.
            </p>
            <p>
              Đó là đôi tay quen với tua vít và linh kiện nhỏ, nhớ chính xác vị trí từng con ốc, và luôn
              kiểm tra thêm một lần nữa trước khi hoàn thiện. Mỗi bộ máy được lắp ráp bằng trách nhiệm,
              kỷ luật và niềm tin dành cho khách hàng.
            </p>
          </div>

          <ul className="build-pc-showcase__benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircleFilled />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="build-pc-gallery">
          {showcaseImages.map((image) => (
            <div key={image.id} className={image.className}>
              {image.src ? (
                <img src={image.src} alt={image.alt} />
              ) : (
                <div className="build-pc-gallery-placeholder">
                  <span>{image.placeholder}</span>
                  <small>Bạn tự thêm ảnh sau</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BuildPcShowcase;
