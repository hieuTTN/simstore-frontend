import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import '../../css/simsieudata.css';


var token = localStorage.getItem("token");
function GioHang(){
    const [items, setItems] = useState([]);
    const [chuKys, setChuKys] = useState([]);
    const [idCart, setIdCart] = useState(null);
    const [idSize, setIdSize] = useState(null);
    const [tongTien, setTongTien] = useState(0);

    useEffect(()=>{
        fetchData();
    }, []);
    
    async function fetchData() {
        var token = localStorage.getItem("token");
        if(token == null){
            window.location.href = 'login'
        }
        const response = await getMethod('/api/cart/user/my-cart')
        var list = await response.json();
        if(list.length == 0){
            document.getElementById("cartEmpty").style.display = "";
            document.getElementById("giohangmain").style.display = "";
        }
        else{
            document.getElementById("giohangmain").style.display = "";
            document.getElementById("cartEmpty").style.display = "none";
        }
        setItems(list);
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].size.product.category.simType=="SIM_MANG"){
                 total += list[i].quantity * list[i].size.price
            }
            else{
                total += list[i].size.product.price
            }
        }
        setTongTien(total);
    }

    
    async function upDownQuantity(id, type) {
        var url = 'http://localhost:8080/api/cart/user/down-cart?id='+id ;
        if(type == "UP"){
            url = 'http://localhost:8080/api/cart/user/up-cart?id='+id ;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if(response.status < 300){
            fetchData();
        }
    }

    
    async function remove(id) {
        var con = window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")
        if(con == false){
            return;
        }
        var url = 'http://localhost:8080/api/cart/user/delete?id='+id ;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if(response.status < 300){
            fetchData();
        }
    }

    const showDetail = async (idproduct, idsize, quantity, idcart) => {
        openModal();
        setIdCart(idcart);
        setIdSize(idsize);
        const response = await getMethod(`/api/product/public/findById?id=${idproduct}`);
        var result = await response.json();
        document.getElementById("tengoimodal").innerHTML = result.name
        var list = result.sizes;
        setChuKys(list);
    };

    function openModal(){
        const modal = document.getElementById('modal');
        modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    }


    function toggleModal() {
        const modal = document.getElementById('modal');
        modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    }

    async function changeSize() {
        const idsize = document.querySelector('input[name="cycle"]:checked')?.value;
        var url = `http://localhost:8080/api/cart/user/chang-size?sizeId=${idsize}&id=${idCart}` ;
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if(response.status < 300){
            toast.success("Thay đổi gói cước thành công");
            fetchData();
        }
    }

    return(
        <>
        <div className="container-cart">
            <h2>Giỏ hàng</h2>

            <div className="cart-empty" id="cartEmpty">
                <img src="src/assets/empty-cart.svg" alt="Giỏ hàng trống" />
                <p>
                Giỏ hàng SIM DATA của bạn đang trống<br />Khám phá thêm để lựa chọn sản phẩm phù hợp
                </p>
                <button className="explore-btn" onclick="exploreNow()">Khám phá ngay</button>
            </div>

            <div className="container py-5" id="giohangmain">
                <div className="row">
                <div className="col-md-8">
                    <div id="listcart">
                        {items.map((item) => {
                            const isSimMang = item.size.product.category.simType === 'SIM_MANG';
                            return (
                                <div key={item.id} className="sim-card simcartcus">
                                {isSimMang ? (
                                    <>
                                    <div className="form-checks d-flex align-items-center">
                                        <label className="form-check-label fw-bold fs-5 me-auto">Gói {item.size.product.name}</label>
                                        <span className="trash-icon text-danger" onClick={() => remove(item.id)}>🗑️</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Chu kỳ</label>
                                        <span className="form-select w-auto d-inline-block pointer" onClick={() => showDetail(item.size.product.id, item.size.id, item.quantity, item.id)}>
                                        {item.size.name} ● {formatMoney(item.size.price)}
                                        </span>
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label fw-bold me-3">Số lượng</label>
                                        <button onClick={() => upDownQuantity(item.id, 'DOWN')} className="btn btn-outline-secondary btn-circle">−</button>
                                        <span className="mx-3">{item.quantity}</span>
                                        <button onClick={() => upDownQuantity(item.id, 'UP')} className="btn btn-outline-secondary btn-circle">+</button>
                                    </div>
                                    </>
                                ) : (
                                    <>
                                    <div className="form-checks d-flex align-items-center mb-3">
                                        <label className="form-check-label fw-bold fs-5 me-auto">{item.size.product.name}</label>
                                        <span className="trash-icon text-danger" onClick={() => remove(item.id)}>🗑️</span>
                                    </div>
                                    <div className="mb-3 divgiasimsodep">
                                        <label className="form-label fw-bold">Loại mạng: </label>
                                        <label className="w-auto d-inline-block">{item.size.product.networkType}</label>
                                        <label className="pricesimsodep">{formatMoney(item.size.product.price)}</label>
                                    </div>
                                    </>
                                )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="total-box">
                    <p className="text-muted mb-2">
                        Lưu ý: Hiện tại chúng tôi chỉ hỗ trợ thanh toán 1 loại SIM/Đơn hàng (<b>SIM Data</b> hoặc <b>SIM Số Đẹp</b>)
                    </p>
                    <p className="text-danger">
                        <strong>Với SIM Data bạn được mua nhiều gói/đơn hàng</strong>
                    </p>
                    <hr />
                    <p className="text-uppercase fw-bold text-primary">Tạm tính</p>
                    <div className="price mb-4" id="tonggiatien">{formatMoney(tongTien)}</div>
                    <button className="btn btn-buy mb-2" onClick={() => window.location.href = '/thanhtoan'}>
                        TIẾN HÀNH MUA HÀNG
                    </button>
                    <button className="btn btn-other">MUA GÓI KHÁC</button>
                    </div>
                </div>
                </div>
            </div>
        </div>



          <div id="modal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={()=>toggleModal()} style={{ color: 'black', fontSize: '40px' }}>&times;</span>
                <h2 style={{ color: 'black', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chu kỳ gói</h2>
                <h3 style={{ color: 'black', paddingBottom: '2rem', fontSize: '25px' }}>
                <span style={{ color: '#d32f2f', paddingBottom: '2rem', fontSize: '30px', textAlign: 'center', display: 'block' }} id="tengoimodal">Gói DISCOVER</span>
                </h3>

                <p style={{ color: 'black', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chọn chu kỳ</p>
                <div className="cycles" id="listchuky">
                {chuKys.map((item, i) => (
                    <label className="cycle" key={item.id}>
                    <input
                        type="radio"
                        name="cycle"
                        value={item.id}
                        defaultChecked={item.id === idSize}
                    />
                    <div style={{ color: 'black', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {item.name}<br />
                        {(item.extraPromotion != null && item.extraPromotion !== '') && (
                        <>
                            <span className="bonus">{item.extraPromotion}</span><br />
                        </>
                        )}
                        {item.oldPrice != null && (
                        <>
                            <span className="strikethrough">{formatMoney(item.oldPrice)}</span>{' '}
                            <span className="discount">-{formatMoney(item.oldPrice - item.price)}</span><br />
                        </>
                        )}
                        <strong>{formatMoney(item.price)}</strong>
                    </div>
                    </label>
                ))}

                </div>


                <div className="actions">
                <button className="cancel" onClick={()=>toggleModal()}>HỦY</button>
                <button className="add-to-cart" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }} id="btnmuangay" onClick={() => changeSize()}>
                Lưu<nav></nav>
                </button>

                </div>
            </div>
            </div>
        </>
    );
}
export default GioHang;