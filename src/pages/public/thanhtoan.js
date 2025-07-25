import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod, postMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import { loadAddress, loadHuyen, loadXa } from '../../services/address';

function ThanhToan(){
    const [voucherCode, setVoucherCode] = useState(null);
    const [voucherId, setvoucherId] = useState(null);
    const [discountVou, setdiscountVou] = useState(0);
    const [totaldon, settotaldon] = useState(0);
    useEffect(()=>{
        loadAddress();
        getUserThanhToan();
        loadAllItemCheckout();
        async function getUserThanhToan() {
            const res = await postMethod('/api/user/user/user-logged');
            var result = await res.json()
            document.getElementById("fullName").value = result.fullName
            document.getElementById("phone").value = result.phone
            document.getElementById("email").value = result.email
        }
    }, []);

    async function loadVoucher() {
        var code = document.getElementById("codevoucher").value
        var url = 'http://localhost:8080/api/voucher/public/findByCode?code=' + code + '&amount=' + totaldon;
        const response = await fetch(url, {});
        var result = await response.json();
        if (response.status == 417) {
            var mess = result.defaultMessage
            document.getElementById("messerr").innerHTML = mess;
            document.getElementById("blockmessErr").style.display = 'block';
            document.getElementById("blockmess").style.display = 'none';
            setVoucherCode(null)
            setvoucherId(null)
            setdiscountVou(0)
            document.getElementById("moneyDiscount").innerHTML = formatMoney(0);
            document.getElementById("thanhtiencuoi").innerHTML = formatMoney(totaldon);
        }
        if (response.status < 300) {
            setVoucherCode(result.code)
            setvoucherId(result.id)
            setdiscountVou(result.discount)
            document.getElementById("blockmessErr").style.display = 'none';
            document.getElementById("blockmess").style.display = 'block';
            document.getElementById("moneyDiscount").innerHTML = formatMoney(result.discount);
            document.getElementById("thanhtiencuoi").innerHTML = formatMoney(totaldon - result.discount);
        }
    }

    
    async function loadAllItemCheckout() {
        const response = await getMethod('/api/cart/user/my-cart');
        var list = await response.json();
        var main = ''
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].size.product.category.simType=="SIM_MANG"){
                main += `<div class="mb-2 d-flex justify-content-between">
                            <span><strong>Gói ${list[i].size.product.name}</strong> ● ${list[i].size.name}</span>
                            <span>${formatMoney(list[i].size.price)}</span>
                        </div>`
                total += list[i].quantity * list[i].size.price
            }
            else{
                main += `<div class="mb-2 d-flex justify-content-between">
                            <span><strong>Sim: ${list[i].size.product.name}</strong> ● ${list[i].size.product.networkType}</span>
                            <span>${formatMoney(list[i].size. product.price)}</span>
                        </div>`
                total += list[i].size.product.price
            }
        }
        document.getElementById("listitem").innerHTML = main
        document.getElementById("tonggiatientam").innerHTML = formatMoney(total)
        document.getElementById("thanhtiencuoi").innerHTML = formatMoney(total)
        settotaldon(total)
    }

    
    function checkout() {
        var con = window.confirm("Xác nhận đặt hàng!");
        if (con == false) {
            return;
        }
       const paytype = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if (paytype == "momo") {
            requestPayMentMomo()
        }
        if (paytype == "cod") {
            // paymentCod();
        }
        if (paytype == "vnpay") {
            requestPayMentVnpay();
        }
    }

    async function requestPayMentVnpay() {
        const tinh = document.getElementById("tinh");
        const selectTinh = tinh.options[tinh.selectedIndex];
        const nametinh = selectTinh.getAttribute("name-add");

        const huyen = document.getElementById("huyen");
        const selectedHuyen = huyen.options[huyen.selectedIndex];
        const namehuyen = selectedHuyen.getAttribute("name-add");

        const xa = document.getElementById("xa");
        const selectedXa = xa.options[xa.selectedIndex];
        const nameXa = selectedXa.getAttribute("name-add");

        var invoiceDto = {
            "payType":"PAYMENT_VNPAY",
            "note":document.getElementById("note").value,
            "address":document.getElementById("addchitiet").value+", "+ nameXa+", "+namehuyen+", "+nametinh,
            "fullName":document.getElementById("fullName").value,
            "phone":document.getElementById("phone").value,
            "voucherCode":voucherCode,
        }
        localStorage.setItem("invoiceDto", JSON.stringify(invoiceDto))
        var returnurl = 'http://localhost:3000/payment';
        var urlinit = 'http://localhost:8080/api/urlpayment/vnpay';
        var paymentDto = {
            "content": "thanh toán đơn hàng",
            "returnUrl": returnurl,
            "codeVoucher": voucherCode,
        }
        console.log(paymentDto)
        const res = await postMethodPayload(urlinit, paymentDto);
        const exceptionCode = 417; 
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == exceptionCode) {
            toast.warning(result.defaultMessage);
        }

    }

    async function requestPayMentMomo() {
    const tinh = document.getElementById("tinh");
    const selectTinh = tinh.options[tinh.selectedIndex];
    const nametinh = selectTinh.getAttribute("name-add");

    const huyen = document.getElementById("huyen");
    const selectedHuyen = huyen.options[huyen.selectedIndex];
    const namehuyen = selectedHuyen.getAttribute("name-add");

    const xa = document.getElementById("xa");
    const selectedXa = xa.options[xa.selectedIndex];
    const nameXa = selectedXa.getAttribute("name-add");

    var invoiceDto = {
        "payType":"PAYMENT_MOMO",
        "note":document.getElementById("note").value,
        "address":document.getElementById("addchitiet").value+", "+ nameXa+", "+namehuyen+", "+nametinh,
        "fullName":document.getElementById("fullName").value,
        "phone":document.getElementById("phone").value,
        "voucherCode":voucherCode,
    }
    localStorage.setItem("invoiceDto", JSON.stringify(invoiceDto))
    var returnurl = 'http://localhost:3000/payment';
    var urlinit = 'http://localhost:8080/api/urlpayment/momo';
    var paymentDto = {
        "content": "thanh toán đơn hàng",
        "returnUrl": returnurl,
        "codeVoucher": voucherCode,
    }
    console.log(paymentDto)
    const res = await postMethodPayload(urlinit, paymentDto);
    const exceptionCode = 417;
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == exceptionCode) {
        toast.warning(result.defaultMessage);
    }

    }

    return(
        <section>
            <div className="container my-4">
                <div className="row">
                {/* THÔNG TIN NGƯỜI MUA */}
                <div className="col-lg-7">
                    <div className="p-4 border rounded bg-white mb-4">
                    <h5><strong>THÔNG TIN NGƯỜI MUA</strong></h5>
                    <form>
                        <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Họ và tên *</label>
                        <input type="text" className="form-control" id="fullName" placeholder="Nhập họ và tên" />
                        </div>
                        <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                        <input type="tel" className="form-control" id="phone" placeholder="Nhập số điện thoại" />
                        </div>
                        <div className="mb-3">
                        <label htmlFor="email" className="form-label">Địa chỉ email *</label>
                        <input type="email" className="form-control" id="email" disabled />
                        </div>
                        <div className="mb-3">
                        <label className="form-label">Địa chỉ nhận hàng *</label>
                        <div className="row">
                            <div className="col-sm-4">
                            <label>Chọn tỉnh</label>
                            <select className="form-control" id="tinh" onChange={(e) => loadHuyen(e.target.value)}></select>
                            </div>
                            <div className="col-sm-4">
                            <label>Chọn huyện</label>
                            <select className="form-control" id="huyen" onChange={(e) => loadXa(e.target.value)}></select>
                            </div>
                            <div className="col-sm-4">
                            <label>Chọn xã</label>
                            <select className="form-control" id="xa"></select>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <label>Tên đường, số nhà</label>
                            <input className="form-control" id="addchitiet" placeholder="tên đường, số nhà của bạn" />
                        </div>
                        </div>
                        <div className="mb-3">
                        <label htmlFor="note" className="form-label">Ghi chú đơn hàng *</label>
                        <textarea className="form-control" id="note"></textarea>
                        </div>
                    </form>

                    {/* HÌNH THỨC THANH TOÁN */}
                    <h5><strong>HÌNH THỨC THANH TOÁN</strong></h5>
                    <div class="btn-group" role="group" aria-label="Chọn hình thức thanh toán">
                        <input type="radio" class="btn-check" name="paymentMethod" value="momo" id="payMomo" autocomplete="off"/>
                        <label class="btn btn-outline-danger" for="payMomo">Thanh toán qua momo</label>

                        <input type="radio" class="btn-check" name="paymentMethod" value="vnpay" id="payVNPay" autocomplete="off" checked/>
                        <label class="btn btn-outline-danger" for="payVNPay">Thanh toán qua vnpay</label>
                    </div>
                    </div>
                </div>

                {/* THÔNG TIN THANH TOÁN */}
                <div className="col-lg-5">
                    <div className="p-4 border rounded bg-white">
                    <h5><strong>THÔNG TIN THANH TOÁN</strong></h5>
                    <div id="listitem"></div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold text-primary mb-3">
                        <span>TẠM TÍNH</span>
                        <span id="tonggiatientam">0đ</span>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Mã khuyến mãi</label>
                        <div className="input-group">
                        <input id="codevoucher" type="text" className="form-control" />
                        <button className="btn btn-danger" onClick={() => loadVoucher()}>Áp dụng</button>
                        </div>
                        <div className="col-12" id="blockmess">
                        <span className="successvou">Mã giảm giá đã được áp dụng</span>
                        </div>
                        <div className="col-12" id="blockmessErr">
                        <br /><i className="fa fa-warning"> <span id="messerr">Mã giảm giá không khả dụng</span></i>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                        <span>Tổng giảm giá</span>
                        <span id="moneyDiscount">0đ</span>
                    </div>

                    <div className="d-flex justify-content-between fw-bold mb-3 fs-5">
                        <span>THÀNH TIỀN</span>
                        <span id="thanhtiencuoi">515.600đ</span>
                    </div>

                    <button className="btn btn-danger w-100 mb-3" onClick={() => checkout()}>TIẾP TỤC</button>

                    <div className="form-check mb-1">
                        <input className="form-check-input" type="checkbox" id="agree1" defaultChecked />
                        <label className="form-check-label text-muted" htmlFor="agree1">
                        Bằng việc nhấn Tiếp tục, tôi đồng ý với <a href="#" className="text-danger">Điều khoản và bảo mật</a> của Local.
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="agree2" defaultChecked />
                        <label className="form-check-label text-muted" htmlFor="agree2">
                        Tôi đồng ý với <a href="#" className="text-danger">Văn bản cam kết sử dụng Số đẹp</a> của Local.
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>

    );
}
export default ThanhToan;