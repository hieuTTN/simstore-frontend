import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod, uploadSingleFile} from '../../services/request';
import {formatMoney} from '../../services/money';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';
import Select from 'react-select';


var linkbanner = '';
var description = '';

const AdminAddProduct = ()=>{
    const editorRef = useRef(null);

    const [product, setItem] = useState(null);
    const [categories, setcategories] = useState([]);
    const [kichThuocTam, setKichThuocTam] = useState([]);
    const [kichThuocDaThem, setKichThuocDaThem] = useState([]);
    const [selectCategory, setselectCategory] = useState(null);
    const [chuKy, setChuKy] = useState(null);


    useEffect(()=>{
        getSanPham();
        loadCategoryAddProduct();
        async function loadCategoryAddProduct() {
            const response = await getMethod('/api/category/public/all-category');
            var list = await response.json();
            setcategories(list);
        }
    }, []);

    const getSanPham = async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        if(id != null){
            var response = await getMethod('/api/product/public/findById?id='+id)
            var result = await response.json();
            setItem(result)
            description = result.description;
            document.getElementById("networkType").value = result.networkType;
            setselectCategory(result.category);
            setKichThuocDaThem(result.sizes);
        }
    };

    function addKichThuocTam(){
        var obj = {
            "name":document.getElementById("tensize").value,
            "price":document.getElementById("giaban").value,
            "oldPrice":document.getElementById("oldprice").value,
            "extraPromotion":document.getElementById("extraPromotion").value,
        }
        document.getElementById("tensize").value = "";
        document.getElementById("oldprice").value = "";
        document.getElementById("giaban").value = "";
        document.getElementById("extraPromotion").value = "";
        setKichThuocTam(prevItems => [...prevItems, obj]);
    }

    
    function handleEditorChange(content, editor) {
        description = content;
    }
    
    function handleCategoryChange(item) {
        setselectCategory(item);
        if(item.simType == "SIM_SO_DEP"){
            document.getElementById("divchuky").style.visibility = "hidden"
        }
        else{
            document.getElementById("divchuky").style.visibility = ""
        } 
    }

    async function saveProduct() {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var url = '/api/product/admin/create';
        if (id != null) {
            url = '/api/product/admin/update';
        }
        var product = {
            "id": id,
            "name": document.getElementById("tensp").value,
            "networkType": document.getElementById("networkType").value,
            "price": document.getElementById("price").value,
            "description": description,
            "category": {"id":selectCategory.id},
            "sizes": kichThuocTam,
        }
        const response = await postMethodPayload(url, product);
        var result = await response.json();
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "thêm/sửa sản phẩm thành công",
                preConfirm: () => {
                    window.location.href = 'product'
                }
            });
        } else {
            if(response.status == 417){
                toast.error(result.defaultMessage)
            }
            else{
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        }
    }

    async function deleteSize(id) {
        var con = window.confirm("Bạn chắc chắn muốn xóa chu kỳ sản phẩm này?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/size/admin/delete?id=' + id);
        if (response.status < 300) {
            toast.success("xóa chu kỳ thành công!");
            document.getElementById("sizedathem"+id).style.display = 'none'
        }
    }

    function loadSizeUpdate(chuky){
        setChuKy(chuky);
    }

    async function capNhatKichThuoc() {
        var kichthuoc = {
            "id": document.getElementById("idsizeupdate").value,
            "name": document.getElementById("tensizeupdate").value,
            "oldPrice": document.getElementById("oldpriceupdate").value,
            "price":document.getElementById("giabanupdate").value,
            "extraPromotion":document.getElementById("extraPromotionupdate").value,
        }
        const response = await postMethodPayload('/api/size/admin/update', kichthuoc);
        if (response.status < 300) {
            toast.success("Đã cập nhật chu kỳ thành công");
            getSanPham();
        } else {
            toast.error("Thất bại")
        }
    }


    function deleteKichThuocTam(position){
        setKichThuocTam(prev => prev.filter((_, i) => i !== position));
        toast.success("Đã xóa màu sắc ra khỏi bộ nhớ tạm");
    }

    return (
        <>
         <div class="col-sm-12 header-sps">
            <div class="title-add-admin">
                <h4>Thêm/ cập nhật sản phẩm</h4>
            </div>
        </div>
        <div class="col-sm-12">
            <main class="main row">
                <div class="col-sm-3">
                    <label class="lbadd">Tên sản phẩm</label>
                    <input id="tensp" class="inputcontrol" defaultValue={product?.name}  required/>
                    <label class="lbadd">Danh mục</label>
                    <Select
                        options={categories}
                        value={selectCategory}
                        onChange={handleCategoryChange}
                        getOptionLabel={(option) => option.name} 
                        getOptionValue={(option) => option.id}    
                        placeholder="Chọn danh mục"
                    /> 
                    <label class="lbadd">Giá hiển thị</label>
                    <input id="price" class="inputcontrol" defaultValue={product?.price} required/>
                    <label class="lbadd">Nhà Mạng</label>
                    <select class="form-control" id="networkType">
                        <option value="Viettel">Viettel</option>
                        <option value="Mobifone">Mobifone</option>
                        <option value="Vinaphone">Vinaphone</option>
                        <option value="Vietnamobile">Vietnamobile</option>
                    </select>
                </div>
                <div class="col-sm-6">
                     <h4 class="">Thông tin mô tả sản phẩm</h4>
                       <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/mcvdwnvee5gbrtksfafzj5cvgml51to5o3u7pfvnjhjtd2v1/tinymce/6/tinymce.min.js'}
                        onInit={(evt, editor) => editorRef.current = editor} 
                        initialValue={product==null?'':product.description}
                        onEditorChange={handleEditorChange}/>
                </div>
                <div className='col-sm-3'  id="divchuky">
                    <label class="lbadd">Thông tin chu kỳ</label>
                    <div id="listbonho">
                        {
                            product && (
                            <div id="listkichthuocdathem">
                                {kichThuocDaThem.map((item) => (
                                    <div className="singlekichthuocdathem" id={`sizedathem${item.id}`} key={item.id}>
                                    Tên chu kỳ: {item.name} - giá bán: {formatMoney(item.price)}
                                    {item.oldPrice != null && ` - giá cũ: ${formatMoney(item.oldPrice)}`}
                                    {item.extraPromotion && ` - Khuyến mại: ${item.extraPromotion}`}
                                    <i
                                        onClick={() => deleteSize(item.id)}
                                        className="fa fa-trash iconaction"
                                    ></i>
                                    <i onClick={() => loadSizeUpdate(item)} data-bs-toggle="modal" data-bs-target="#modalcapnhatkichthuoc"
                                        className="fa fa-edit iconaction"></i>
                                    </div>
                                ))}
                            </div>
                            )
                        }
                        <div id="listkichthuoctam">
                            {kichThuocTam.map((item, i) => (
                                <div class="singlekichthuoc">
                                    Tên chu kỳ: {item.name} - giá bán: {formatMoney(item.price)} 
                                    <i onClick={()=>deleteKichThuocTam(i)} class="fa fa-trash iconxoakt"></i>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br/>
                    <button id="btnthemchuky" data-bs-toggle="modal" data-bs-target="#modalthemkichthuoc" class="btn btn-outline-primary form-control"><i class="fa fa-plus"></i> Thêm chu kỳ sử dụng</button>
                </div>
                <div class="col-sm-12">
                    <br/><br/>
                <button onClick={()=>saveProduct()} class="btn btn-primary form-control" id="btnaddpro"><i class="fa fa-plus"></i> 
                    {product == null ? ' Thêm sản phẩm' : ' Cập nhật sản phẩm'}
                </button>
                </div>
            </main>
        </div>


        <div class="modal fade" id="modalthemkichthuoc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thêm chu kỳ</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                    <div class="modal-body">
                        <label class="lb-form">Tên chu kỳ</label>
                        <input id="tensize" class="form-control" placeholder="1 tháng, 6 tháng, 12 tháng"/>
                        <label class="lb-form">Khuyến mại (nếu có)</label>
                        <input id="extraPromotion" class="form-control"/>
                        <label class="lb-form">Giá bán</label>
                        <input id="giaban" class="form-control"/>
                        <label class="lb-form">Giá cũ</label>
                        <input id="oldprice" class="form-control"/>
                        <br/>
                        <button onClick={()=>addKichThuocTam()} id="btnaddmausac" class="form-control btn btn-primary btnaddmodal">Thêm chu kỳ vào bộ nhớ tạm</button>
                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade" id="modalcapnhatkichthuoc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cập nhật màu sắc</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                    <div class="modal-body">
                        <label class="lb-form">Tên chu kỳ</label>
                        <input id="idsizeupdate" type="hidden" defaultValue={chuKy?.id} class="form-control"/>
                        <input id="tensizeupdate" defaultValue={chuKy?.name} class="form-control"/>
                        <label class="lb-form">Giá bán</label>
                        <input id="giabanupdate" class="form-control" defaultValue={chuKy?.price}/>
                        <label class="lb-form">Giá cũ</label>
                        <input id="oldpriceupdate" class="form-control" defaultValue={chuKy?.oldPrice}/><br/>
                        <label class="lb-form">Khuyến mại (nếu có)</label>
                        <input id="extraPromotionupdate" class="form-control" defaultValue={chuKy?.extraPromotion}/><br/>
                        <button onClick={()=>capNhatKichThuoc()} id="btnaddmausac" class="form-control btn btn-primary btnaddmodal">Cập nhật chu kỳ</button>
                    </div>
                </div>
            </div>
        </div>


        </>
    );
}

export default AdminAddProduct;