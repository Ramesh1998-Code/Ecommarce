import React from 'react'
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import logo from "../image/logo.png";
import { useLocation } from "react-router-dom";

function Success() {

  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (sessionId) {
      fetch(`http://localhost:5000/session/${sessionId}`)
        .then(res => res.json())
        .then(data => setSession(data));
    }
  }, [location]);

  // ✅ Attractive Invoice PDF Function
  const generatePDF = async () => {

    if (!session) return;

    const doc = new jsPDF();
    const primaryColor = [41, 128, 185];

    // Header background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    // Logo
    doc.addImage(logo, "PNG", 15, 10, 30, 20);

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("My Company Pvt Ltd", 55, 22);

    doc.setFontSize(12);
    doc.text("INVOICE", 170, 22);

    doc.setTextColor(0, 0, 0);

    // Invoice Info
    doc.setFontSize(11);
    doc.text(`Invoice ID: ${session.id}`, 15, 55);
    doc.text(`Customer Email: ${session.customer_details?.email}`, 15, 63);
    doc.text(`Payment Status: ${session.payment_status}`, 15, 71);

    const paymentDate = new Date(session.created * 1000);
    doc.text(`Date: ${paymentDate.toLocaleDateString()}`, 150, 63);

    // Table Data
    const tableData = session.line_items?.data.map(item => [
      item.description,
      item.quantity,
     `INR ${(item.price.unit_amount / 100).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Product", "Qty", "Price"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255
      },
      styles: {
        fontSize: 10
      }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(
      `Total Amount Paid: INR ${(session.amount_total / 100).toFixed(2)}`,
      140,
      finalY
    );

    doc.line(15, finalY + 10, 195, finalY + 10);

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 75, finalY + 20);

    doc.save(`Invoice-${session.id}.pdf`);
    const pdfBase64 = doc.output("datauristring");

    await fetch("http://localhost:5000/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.customer_details?.email,
      pdf: pdfBase64,
    }),
  });

  alert("Email sent successfully!");
 
  };

  return (
    <div className='mt-4 text-center'>
      <h2>Payment Successful 🎉</h2>

      {session && (
        <div>
          <h4>Customer Info</h4>
          <p>Email: {session.customer_details?.email}</p>
          <p>Name: {session.customer_details?.name}</p>

          <h4>Payment Info</h4>
          <p>Amount Paid: ₹{session.amount_total / 100}</p>
          <p>Status: {session.payment_status}</p>

          <h4>Products</h4>
          <ul style={{ listStyle: "none" }}>
            {session.line_items?.data.map(item => (
              <li key={item.id}>
                {item.description} × {item.quantity}
              </li>
            ))}
          </ul>

         
          <button
            onClick={generatePDF}
            style={{
              padding: "10px 20px",
              background: "#2980b9",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            Download Invoice PDF
          </button>

        </div>
      )}
    </div>
  );
}

export default Success;
