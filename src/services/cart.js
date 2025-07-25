import {getMethod,getMethodPostByToken} from '../services/request'

var token = localStorage.getItem("token");
async function countCartHeader() {
    const response = await fetch('http://localhost:8080/api/cart/user/count-cart', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response
}

 async function loadCartMenu() {
    if(token == null){
        return;
    }
    const response = await getMethod('/api/cart/user/count-cart');
    if(response.status > 300){
        return;
    }
    var count = await response.text();
    document.getElementById("soluongcartmenu").innerText = count;
}

export {countCartHeader,loadCartMenu}