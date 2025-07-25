import { useState, useEffect } from 'react'
import {getMethod} from '../../../services/request'
import React, { createContext, useContext } from 'react';
import logo from '../../../assets/logochu-trang-08.png';
import cartIcon from '../../../assets/shopping-cart.svg';
import orderIcon from '../../../assets/receipt.svg';

export const HeaderContext = createContext();


var token = localStorage.getItem("token");

function Header (){
    const [numCart, setNumCart] = useState(0);
    useEffect(()=>{
        loadCartMenu();
    }, []);
    import ('../../../css/reset.css');
    import ('../../../css/main.css');

    async function loadCartMenu() {
      if(token == null){
          return;
      }
      const response = await getMethod('/api/cart/user/count-cart');
      if(response.status > 300){
          return;
      }
      var count = await response.text();
      setNumCart(count);
    }
    
    
    

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.localStorage.removeItem("product_cart")
        window.location.replace('login')
    }

    var token = localStorage.getItem('token');
    var authen =    <li className="nav-item">
              <a className="nav-link" href="login">Đăng nhập</a>
            </li>
    if(token != null){
        authen = <>
        <li class="dropdown nav-item">
            <a class="dropdown-toggle" href="#" id="navbarDropdown" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                Tài khoản
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="account">Tài khoản</a></li>
                <li><a class="dropdown-item" href="#" onClick={()=>logout()}>Đăng xuất</a></li>
            </ul>
        </li>
        </>
    }
    return(
      <div id="root">
<header class="site-header" id="menu">
        <div className="container">
      <div className="header-content">
        <div className="mobile-menu-toggle">
          <img src="" alt="Menu" id="mobile-menu-icon" />
        </div>

        <div className="logo">
          <a href="index">
            <img src={logo} alt="HITC Travel" id="logo-image" />
          </a>
        </div>

        <nav className="main-navigation">
          <ul className="nav-links">
            <li className="nav-item">
              <a className="nav-link" href="simsieudata">SIM Siêu Data</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="simsodep">SIM Số Đẹp</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="hotro">Hỗ trợ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="tintuc">Tin tức</a>
            </li>

            {authen}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="/giohang" className="cart-icon">
            <img src={cartIcon} alt="Giỏ hàng" id="cart-icon" />
            {token && <span id="soluongcartmenu">{numCart}</span>}
          </a>
          <a href="/donhang" className="order-tracking">
            <img src={orderIcon} alt="Đơn mua" id="order-icon" />
          </a>
        </div>
      </div>
      </div>
      </header>
      </div>
    );

    
}

export default Header;