import layoutAdmin from '../layout/admin/Layout'
import layoutLogin from '../layout/user/loginlayout/login'
import CheckoutLayout from '../layout/user/checkout/checkouLayout'
import 'bootstrap/dist/css/bootstrap.min.css';
//admin
import AdminIndex from '../pages/admin/index'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminCategory from '../pages/admin/category'
import AdminAddCategory from '../pages/admin/addcategory'
import AdminProduct from '../pages/admin/product'
import AdminAddProduct from '../pages/admin/addproduct'
import AdminVoucher from '../pages/admin/voucher'
import AdminAddVoucher from '../pages/admin/addvoucher'
import AdminImport from '../pages/admin/importproduct'
import AdminAddImport from '../pages/admin/addimportproduct'
import AdminInvoice from '../pages/admin/invoice'
import AdminBanner from '../pages/admin/banner'
import AdminUser from '../pages/admin/user'


//public
import login from '../pages/public/login'
import index from '../pages/public/index'
import regis from '../pages/public/regis'
import Confirm from '../pages/public/confirm'
import Forgot from '../pages/public/forgot'
import BlogDetail from '../pages/public/blogdetail'
import Account from '../pages/public/account'
import PublicPayment from '../pages/public/payment'
import HoTro from '../pages/public/hotro'
import TinTuc from '../pages/public/tintuc'
import SimSoDep from '../pages/public/simsodep'
import SimData from '../pages/public/simdata'
import GioHang from '../pages/public/giohang'
import ThanhToan from '../pages/public/thanhtoan'
import DatLaiMatKhau from '../pages/public/datlaimatkhau'

const publicRoutes = [
    { path: "/", component: index},
    { path: "/index", component: index},
    { path: "/login", component: login, layout:layoutLogin},
    { path: "/regis", component: regis, layout:layoutLogin},
    { path: "/confirm", component: Confirm},
    { path: "/forgot", component: Forgot, layout:layoutLogin},
    { path: "/blogdetail", component: BlogDetail},
    { path: "/account", component: Account},
    { path: "/payment", component: PublicPayment},
    { path: "/hotro", component: HoTro},
    { path: "/tintuc", component: TinTuc},
    { path: "/simsodep", component: SimSoDep},
    { path: "/simsieudata", component: SimData},
    { path: "/giohang", component: GioHang},
    { path: "/thanhtoan", component: ThanhToan},
    { path: "/datlaimatkhau", component: DatLaiMatKhau},
];


const adminRoutes = [
    { path: "/admin/index", component: AdminIndex, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/add-blog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCategory, layout: layoutAdmin },
    { path: "/admin/add-category", component: AdminAddCategory, layout: layoutAdmin },
    { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    { path: "/admin/add-product", component: AdminAddProduct, layout: layoutAdmin },
    { path: "/admin/voucher", component: AdminVoucher, layout: layoutAdmin },
    { path: "/admin/add-voucher", component: AdminAddVoucher, layout: layoutAdmin },
    { path: "/admin/importproduct", component: AdminImport, layout: layoutAdmin },
    { path: "/admin/add-importproduct", component: AdminAddImport, layout: layoutAdmin },
    { path: "/admin/don-hang", component: AdminInvoice, layout: layoutAdmin },
    { path: "/admin/banner", component: AdminBanner, layout: layoutAdmin },
    { path: "/admin/user", component: AdminUser, layout: layoutAdmin },
];



export { publicRoutes, adminRoutes};
