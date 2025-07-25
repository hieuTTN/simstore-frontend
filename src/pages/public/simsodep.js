import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod, postMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { loadCartMenu } from '../../services/cart';

var size = 5
var url = '';
function SimSoDep(){
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        import ('../../css/simsodep.css')
        async function loadAllNetwork() {
            var url = `http://localhost:8080/api/product/public/all-network`;
            const response = await fetch(url, {});
            var list = await response.json();
            var main = `<option value="">Tất cả nhà mạng</option>`
            for (var i = 0; i < list.length; i++) {
                main += `<option value="${list[i]}">${list[i]}</option>`;
            }
            document.getElementById("network").innerHTML = main;
        }
        loadAllNetwork();
        async function loadCategorySimSoDep() {
            var url = `http://localhost:8080/api/category/public/find-by-type?simType=SIM_SO_DEP`;
            const response = await fetch(url, {});
            var list = await response.json();
            var main = `<option value="">Tất cả loại sim</option>`
            for (var i = 0; i < list.length; i++) {
                main += `<option value="${list[i].id}">${list[i].name}</option>`;
            }
            document.getElementById("simtype").innerHTML = main;
        }
        loadCategorySimSoDep();

    loadSimSoDep(0);
    }, []);

    
    async function loadSimSoDep(page) {
        var price = document.getElementById("price-range").value
        var small = price.split("-")[0]
        var large = price.split("-")[1]
        var network = document.getElementById("network").value
        var simtype = document.getElementById("simtype").value
        var search = document.getElementById("search").value
        var url = `http://localhost:8080/api/product/public/sim-so-dep?page=${page}&size=5&small=${small}&large=${large}&phone=${search}`
        if(simtype != ""){
            url += `&categoryId=${simtype}`
        }
        if(network != ""){
            url += `&network=${network}`
        }
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        var list = result.content;
        setItems(list);
        setpageCount(result.totalPages)
    }

    function formatDate(input) {
    const date = new Date(input);

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
    }


    function formatmoney(money) {
        const VND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return VND.format(money);
    }

     const handlePageClick = async (data)=>{
        var currentPage = data.selected
        loadSimSoDep(currentPage);
    }

    
  async function addcartSimSoDep(idsize,type) {
      var token = localStorage.getItem("token");
      if(token == null){
          toast.warning("Bạn hãy đăng nhập để thực hiện chức năng này");
          return;
      }
      const response = await postMethod('/api/cart/user/create?sizeId='+idsize+"&quantity=1")
      if (response.status < 300) {
          toast.success("Thêm giỏ hàng thành công!");
          loadCartMenu();
          if(type == 'muangay'){
              window.location.href = 'giohang'
          }
      }
      else {
          toast.error("Thêm giỏ hàng thất bại!");
      }
  }

    return(
        <>
      {/* Banner chạy chữ */}
      <section className="hero-banner sim-hero">
        <div className="container">
          <div className="marquee">
            <div className="marquee-content">
              <span>SIM TỨ QUÝ 8</span>
              <span className="separator-img"></span>
              <span>SIM LỤC QUÝ 6</span>
              <span className="separator-img"></span>
              <span>SIM ÔNG ĐỊA</span>
              <span className="separator-img"></span>
              <span>SIM THẦN TÀI</span>
              <span className="separator-img"></span>
              <span>SIM TAM HOA</span>
              <span className="separator-img"></span>
              <span>SIM NGŨ QUÝ</span>
            </div>
          </div>

          {/* Banner lớn */}
          <div className="banner-container">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'%3E%3Crect width='1200' height='400' fill='%231a365f'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='40' fill='white'%3EBanner Sim S%E1%BB%91 %C4%90%E1%BA%B9p%3C/text%3E%3C/svg%3E"
              alt="Sim Số Đẹp"
              className="full-banner"
            />
            <div className="banner-overlay">
              <h1>KHO SIM SỐ VIP ĐỘC QUYỀN</h1>
              <p>Hơn 10.000 sim phong thủy - Giá gốc tại kho</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bộ lọc sim */}
      <section className="sim-filter">
        <div className="container">
          <div className="filter-container">
            <div className="filter-group">
              <label htmlFor="simtype">Loại sim</label>
              <select className="filter-select" id="simtype">
                {/* Đổ dữ liệu loại sim tại đây */}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="price-range">Mức giá</label>
              <select className="filter-select" id="price-range">
                <option value="0-1000000000">Tất cả mức giá</option>
                <option value="0-999999">Dưới 1 triệu</option>
                <option value="1000000-5000000">1 - 5 triệu</option>
                <option value="5000000-10000000">5 - 10 triệu</option>
                <option value="10000000-50000000">10 - 50 triệu</option>
                <option value="50000000-100000000">50 - 100 triệu</option>
                <option value="100000000-10000000000">Trên 100 triệu</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="network">Nhà mạng</label>
              <select className="filter-select" id="network">
                <option value="">Tất cả nhà mạng</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="search">Tìm kiếm</label>
              <input
                type="text"
                id="search"
                className="filter-select"
                placeholder="Nhập số điện thoại..."
              />
            </div>

            <button className="filter-btn" onClick={() => loadSimSoDep(0)}>
              <i className="fas fa-search"></i> Tìm sim
            </button>
          </div>
        </div>
      </section>

      {/* Danh sách sim đẹp */}
      <div className="sisodepdivmain">
        <div className="container my-5">
          <div className="text-center text-white mb-4">
            <h3>
              <strong>Hoặc các số gợi ý từ Local</strong>
            </h3>
          </div>

          <div className="bg-white p-4 card-custom">
            <div className="row fw-bold text-muted pb-2 border-bottom">
              <div className="col-md-3">Số đẹp</div>
              <div className="col-md-2">Trả thẳng ↑</div>
              <div className="col-md-2">Nhà mạng ↑</div>
              <div className="col-md-2">Loại sim ↑</div>
              <div className="col-md-3 text-end"></div>
            </div>

            <div id="listsimsodep">
              {items.map((item=>{
                return <div class="row phone-row {item.sold == true?'simdabanrow':''}">
                            <div class="col-md-3 fw-bold">{item.name}<span class="ngaydang">{formatDate(item.createdDate)}</span></div>
                            <div class="col-md-2">
                            <div><strong>{formatmoney(item.price)}</strong></div>
                            </div>
                            <div class="col-md-2">
                            <div><strong>{item.networkType}</strong></div>
                            </div>
                            <div class="col-md-2">
                            <div><strong>{item.category.name}</strong></div>
                            </div>
                            <div class="col-md-3 d-flex justify-content-end align-items-center gap-2">
                            {item.sold == true?<span class="error">Đã bán</span>:
                            <> <div class="cart-icon pointer" onClick={()=>addcartSimSoDep(item.sizes[0].id,'giohang')}>
                                🛒
                            </div>
                            <button class="btn btn-outline-danger buy-button"  onClick={()=>addcartSimSoDep(item.sizes[0].id,'muangay')}>MUA NGAY</button></>}
                            </div>
                        </div>
              }))}
            </div>

            <ReactPaginate 
                style={{ marginTop: 30 }}
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
      </div>

    </>
    );
}
export default SimSoDep;