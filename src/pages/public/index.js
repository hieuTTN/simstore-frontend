import {getMethod,getMethodPostByToken,getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'
import {loadBanner} from '../../services/banner'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


function Home(){


  return(
    <>
<section className="hero-banner">
      <div className="container">
        <div className="marquee">
          <div className="marquee-content">
            <span>ĐẦU SỐ 089</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>SIM SIÊU DATA</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>SIM SỐ ĐẸP</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>ĐẶC QUYỀN SIM LOCAL</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            {/* Repeated for scrolling effect */}
            <span>ĐẦU SỐ 089</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>SIM SIÊU DATA</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>SIM SỐ ĐẸP</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
            <span>ĐẶC QUYỀN SIM LOCAL</span>
            <img src="src/assets/Rectangle.png" alt="SIM" className="separator-img" />
          </div>
        </div>
      </div>


       <div className="banner-container">
      <div className="left-section">
        <a href="/simsieudata">
          <img
            src="src/assets/banner1.jpg"
            alt="Left Background"
            className="background-image"
          />
          <button className="button">Mua SIM Siêu Data →</button>
        </a>
      </div>
      <div className="right-section">
        <img
          src="src/assets/banner2.jpg"
          alt="Right Background"
          className="background-image"
        />
        <a href="/simsodep">
          <button className="button2">Mua SIM Số đẹp →</button>
        </a>
      </div>
    </div>
    </section>
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Nhà Mạng Siêu Cuốn</h2>

        <div className="features-grid">
          <div className="feature-card">
            <img
              src="src/assets/ic-super-data.7743c247.svg"
              alt="Data Icon"
              className="feature-icon"
            />
            <h3>Siêu Data Xả Thả Ga</h3>
            <p>
              Với chi phí cực kỳ hợp ví, chỉ bằng một cốc trà đá mỗi ngày, Local mang đến
              những gói cước 4G siêu data, tốc độ cao với đa dạng lựa chọn. Có Local thả hồ lướt mạng!
            </p>
          </div>

          <div className="feature-card">
            <img
              src="src/assets/ic-super-phone-signal.9b6b0406.svg"
              alt="Network Icon"
              className="feature-icon"
            />
            <h3>Siêu Sóng Phủ Mọi Nơi</h3>
            <p>
              Local sử dụng chung hạ tầng với MobiFone - 1 trong 3 nhà mạng lớn nhất Việt Nam,
              phủ sóng 63 tỉnh thành khắp cả nước. Có Local lướt mạng mượt mà, không lo về sóng!
            </p>
          </div>

          <div className="feature-card">
            <img
              src="src/assets/ic-super-deal.43a37044.svg"
              alt="Deal Icon"
              className="feature-icon"
            />
            <h3>Siêu Deal Free Thỏa Thích</h3>
            <p>
              Không chỉ có đàn deal đỉnh cho dân săn SIM Local tậu SIM siêu data giá hời,
              mà chúng tôi còn có kho bí kíp cho dân chơi Local kiếm data FREE mỗi ngày. Có Local ưu đãi trăm trở!
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}


export default Home;
