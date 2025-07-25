import logo from '../../../assets/logokochu-trang-05.png';
import gpsIcon from '../../../assets/gps.png';
import phoneIcon from '../../../assets/phone-call.png';
import emailIcon from '../../../assets/gmail.png';
import clockIcon from '../../../assets/3d-alarm.png';


function footer(){
  return(
    <footer class="site-footer" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-left">
            <img src={logo} alt="Local" id="footer-left-image" />
            <h3 className="company-name">HITC TRAVEL</h3>
            <h2 className="company-name">
              CÔNG TY CỔ PHẦN DU LỊCH & TIN HỌC CÔNG NGHỆ CAO HITC
            </h2>
          </div>
          <div className="footer-right">
            <h3>Liên hệ với chúng tôi</h3>
            <div className="contact-info">
              <p>
                <span className="icon">
                  <img src={gpsIcon} alt="Location" />
                </span>
                Số 6, ngõ 274/3, phố Ngọc Lâm, Phường Ngọc Lâm, Quận Long Biên, Thành phố Hà Nội
              </p>
              <p>
                <span className="icon">
                  <img src={phoneIcon} alt="Phone" />
                </span>
                0909 023 386
              </p>
              <p>
                <span className="icon">
                  <img src={emailIcon} alt="Email" />
                </span>
                cskh.hitc@gmail.com
              </p>
              <p>
                <span className="icon">
                  <img src={clockIcon} alt="Working hours" />
                </span>
                Giờ làm việc: Thứ 2 - Thứ 7: 8:00 - 17:00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            © 2025 HITC Travel. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

export default footer;