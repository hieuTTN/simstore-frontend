import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod, postMethod} from '../../services/request';
import {formatMoney} from '../../services/money';


var size = 10
var url = '';
const AdminInvoice = ()=>{
    const [items, setItems] = useState([]);
    const [trangthai, setTrangThai] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [selectDonHang, setSelectDonHang] = useState(null);
    const [chiTietDonHang, setChiTietDonHang] = useState([]);
    const [donHang, setDonHang] = useState(null);
    const [idTrangThai, setIdTrangThai] = useState(-1);
    const [trangThais, setTrangThais] = useState([]);


    useEffect(()=>{
        getData();
        getTrangThai();
    }, []);

    const getTrangThai = async() =>{
        var response = await getMethod('/api/invoice/admin/all-status')
        var result = await response.json();
        setTrangThai(result)
    };

    const getData = async() =>{
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        var type = document.getElementById("type").value
        var trangthai = document.getElementById("trangthai").value
        url = '/api/invoice/admin/find-all?size=' + size;
        if (start != "" && end != "") {
            url += '&from=' + start + '&to=' + end;
        }
        if (type != -1) {
            url += '&paytype=' + type;
        }
        if (trangthai != -1) {
            url += '&status=' + trangthai
        }
        url += '&page='
        var response = await getMethod(url+0)
        var result = await response.json();
        console.log(result);
        
        setItems(result.content)
        setpageCount(result.totalPages)
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    
    async function getChiTietDon(invoice) {
        setSelectDonHang(invoice)
        var response = await getMethod('/api/invoice-detail/admin/find-by-invoice?idInvoice='+invoice.id);
        var result = await response.json();
        setChiTietDonHang(result)
    }

    function getTrangThaiUp(item){
        setDonHang(item)
        setIdTrangThai(item.status)
    }

    async function updateStatus() {
        var idtrangthai = document.getElementById("trangthaiupdate").value
        var idinvoice = document.getElementById("iddonhangupdate").value
        var url = 'http://localhost:8080/api/invoice/admin/update-status?idInvoice=' + idinvoice + '&status=' + idtrangthai;
        const res = await postMethod(url)
        if (res.status < 300) {
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            getData();
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
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

    return (
        <>
        <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Đơn Hàng</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className='d-flex divngayadmin'>
                        <input type='date' id='start' className='selectheader'/> 
                        <input type='date' id='end' className='selectheader'/>  
                        <select id="type" class="selectheader">
                            <option value="-1">--- Loại thanh toán---</option>
                            <option value="PAYMENT_MOMO">Thanh toán bằng momo</option>
                            <option value="PAYMENT_COD">Thanh toán khi nhận hàng</option>
                            <option value="PAYMENT_VNPAY">Thanh toán vnpay</option>
                        </select>
                        <select id="trangthai" class="selectheader">
                            <option value="-1">--- Trạng thái---</option>
                            {trangthai.map((item=>{
                                return <option value={item}>{trangThai(item)}</option>
                            }))}
                        </select>

                        <button onClick={()=>getData()} className='btn btn-primary selectheader'>Lọc</button>
                    </div>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đơn hàng</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th class="floatr">Ngày đặt</th>
                                <th>Địa chỉ</th>
                                <th class="floatr">Giá trị<br/>đơn hàng</th>
                                <th>Trạng thái vận chuyển</th>
                                <th class="floatr">Loại thanh toán</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime}<br/>{item.createdDate}</td>
                                    <td>{item.address}</td>
                                    <td>{formatMoney(item.totalAmount)}</td>
                                    <td>{trangThai(item.status)}</td>
                                    <td>{item.payType}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>getChiTietDon(item)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                                        <i onClick={()=>getTrangThaiUp(item)} data-bs-toggle="modal" data-bs-target="#capnhatdonhang" class="fa fa-edit iconaction"></i><br/>
                                        <a target="_blank" href={`in-don?id=${item.id}`}><i class="fa fa-print iconaction"></i></a>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>

                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>

            <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Chi tiết đơn hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row headerdetail">
                                <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <br/><span>Ngày tạo: <span class="yls" id="ngaytaoinvoice">{selectDonHang?.createdTime} {selectDonHang?.createdDate}</span></span>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <br/><span>Trạng thái thanh toán: <span class="yls" id="trangthaitt">{selectDonHang?.payType!="PAYMENT_COD"?"Đã thanh toán":"Thanh toán khi nhận hàng"}</span></span>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <br/><span>Trạng thái vận chuyển: <span class="yls" id="ttvanchuyen">{trangThai(selectDonHang?.status)}</span></span>
                                </div>
                            </div>
                            <div class="row shipinfor">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                    <span class="ttshipinfor">Địa chỉ giao hàng</span>
                                    <div class="blockinfor">
                                        <p class="tennguoinhan" id="tennguoinhan">{selectDonHang?.receiverName}</p>
                                        <span>Địa chỉ: <span id="addnhan">{selectDonHang?.address}</span></span>
                                        <br/><span class="phoneacc">Số điện thoại: <span id="phonenhan">{selectDonHang?.phone}</span></span>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                                    <span class="ttshipinfor">Thanh toán</span>
                                    <div class="blockinfor">
                                        <span id="loaithanhtoan">{selectDonHang?.payType}</span>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                                    <span class="ttshipinfor">Ghi chú</span>
                                    <div class="blockinfor">
                                        <span id="ghichunh">{selectDonHang?.note}</span>
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
                                        {selectDonHang?.invoiceStatuses.map((item, i) => ( 
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
                                <tbody>
                                    {chiTietDonHang.map((item, index) => (
                                        <tr key={index}>
                                        <td>
                                            <a href={`../detail?id=${item.size.product.id}`} target="_blank">
                                            {item.size.product.name}
                                            </a>
                                            <br />
                                            <span>{item.size.name}</span>
                                            <br />
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
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="capnhatdonhang" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Cập nhật trạng thái đơn hàng</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body">
                            <input value={donHang?.id} type="hidden" id="iddonhangupdate"/>
                            <select class="form-control" id="trangthaiupdate">
                                {trangthai.map((item=>{
                                    return <option selected={idTrangThai == item} value={item}>{trangThai(item)}</option>
                                }))}
                            </select><br/><br/>
                            <button onClick={()=>updateStatus()} class="btn btn-primary form-control action-btn">Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminInvoice;