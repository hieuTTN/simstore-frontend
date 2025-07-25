import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod, postMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import Select from 'react-select';

async function changePassword(event) {
    event.preventDefault();
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    if (newpass != renewpass) {
        alert("mật khẩu mới không trùng khớp");
        return;
    }
    var passw = {
        "oldPass":  document.getElementById("oldpass").value,
        "newPass": newpass
    }
    const response = await postMethodPayload('/api/user/user/change-password', passw)
    if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "cập nhật mật khẩu thành công, hãy đăng nhập lại!",
                preConfirm: () => {
                    window.location.reload();
                }
            });
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.defaultMessage);
    }
}

function Account(){
const [donHang, setDonHang] = useState([]);
const [ctDonHang, setCtDonHang] = useState([]);
const [itemDH, setItemDh] = useState(null);
const [trangThais, setTrangThais] = useState([]);


useEffect(()=>{
    loadMyInvoice();
}, []);
 import ('../../css/account.css');

async function loadMyInvoice() {
    const response = await getMethod('/api/invoice/user/find-by-user');
    var list = await response.json();
    setDonHang(list);
}

function trangThai(tt){
    if(tt == 'DANG_CHO_XAC_NHAN'){
        return "Đang chờ xác nhận"
    }
    if(tt == 'DA_XAC_NHAN'){
        return "Đã xác nhận"
    }
    if(tt == 'DA_GUI'){
        return "Đang giao hàng"
    }
    if(tt == 'DA_NHAN'){
        return "Đã nhận"
    }
    if(tt == 'DA_HUY'){
        return "Đã hủy"
    }
    if(tt == 'KHONG_NHAN_HANG'){
        return "Không nhận hàng"
    }
}

async function loadDetailInvoice(id, item) {
    const res = await getMethod('/api/invoice-detail/user/find-by-invoice?idInvoice='+id);
    var list = await res.json();
    console.log(list);
    
    setCtDonHang(list);
    setItemDh(item);
    setTrangThais(item.invoiceStatuses);
    openModal();
}

function toggleModal() {
    const modal = document.getElementById('modal');
    modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
}

function openModal(){
    const modal = document.getElementById('modal');
    modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
  }


return(
<>
    <div class="content contentcart container">
        <div class="row cartbds">
            <div class="col-lg-3 col-md-3 col-sm-12 col-12 collistcart">
                <div class="navleft">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6">
                            <div class="avaaccount">
                                <img src="image/avatar.webp" class="avataracc"/>
                                <button onclick="logout()" class="btnlogoutacc">Đăng xuất</button>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6 sinv">
                            <div onClick={(event)=>changeLink(event,'invoice')} class="tabdv activetabdv">
                                <a data-toggle="tab" href="#invoice" class="d-flex"><img class="imgau" src="image/invoice.svg"/> Đơn hàng của tôi</a>
                            </div>
                            <div onClick={(event)=>changeLink(event,'changepass')} class="tabdv">
                                <a data-toggle="tab" href="#changepass" class="d-flex"><img class="imgau" src="image/pass.svg"/> Đổi mật khẩu</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12 col-12 collistcart">
                <div class="navright">
                    <div class="tab-content contentab">
                        <div role="tabpanel" class="tab-pane active" id="invoice">
                            <div class="headeraccount">
                                <p class="fontyel">Đơn hàng của tôi</p>
                                <span>(Nhấp vào mã đơn hàng để xem chi tiêt)</span>
                                <div class="right_flex">
                                    <span class="textrf" id="sldonhang">0 đơn hàng</span>
                                </div>
                            </div>
                            <table class="table table-cart table-order" id="my-orders-table">
                                <thead class="thead-default">
                                    <tr>
                                        <th>Mã đơn hàng</th>
                                        <th class="floatr">Ngày mua</th>
                                        <th>Địa chỉ</th>
                                        <th class="floatr">Giá trị<br/>đơn hàng</th>
                                        <th>Trạng thái thanh toán</th>
                                        <th class="floatr">Trạng thái vận chuyển</th>
                                    </tr>
                                </thead>
                                <tbody id="listinvoice">
                                    {donHang.map((item, i) => (
                                        <tr key={i}>
                                            <td
                                            onClick={() => loadDetailInvoice(item.id, item)}
                                            >
                                            <a className="yls pointer-event">{item.id}</a>
                                            </td>

                                            <td className="floatr">
                                            {item.createdTime}<br />{item.createdDate}
                                            </td>

                                            <td>{item.address}</td>

                                            <td className="floatr">
                                            <span className="yls">{formatMoney(Number(item.totalAmount) + 0)}</span>
                                            </td>

                                            <td>
                                            <span className="span_pending">
                                                {item.payType !== 'PAYMENT_DELIVERY' ? (
                                                <span className="dathanhtoan">Đã thanh toán</span>
                                                ) : (
                                                <span className="chuathanhtoan">Thanh toán khi nhận hàng</span>
                                                )}
                                            </span>
                                            </td>

                                            <td className="floatr">
                                            <span className="span_">{trangThai(item.status)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="changepass">
                            <div class="headeraccount">
                                <span class="fontyel">Đổi mật khẩu</span><span class="smyl"> (Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác)</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 passacc">
                                <form  onSubmit={changePassword}>
                                    <label class="lbacc">Mật khẩu hiện tại *</label>
                                    <input id="oldpass" type="password" class="form-control"/>
                                    <label class="lbacc">Mật khẩu mới *</label>
                                    <input id="newpass" type="password" class="form-control"/>
                                    <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                    <input id="renewpass" type="password" class="form-control"/>
                                    <br/><button type="button" class="btnhuylogin" onclick="window.location.href='account'">HỦY</button>
                                    <button type="submit" class="btntt">LƯU</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


     
     <div id="modal" className="modal">
      <div className="modal-content" style={{ maxWidth: '800px !important', width: '100%' }}>
        <span className="close" onClick={()=>toggleModal()} style={{ color: 'black', fontSize: '40px' }}>&times;</span>
        <h2 style={{ color: 'black', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chi tiết đơn hàng {itemDH?.id}</h2>
         <div class="modal-bodys">
                    <div class="row headerdetail">
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Ngày tạo: <span class="yls" id="ngaytaoinvoice">{itemDH?.createdTime} {itemDH?.createdDate}</span></span>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Trạng thái vận chuyển: <span class="yls" id="ttvanchuyen">{trangThai(itemDH?.status)}</span></span>
                        </div>
                    </div>
                    <div class="row shipinfor">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                            <span class="ttshipinfor">Địa chỉ giao hàng</span>
                            <div class="blockinfor">
                                <p class="tennguoinhan" id="tennguoinhan">{itemDH?.receiverName}</p>
                                <span>Địa chỉ: <span id="addnhan">{itemDH?.address}</span></span>
                                <br/><span class="phoneacc">Số điện thoại: <span id="phonenhan">{itemDH?.phone}</span></span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Thanh toán</span>
                            <div class="blockinfor">
                                <span id="loaithanhtoan">{itemDH?.payType}</span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Ghi chú</span>
                            <div class="blockinfor">
                                <span id="ghichunh">{itemDH?.note}</span>
                            </div>
                        </div>
                    </div><br/><br/>
                    <div>
                        <h5>Lịch sử cập nhật trạng thái</h5>
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>Trạng thái</th>
                                <th>Ngày cập nhật</th>
                            </tr>
                            </thead>
                            <tbody id="listtrangthai">
                                {trangThais.map((item, i) => ( 
                                    <tr>
                                        <td>{item.createdDate}</td>
                                        <td>{item.status}</td>
                                        <td>{item.user.fullName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody id="listDetailinvoice">
                            {ctDonHang.map((item, i) => (
                                <tr key={i}>
                                    <td>
                                    <a href={`../detail?id=${item.size.product.id}`} target="_blank">
                                        {item.size.product.name}
                                    </a><br />
                                    <span>{item.size.name}</span><br />
                                    <span className="slmobile">SL: {item.quantity}</span>
                                    </td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td className="sldetailacc">{item.quantity}</td>
                                    <td className="pricedetailacc yls">{formatMoney(item.price * item.quantity)}</td>
                                </tr>
                                ))}
                        </tbody>
                    </table><br/><br/><br/><br/>
                </div>
        <div className="actions">
          <button className="cancel" onClick={()=>toggleModal()}>Đóng</button>
        </div>
      </div>
    </div>
      
</>
);

function changeLink(event, link) {
    const e = event.currentTarget;
    var tabs = document.getElementsByClassName("tabdv");
    for (var i = 0; i < tabs.length; i++) {
        document.getElementsByClassName("tabdv")[i].classList.remove("activetabdv");
    }
    e.classList.add('activetabdv')

    var tabb = document.getElementsByClassName("tab-pane");
    for (var i = 0; i < tabb.length; i++) {
        document.getElementsByClassName("tab-pane")[i].classList.remove("active");
    }
    document.getElementById(link).classList.add('active')
}

}
export default Account;