import Headers from "../header/header";
import Footer from "../footer/footer"

function DefaultLayout({children}){
    return (
        <>
            <Headers/>
            {children}
            <Footer/>
        </>
    );
}

export default DefaultLayout;