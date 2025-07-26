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
        "primaryBlog": document.getElementById("primaryBlog").checked
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


var linkbanner = '';
const AdminAddCategory = ()=>{
    const [category, setCategory] = useState(null);
    useEffect(()=>{
        const getById = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/category/admin/findById?id='+id)
                var result = await response.json();
                document.getElementById("simType").value = result.simType;
                setCategory(result)
            }
        };
        getById();
    }, []);


    async function saveCategory() {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var obj = {
            "id": id,
            "name": document.getElementById("catename").value,
            "simType": document.getElementById("simType").value,
        };
        const response = await postMethodPayload('/api/category/admin/create',obj)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thành công!",
                preConfirm: () => {
                    window.location.href = 'category'
                }
            });
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
         <div class="col-sm-12 header-sps">
            <div class="title-add-admin">
                <h4>Thêm/ cập nhật danh mục</h4>
            </div>
        </div>
        <div class="col-sm-12">
            <main class="main row">
            <div class="col-sm-5">
                    <label class="lb-form">Tên danh mục</label>
                    <input defaultValue={category?.name} id="catename" type="text" class="form-control"/>
                    <label class="lb-form">Loại sim</label>
                    <select id="simType" class="form-select">
                        <option value="SIM_MANG">Sim mạng</option>
                        <option value="SIM_SO_DEP">Sim số đẹp</option>
                    </select><br/><br/>
                    <button onClick={()=>saveCategory()} class="btn btn-success form-control action-btn">Thêm/ Cập nhật danh mục</button>
                </div>
            </main>
        </div>
        </>
    );
}

export default AdminAddCategory;