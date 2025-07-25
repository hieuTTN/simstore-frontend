import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {postMethod, postMethodPayload, postMethodTextPlan} from '../../services/request'
import Swal from 'sweetalert2'

async function actionDLMK(event) {
     event.preventDefault();
    var password = document.getElementById("password").value
    var repassword = document.getElementById("repassword").value
    if(password != repassword){
        toast.warning("Mật khẩu không trùng khớp");
        return;
    }
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = uls.searchParams.get("key");
    const res = await postMethod('/api/user/public/dat-lai-mat-khau?email=' + email+'&key='+key+'&password='+password)
    if (res.status < 300) {
         Swal.fire({
            title: "Thông báo",
            text:"Đặt lại mật khẩu thành công",
            preConfirm: () => {
                window.location.replace("login")
            }
        });
    }
    if (res.status == 417) {
        var result = await res.json()
        toast.warning(result.defaultMessage);
    }
}

function DatLaiMatKhau(){

    return(
    <div class="content contentlogin" style={{backgroundImage:'url(image/bg_login.webp)'}}>
       <div class="loginform col-lg-7 col-md-7 col-sm-12 col-12">
            <br/><br/>
            <p class="plogintl"><span class="dangtl">ĐẶT LẠI </span><span class="kytl">MẬT KHẨU</span></p>
            <form onSubmit={actionDLMK} autocomplete="off" class="inputloginform">
                <input type="password" class="inputform" id="password" placeholder="Nhập mật khẩu mới" autocomplete="off"/>
                <input type="password" class="inputform" id="repassword" placeholder="Nhập lại mật khẩu" autocomplete="off"/>
                <button type="button" class="btnhuylogin" onclick="window.location.href='login'">HỦY</button>
                <button type="submit" class="btntt">XÁC NHẬN</button>
            </form>
        </div>
    </div>
    );
}
export default DatLaiMatKhau;