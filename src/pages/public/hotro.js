import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';

function HoTro(){

    useEffect(()=>{
         document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                document.querySelectorAll('.faq-answer').forEach(item => item.style.display = 'none');
                answer.style.display = isOpen ? 'none' : 'block';
            });
        });
    }, []);

    return(
        <main className="faq-section">
      <div className="container">
        <h1>HỖ TRỢ</h1>

        <div className="faq-header">
          <h2>Câu hỏi thường gặp</h2>
          <p>Các câu hỏi thường gặp về dịch vụ của HITC Travel</p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <button className="faq-question">
              Làm cách nào để nhận SIM HITC Travel sau khi đặt hàng?
            </button>
            <div className="faq-answer">
              <p>
                Chúng tôi giao bao bì SIM trực tiếp đến địa điểm bạn yêu cầu tại Việt Nam
                (ví dụ: sân bay, khách sạn). Bạn chỉ cần cung cấp địa chỉ nhận hàng chi tiết khi đặt SIM.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              Quá trình kích hoạt SIM HITC Travel có phức tạp không?
            </button>
            <div className="faq-answer">
              <p>
                Hoàn toàn không. SIM của HITC Travel được thiết kế để "lắp là dùng ngay".
                Bạn chỉ cần tháo SIM cũ, lắp SIM HITC Travel vào khay điện thoại của mình
                và có thể sử dụng Internet ngay lập tức. Không cần đăng ký phức tạp hay thực hiện các thao tác kích hoạt rườm rà.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              Tôi nên chọn gói SIM nào cho chuyến đi của mình?
            </button>
            <div className="faq-answer">
              <p>
                Chúng tôi có ba gói chính:<br />
                - DISCOVER (HITC1): Lý tưởng cho chuyến đi ngắn (8 ngày, 7GB data).<br />
                - EXPLORER (HITC2): Phù hợp cho chuyến đi trung bình (16 ngày, 10GB data).<br />
                - ADVENTURER (HITC3): Tối ưu cho chuyến đi dài ngày hoặc xuyên Việt (30 ngày, 15GB data).<br />
                Bạn có thể chọn gói phù hợp nhất với thời gian lưu trú và nhu cầu sử dụng data của mình.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              Nếu gặp vấn đề khi sử dụng SIM, tôi phải liên hệ ai để được hỗ trợ?
            </button>
            <div className="faq-answer">
              <p>
                Đội ngũ hỗ trợ khách hàng chuyên nghiệp của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.
                Bạn có thể liên hệ tổng đài của chúng tôi qua số điện thoại được cung cấp trong bao bì SIM.
                Chúng tôi hỗ trợ cả tiếng Anh và tiếng Việt.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              Các gói SIM của HITC Travel có bao gồm gọi thoại và SMS không?
            </button>
            <div className="faq-answer">
              <p>
                Các gói SIM của chúng tôi chủ yếu tập trung vào Data tốc độ cao để đảm bảo kết nối Internet liên tục.
                Bạn có thể sử dụng các ứng dụng gọi điện/nhắn tin qua Internet (như WhatsApp, Zalo, Viber) mà không lo hết data.
                Gói EXPLORER cũng cho phép bạn giữ liên lạc với một số điện thoại Việt Nam trong thời gian lưu trú.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    );
}
export default HoTro;