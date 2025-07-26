import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, postMethod} from '../../services/request';


var token = localStorage.getItem("token");


async function handleAddAccount(event) {
    event.preventDefault();
    if(event.target.elements.password.value != event.target.elements.repassword.value){
        toast.error("Mật khẩu không trùng khớp");
        return;
    }
    const payload = {
        fullname: event.target.elements.fullname.value,
        email: event.target.elements.email.value,
        phone: event.target.elements.phone.value,
        password: event.target.elements.password.value
    };
    const res = await postMethodPayload('/api/admin/addaccount',payload)
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Thông báo",
            text: "Tạo tài khoản thành công!",
            preConfirm: () => {
                window.location.reload();
            }
        });
    }
};

var size = 10
var url = '';
const AdminUser = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getUser();
    }, []);

    const getUser = async() =>{
        var response = await getMethod('/api/user/admin/get-user-by-role-page?&size='+size+'&q=&sort=id,desc&page='+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/user/admin/get-user-by-role-page?&size='+size+'&q=&sort=id,desc&page='
    };

    async function filterUser(){
        var role = document.getElementById("role").value
        var curUrl = '/api/user/admin/get-user-by-role-page?&size='+size+'&q=&sort=id,desc&role='+role+'&page=';
        if(role == ""){
            curUrl = '/api/user/admin/get-user-by-role-page?&size='+size+'&q=&sort=id,desc&page=';
        }
        var response = await getMethod(curUrl+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = curUrl;
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    async function lockOrUnlock(id, type) {
        var con = window.confirm("Xác nhận hành động?");
        if (con == false) {
            return;
        }
        const response = await postMethod('/api/user/admin/lockOrUnlockUser?id=' + id)
        if (response.status < 300) {
            var mess = '';
            if (type == 1) {
                mess = 'Khóa thành công'
            } else {
                mess = 'Mở khóa thành công'
            }
            toast.success(mess);
            filterUser();
        } else {
            toast.error("Thất bại");
        }
    }

    function setAccChange(id, role) {
        document.getElementById("idacc").value = id;
        document.getElementById("rolechange").value = role; 
    }
    
    async function changerole() {
        var id = document.getElementById("idacc").value
        var role = document.getElementById("rolechange").value
        const response = await postMethod('/api/user/admin/change-role?id=' + id+'&role='+role);
        if (response.status < 300) {
            toast.success("Thành công!");
            getUser();
        } else {
            toast.error("Thất bại");
        }
    }
    
    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Tài Khoản</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                        <select onChange={()=>filterUser()} id='role' class="form-control">
                            <option value="">Tất cả quyền</option>
                            <option value="ROLE_USER">Tài khoản người dùng</option>
                            <option value="ROLE_ADMIN">Tài khoản admin</option>
                        </select>
                    </div>
                    <button data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách tài khoản</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Email</th>
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Ngày tạo</th>
                                <th>Quyền</th>
                                <th>Khóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                var btn = '';
                                if (item.actived == false) {
                                    var btn = <button onClick={()=>lockOrUnlock(item.id,0)} class="btn btn-danger"><i class="fa fa-unlock"></i></button>
                                } else {
                                    var btn = <button onClick={()=>lockOrUnlock(item.id,1)} class="btn btn-primary"><i class="fa fa-lock"></i></button>
                                }
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.email} 
                                        {item.userType=="GOOGLE"?<img src="/image/google.png" class="googleicon"/>:<></>}
                                    </td>
                                    <td>{item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.authorities.name}
                                        <i onClick={()=>setAccChange(item.id, item.authorities.name)} data-bs-toggle="modal" data-bs-target="#modalrole" class="fa fa-edit iconaction iconacc"></i>
                                    </td>
                                    <td class="sticky-col">
                                        {btn}
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

            <div class="modal fade" id="addtk" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Thêm tài khoản quản trị</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form onSubmit={handleAddAccount} class="col-sm-6" style={{margin:'auto'}}>
                                <label class="lb-form">Họ tên</label>
                                <input name='fullname' id="fullname" class="form-control"/>
                                <label class="lb-form">Số điện thoại</label>
                                <input name='phone' id="phone" class="form-control"/>
                                <label class="lb-form">Email</label>
                                <input name='email' required id="email" class="form-control"/>
                                <label class="lb-form">Mật khẩu</label>
                                <input name='password' required id="pass" type="password" class="form-control"/>
                                <label class="lb-form">Nhắc lại mật khẩu</label>
                                <input name='repassword' required id="repass" type="password" class="form-control"/>
                                <br/>
                                <button class="form-control btn btn-primary">Thêm tài khoản</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

             <div class="modal fade" id="modalrole" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Thay đổi quyền tài khoản</h5>
            </div>
            <div class="modal-body">
                <div>
                    <input type="hidden" id="idacc"/>
                    <select class="form-control" id="rolechange">
                        <option value="ROLE_USER">Tài khoản người dùng</option>
                        <option value="ROLE_ADMIN">Tài khoản admin</option>
                    </select>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button onClick={()=>changerole()} class="btn btn-primary">Thay đổi</button>
                      </div>
                </div>
            </div>
          </div>
        </div>
      </div>
        </>
    );
}

export default AdminUser;