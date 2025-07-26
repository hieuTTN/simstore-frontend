import React, { useEffect, useState, useRef } from 'react';

const formatMoney = (money) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);

const InvoicePrint = () => {
  const [items, setItems] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [total, setTotal] = useState(0);
  const invoiceRef = useRef();

  useEffect(() => {
    loadDetailInvoicePrint();
  }, []);

  const loadDetailInvoicePrint = async () => {
    const uls = new URL(window.location.href);
    const id = uls.searchParams.get("id");
    const token = localStorage.getItem("token"); // Hoặc dùng hook tùy bạn quản lý auth

    // 1. Lấy danh sách sản phẩm trong hóa đơn
    const urlDetail = `http://localhost:8080/api/invoice-detail/admin/find-by-invoice?idInvoice=${id}`;
    const res = await fetch(urlDetail, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    const list = await res.json();

    // Tính tổng tiền tạm
    let tongTienTam = 0;
    list.forEach(item => {
      tongTienTam += item.price * item.quantity;
    });

    setItems(list);
    setTotal(tongTienTam);

    // 2. Lấy thông tin chung hóa đơn
    const urlInfo = `http://localhost:8080/api/invoice/admin/find-by-id?idInvoice=${id}`;
    const resp = await fetch(urlInfo, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    const result = await resp.json();

    // Gộp thông tin lại
    setInvoiceInfo({
      id: result.id,
      createdDate: result.createdDate,
      voucher: result.voucher,
      receiverName: result.receiverName
    });
  };

  const printInvoice = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Invoice</title>');
    printWindow.document.write(`<style>${document.getElementById('invoice-style').innerHTML}</style>`);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!invoiceInfo) return <p>Đang tải hóa đơn...</p>;

  const discount = invoiceInfo.voucher?.discount || 0;
  const totalAfterDiscount = total - discount;

  return (
    <>
      <style id="invoice-style">{`
        body {
          font-family: Arial, sans-serif;
        }
        .invoice-container {
          max-width: 800px;
          margin: auto;
          border: 1px solid #ddd;
          padding: 20px;
        }
        .header {
          text-align: center;
        }
        .header h1 {
          color: red;
          margin-bottom: 5px;
        }
        .header h2 {
          font-size: 16px;
          margin-top: 0;
        }
        .shop-info table, .customer-info table {
          width: 100%;
          font-size: 14px;
        }
        .shop-info td {
          padding: 5px 0;
        }
        table.items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        table.items th, table.items td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        table.items th {
          background-color: #f2f2f2;
        }
        .totals {
          margin-top: 20px;
          font-size: 14px;
        }
        .totals .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signatures div span {
          margin-top: 20px;
          font-weight: bold;
        }
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .print-button:hover {
          background-color: #45a049;
        }
      `}</style>

      <div className="invoice-container" ref={invoiceRef}>
        <div className="header">
          <h1>HÓA ĐƠN MUA HÀNG</h1>
          <h2>VAT INVOICE</h2>
        </div>

        <div className="shop-info">
          <table>
            <tbody>
              <tr>
                <td><strong>Cửa Hàng:</strong> BeeStyle</td>
                <td><strong>Mẫu số:</strong> 01GTKTO/001</td>
              </tr>
              <tr>
                <td><strong>Mã số thuế:</strong> 0101243150</td>
                <td><strong>Ký hiệu:</strong> TS/20E</td>
              </tr>
              <tr>
                <td><strong>Địa chỉ:</strong> Số 1, Phố Trịnh Văn Bô, P. Phương Canh, Q. Nam Từ Liêm, Hà Nội</td>
                <td><strong>Mã hóa đơn:</strong> #{invoiceInfo.id}</td>
              </tr>
              <tr>
                <td><strong>Điện thoại:</strong> 0398525912</td>
                <td><strong>Ngày tạo:</strong> {invoiceInfo.createdDate}</td>
              </tr>
              <tr>
                <td><strong>Số tài khoản:</strong> 0398525912 tại Ngân hàng MB Bank</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <table className="items">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên gói/sim</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.size.product.name}: {item.size.name}</td>
                <td>{item.quantity}</td>
                <td>{formatMoney(item.price)}</td>
                <td>{formatMoney(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <div className="row">
            <span>Cộng tiền hàng:</span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="row">
            <span>Giảm giá:</span>
            <span>{discount > 0 ? '- ' + formatMoney(discount) : '0đ'}</span>
          </div>
          <div className="row">
            <strong>Tiền thanh toán:</strong>
            <strong>{formatMoney(totalAfterDiscount)}</strong>
          </div>
        </div>

        <div className="signatures">
          <div></div>
          <div>
            {invoiceInfo.receiverName && (
              <>
                <p>Khách Hàng</p>
                <span>{invoiceInfo.receiverName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <button className="print-button" onClick={printInvoice}>In Đơn Hàng</button>
    </>
  );
};

export default InvoicePrint;
