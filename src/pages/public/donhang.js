import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
function DonHang(){
    const [item, setItem] = useState(null);

    useEffect(()=>{
    }, []);

     const getItem = async() =>{
        var id = document.getElementById("orderIdInput").value;
        const response = await getMethod('/api/invoice/user/find-by-id?idInvoice=' + id);
        var result = await response.json();
        setItem(result)
    };

    return(
        <>
            <main class="donhang">
            <div class="container">
                <img src="src/assets/bg-search.svg" alt=""/>
                <h1>Tra cứu đơn hàng</h1>
                <div class="content">
                    <p>Mã đơn hàng đã được gửi đến email của bạn.</p>
                    <p>Bạn có thể nhập mã đơn hàng xuất dưới đây để theo dõi trạng thái đơn hàng.</p>
                </div>
                <div class="input-container">
                    <input type="text" id="orderIdInput" placeholder="Nhập mã đơn hàng"/>
                    <button onClick={()=>getItem()}>Tra cứu</button>
                </div>
                <p class="error" id="errorMessage">Mã đơn hàng không hợp lệ!</p>
                <div class="result" id="resultSection">
                    <h2>Thông tin đơn hàng</h2>
                    <p><strong>Mã đơn hàng:</strong> <span id="orderId"></span></p>
                    <p><strong>Ngày đặt hàng:</strong> <span id="orderDate"></span></p>
                    <p><strong>Trạng thái:</strong> <span id="orderStatus"></span></p>
                </div>
            </div>
            </main>
        </>
    );
}
export default DonHang;