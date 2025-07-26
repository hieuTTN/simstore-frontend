import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod} from '../../services/request';
import {formatMoney} from '../../services/money';
import Select from 'react-select';
import React from 'react';


var size = 10
var url = '';
const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    const [category, setcategory] = useState([]);
    const [selectCategory, setSelectcategory] = useState(null);
    const [selectSimType, setSelectSimType] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [simType, setSimType] = useState([{type:'SIM_MANG', name:'Sim mạng'},{type:'SIM_SO_DEP', name:'Sim số đẹp'}]);

    useEffect(()=>{
        getCategory();
        getProduct();
    }, []);

    const getCategory = async() =>{
        var response = await getMethod('/api/category/public/all-category')
        var result = await response.json();
        setcategory(result)
    };

    const getProduct = async() =>{
        var response = await getMethod('/api/product/public/findAll-page-admin?&size='+size+'&page='+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/product/public/findAll-page-admin?&size='+size+'&page='
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    

    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa dữ liệu này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/product/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getProduct();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
        <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Sản Phẩm</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className='d-flex divngayadmin'>
                        <Select
                            options={category}
                            value={selectCategory}
                            onChange={setSelectcategory}
                            getOptionLabel={(option) => option.name} 
                            getOptionValue={(option) => option.id}    
                            placeholder="Chọn danh mục"
                        /> 
                        <Select
                            options={simType}
                            value={selectSimType}
                            onChange={setSelectSimType}
                            getOptionLabel={(option) => option.name} 
                            getOptionValue={(option) => option.type}    
                            placeholder="Chọn loại sim"
                            className='selectheader'
                        /> 
                        <button onClick={()=>getProduct()} className='btn btn-primary selectheader'>Lọc</button>
                        <a href='add-product' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                    </div>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách bài viết</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Danh mục</th>
                                <th>Tên gói/ số điện thoại</th>
                                <th>Giá</th>
                                <th>Ngày tạo</th>
                                <th>Số lượng bán</th>
                                <th>Chu kỳ</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => {
  const ms = item.sizes.map((size, j) => (
    <React.Fragment key={j}>
      <br />
      <strong className="sizetable">{size.name}</strong>: {formatMoney(size.price)}
    </React.Fragment>
  ));

  return (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.category.name} - {item.category.simType}</td>
      <td>{item.name}</td>
      <td>{formatMoney(item.price)}</td>
      <td>{item.createdDate}</td>
      <td>{item.quantitySold}</td>
      <td>
        {item.category.simType !== 'SIM_SO_DEP' ? ms : ''}
      </td>
      <td className="sticky-col">
        <i onClick={() => deleteData(item.id)} className="fa fa-trash-alt iconaction"></i>
        <a href={`addproduct?id=${item.id}`}>
          <i className="fa fa-edit iconaction"></i><br />
        </a>
      </td>
    </tr>
  );
})}

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
        </>
    );
}

export default AdminProduct;