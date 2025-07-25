import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import Select from 'react-select';


async function paymentOnline() {
    var invoiceDto = JSON.parse(localStorage.getItem("invoiceDto"));
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark

    invoiceDto.requestIdMomo = requestId;
    invoiceDto.orderIdMomo = orderId;
    invoiceDto.vnpOrderInfo = vnpOrderInfo;
    invoiceDto.urlVnpay = urlVnpay;

    var url = 'http://localhost:8080/api/invoice/user/create';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(invoiceDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == 417) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }

}


function PublicPayment(){
    useEffect(()=>{
        paymentOnline();
    }, []);

    return(
   <div className="content contentlogin">
      <div style={{ marginTop: '80px' }}>
          <div id="thanhcong" style={{ textAlign: 'center', marginTop: '15px', lineHeight: '25px' }}>
            <h3 style={{ fontSize: '25px', fontWeight: 'bold' }}>Đặt hàng thành công</h3>
            <p style={{ marginTop: '15px' }}>Cảm ơn bạn đã mua sản phẩm của chúng tôi.</p>
            <p style={{ marginTop: '15px' }}>
              Hãy kiểm tra thông tin đặt hàng của bạn trong lịch sử đặt hàng
            </p>
            <a href="account#invoice" className="btn btn-danger" style={{ marginTop: '15px' }}>
              Xem lịch sử đặt hàng
            </a>
          </div>
          <div id="thatbai" style={{ textAlign: 'center', marginTop: '15px' }}>
            <h3 style={{ fontSize: '25px', fontWeight: 'bold' }}>Thông báo</h3>
            <p style={{ marginTop: '15px' }} id="errormess">
              Bạn chưa hoàn thành thanh toán
            </p>
            <p style={{ marginTop: '15px' }}>
              Quay về <a href="index" style={{ color: 'red' }}>trang chủ</a>
            </p>
          </div>
      </div>
    </div>
    );
}

export default PublicPayment;
