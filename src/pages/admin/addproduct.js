import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod, uploadSingleFile} from '../../services/request';
import {formatMoney} from '../../services/money';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


var linkbanner = '';
var description = '';
async function saveBlog() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    var linktam = await uploadSingleFile(document.getElementById('fileimage'))
    if(linktam != null) linkbanner = linktam
    var blog = {
        "id": id,
        "title": document.getElementById("title").value,
        "description": document.getElementById("description").value,
        "content": description,
        "imageBanner": linkbanner,
    }

    const response = await postMethodPayload('/api/blog/admin/create',blog)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "thêm/sửa blog thành công!",
            preConfirm: () => {
                window.location.href = 'blog'
            }
        });
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.defaultMessage);
    }
    document.getElementById("loading").style.display = 'none'
}



const AdminAddProduct = ()=>{
    const editorRef = useRef(null);
    const [blog, setItem] = useState(null);
    useEffect(()=>{
        const getBaiViet = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/blog/public/findById?id='+id)
                var result = await response.json();
                setItem(result)
                linkbanner = result.imageBanner
                description = result.content;
                document.getElementById("imgpreview").src = result.imageBanner
            }
        };
        getBaiViet();
    }, []);

    
    function handleEditorChange(content, editor) {
        description = content;
    }
    
    function onchangeFile(){
        const [file] = document.getElementById("fileimage").files
        if (file) {
            document.getElementById("imgpreview").src = URL.createObjectURL(file)
        }
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
                    <input id="tensp" class="inputcontrol" required/>
                    <label class="lbadd">Danh mục</label>
                    <select class="inputcontrol" id="listcategory" onchange="handleCategoryChange()">

                    </select>
                    <label class="lbadd">Giá hiển thị</label>
                    <input id="price" class="inputcontrol" required/>
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
                        initialValue={blog==null?'':blog.content}
                        onEditorChange={handleEditorChange}/>
                </div>
                <div className='col-sm-3'>
                    <label class="lbadd">Thông tin chu kỳ</label>
                    <div id="listbonho">
                        <div id="listkichthuocdathem"></div>
                        <div id="listkichthuoctam"></div>
                    </div>
                    <br/>
                    <button id="btnthemchuky" data-bs-toggle="modal" data-bs-target="#modalthemkichthuoc" class="btn btn-outline-primary form-control"><i class="fa fa-plus"></i> Thêm chu kỳ sử dụng</button>
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
                        <button onclick="addKichThuocTam()" id="btnaddmausac" class="form-control btn btn-primary btnaddmodal">Thêm chu kỳ vào bộ nhớ tạm</button>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}

export default AdminAddProduct;