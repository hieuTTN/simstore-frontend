import { getMethod } from '../../services/request';
import { formatMoney } from '../../services/money';
import { useState, useEffect } from 'react';
import '../../css/simsieudata.css';
import { toast } from 'react-toastify';
import { loadCartMenu } from '../../services/cart';

function SimData() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chuKys, setChuKys] = useState([]);
  const [newData, setNewData] = useState(null);
  const [activeTab, setActiveTab] = useState('taball');

  useEffect(() => {
    fetchNewData();
    loadCategorySimMang();
    productByCategory(-1, 'taball');
  }, []);

  async function fetchNewData() {
    const response = await getMethod('/api/product/public/product-new-data');
    const result = await response.json();
    setNewData(result);
  }

  async function loadCategorySimMang() {
    const url = `/api/category/public/find-by-type?simType=SIM_MANG`;
    const response = await getMethod(url);
    const list = await response.json();
    setCategories(list);
  }

  async function productByCategory(idcategory, name) {
    setActiveTab(name);
    let url = `/api/product/public/find-by-category`;
    if (idcategory !== -1) {
      url += `?categoryId=${idcategory}`;
    }
    const response = await getMethod(url);
    const list = await response.json();
    setItems(list);
  }


  function openModal(type){
    const modal = document.getElementById('modal');
    modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    if(type == 'muangay'){
      document.getElementById("btnthemgiohang").style.display = 'none';
      document.getElementById("btnmuangay").style.display = '';
    }
    else{
        document.getElementById("btnthemgiohang").style.display = '';
        document.getElementById("btnmuangay").style.display = 'none';
    }
  }

  const showDetail = async (id, type) => {
    openModal(type);
    const response = await getMethod(`/api/product/public/findById?id=${id}`);
    var result = await response.json();
    document.getElementById("tengoimodal").innerHTML = result.name
    var list = result.sizes;
    setChuKys(list);
  };

  function toggleModal() {
    const modal = document.getElementById('modal');
    modal.style.display = (modal.style.display === 'flex' || modal.style.display === 'block') ? 'none' : 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
  }

  function changeQuantity(change) {
    const qtyEl = document.getElementById('qty');
    let qty = parseInt(qtyEl.textContent);
    qty = Math.max(1, qty + change);
    qtyEl.textContent = qty;
  }


  async function addcart(type) {
    var token = localStorage.getItem("token");
    const value = document.querySelector('input[name="cycle"]:checked')?.value;
    if(token == null){
        toast.warning("Bạn hãy đăng nhập để thực hiện chức năng này");
        return;
    }
    var quantity = document.getElementById("qty").textContent
    var url = 'http://localhost:8080/api/cart/user/create?sizeId='+value+"&quantity="+quantity;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if (response.status < 300) {
        toast.success("Thêm giỏ hàng thành công!");
        loadCartMenu();
        if(type == 'muangay'){
            window.location.href = 'giohang'
        }
    }
    else {
        toast.erorr("Thêm giỏ hàng thất bại!");
    }
  }


  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <div className="GoiData">
            <span className="Data">Gói DATA mới siêu HOT</span>
            <div className="package-tag">
              <div className="Moi">
                <img className="image-Goicuocmoi" src="src/assets/iiiii_778d6589df.png" alt="Gói cước mới" />
              </div>
            </div>
          </div>

          <div className="A89D">
            <div className="plan-title">
              Gói <span style={{ color: '#04ff00' }}>{newData?.name}</span>
            </div>
          </div>

          <div className="package-info">
            <div className="raw-html" dangerouslySetInnerHTML={{ __html: newData?.description }} />
          </div>

          <div className="Price">
            <div className="Package-Price">
              <div className="Price-flex">
                <span className="Text-Price">{formatMoney(newData?.price)}</span>
              </div>
            </div>

            <div className="Package-action">
              <button className="icon-cart" onClick={() => showDetail(newData?.id, 'giohang')}>
                <img src="src/assets/minimal-49-512.webp" alt="Giỏ hàng" />
              </button>
              <button className="cart-button" onClick={() => showDetail(newData?.id, 'muangay')}>
                MUA NGAY
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="Danh-Sach">
        <div className="lg-container">
          <div className="list-package-top">
            <div className="list-local-package-title">
              <div className="list-package-title">
                <span className="Text-Danhsach">Danh sách gói cước của HITC TRAVEL</span>
                <div className="divider"></div>
              </div>
            </div>

            <div className="tabs">
              <div className={`tab ${activeTab === 'taball' ? 'active' : ''}`} onClick={() => productByCategory(-1, 'taball')}>
                Tất cả
              </div>
              {categories.map((item) => (
                <div key={item.id} className={`tab ${activeTab === `tabdiv${item.id}` ? 'active' : ''}`}
                  onClick={() => productByCategory(item.id, `tabdiv${item.id}`)}>
                  {item.name}
                </div>
              ))}
            </div>

            <div className="row">
              {items.map((item, index) => (
                <div className="col-sm-4" key={item.id}>
                  <div className={`plan ${index % 2 === 0 ? 'red' : 'planwight'}`}>
                    <div className="styles_packageItemTop__CcsJl">
                      <div className="flex flex-col w-fit styles_packageItemNameContent__LVo5U">
                        <span className="font-bold-white" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                          Gói {item.name}
                        </span>
                      </div>
                      <div className="flex-col">
                        <div className="flex-gap">
                          <span className="data-tocdocao">
                            <p style={{ margin: 0, fontWeight: 700, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 15 }}>
                              {item.sizes.length > 0 ? `Data tốc độ cao - chu kỳ ${item.sizes[0].name}` : ''}
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }} dangerouslySetInnerHTML={{__html:item.description}}></div>
                    <hr />
                    <div className="package-item-bottom" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                      <div className="Thanh-Toan">
                        <span className="Text-ThanhToan">Thanh toán</span>
                        <div className="Gia">
                          <span className="Text-Gia">{formatMoney(item.price)}</span>
                        </div>
                      </div>
                      <div className="Cart-MuaNgay">
                        <button className="Shopping-cart" onClick={() => showDetail(item.id, 'giohang')}>
                          <img src="src/assets/minimal-49-512.webp" alt="Giỏ hàng" />
                        </button>
                        <button className="Mua-Ngay" onClick={() => showDetail(item.id, 'muangay')}>
                          <span className="Text-MuaNgay">Mua ngay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


     <div id="modal" className="modal">
      <div className="modal-content-custom">
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
                defaultChecked={i === 0}
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

        <p style={{ color: 'black', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chọn số lượng</p>
        <div className="quantity">
          <button style={{ color: 'black' }} onClick={()=>changeQuantity(-1)}>−</button>
          <span style={{ color: 'black' }} id="qty">1</span>
          <button style={{ color: 'black' }} onClick={()=>changeQuantity(1)}>+</button>
        </div>

        <div className="actions">
          <button className="cancel" onClick={()=>toggleModal()}>HỦY</button>
          <button className="add-to-cart" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }} id="btnthemgiohang" onClick={()=>addcart('giohang')}>THÊM VÀO GIỎ HÀNG</button>
          <button className="add-to-cart" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }} id="btnmuangay" onClick={()=>addcart('muangay')}>MUA NGAY</button>
        </div>
      </div>
    </div>

    </>
  );
}

export default SimData;
