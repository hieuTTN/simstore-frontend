import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';

var size = 6
var url = '';
function TinTuc(){
    const [itemBlog, setItemBlog] = useState([]);
    const [primaryBlog, setprimaryBlog] = useState(null);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        const getBlog = async() =>{
            var response = await getMethod('/api/blog/public/findAll-page?size='+size+'&page=0&sort=id,desc');
            var result = await response.json();
            setItemBlog(result.content)
            setpageCount(result.totalPages)
            url = '/api/blog/public/findAll-page?size='+size+'&sort=id,desc&page='
        };
        getBlog();
    }, []);

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItemBlog(result.content)
        setpageCount(result.totalPages)
      }

    const handleClick = (id) => {
        window.location.href = `blogdetail?id=${id}`;
    };
    return(
        <>
        <main>
      <div className="container tin-tuc">
        <div className="news-header">
          <h1>VỀ CHÚNG TÔI</h1>
          <p>Hành trình kết nối tại Việt Nam hoàn hảo cùng HITC Travel</p>
        </div>

        <div className="grid" id="listblog">
            {itemBlog.map((blog=>{
                return <div className="card pointer" onClick={()=>handleClick(blog.id)}>
                    <img src={blog.imageBanner} className="imgblog" alt={blog.title} />
                    <h2 className="titleblog">{blog.title}</h2>
                    <p className="descriptionblog">{blog.description}</p>
                </div>
            }))}
        </div><br/><br/>
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
    </main>
        </>
    );
}
export default TinTuc;