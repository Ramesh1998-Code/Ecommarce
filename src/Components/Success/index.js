import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../image/Tmarket-logo.png";
import { useLocation, Link } from "react-router-dom";
import DeliveryPartnerControls from "../DeliveryPartnerControls";
import LiveTrackingMap from "../LiveTrackingMap";
import { startDummyDelivery } from "../simulateDelivery";
import { ToastContainer, toast } from "react-toastify";

function Success() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const location = useLocation();
  const simulationRef = useRef(null);
  const [myLocation, setMyLocation] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (sessionId) {
      setLoadingSession(true);
      fetch(`http://localhost:5000/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data);
          setLoadingSession(false);
        })
        .catch((err) => {
          console.error("Session error:", err);
          setLoadingSession(false);
        });
    } else {
      setLoadingSession(false);
    }
  }, [location]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (session?.orderId && myLocation && !simulationRef.current) {
      simulationRef.current = startDummyDelivery(session.orderId, myLocation);
    }
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [session, myLocation]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const generatePDF = async () => {
    if (!session) return;
    setGeneratingPDF(true);

    try {
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
      doc.text(`Customer Email: ${session.customer_details?.email || "N/A"}`, 15, 63);
      doc.text(`Payment Status: ${session.payment_status}`, 15, 71);

      const paymentDate = session.created ? new Date(session.created * 1000) : new Date();
      doc.text(`Date: ${paymentDate.toLocaleDateString()}`, 150, 63);

      // Table Data
      const tableData = session.line_items?.data.map((item) => [
        item.description,
        item.quantity,
        `INR ${(item.price.unit_amount / 100).toFixed(2)}`,
      ]) || [];

      autoTable(doc, {
        startY: 80,
        head: [["Product", "Qty", "Price"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
        },
        styles: {
          fontSize: 10,
        },
      });

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;

      doc.setFontSize(12);
      doc.text(
        `Total Amount Paid: INR ${((session.amount_total || 0) / 100).toFixed(2)}`,
        140,
        finalY
      );

      doc.line(15, finalY + 10, 195, finalY + 10);

      doc.setFontSize(10);
      doc.text("Thank you for your purchase!", 75, finalY + 20);

      doc.save(`Invoice-${session.id}.pdf`);
      const pdfBase64 = doc.output("datauristring");

      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.customer_details?.email,
          pdf: pdfBase64,
        }),
      });

      if (response.ok) {
        toast.success("Invoice generated & sent to your email!", { theme: "colored" });
      } else {
        toast.warning("Invoice downloaded, but email dispatch failed.", { theme: "colored" });
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      toast.error("Failed to send invoice email.", { theme: "colored" });
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-5">
        <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-secondary fw-semibold">Fetching your order confirmation...</h5>
      </div>
    );
  }

  return (
    <div className="gradient-custom min-vh-100 py-5 bg-light">
      <ToastContainer />
      <div className="container max-w-6xl">
        
        {/* Banner Section */}
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4 text-center position-relative overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 bg-success opacity-10" style={{ height: "6px" }}></div>
          
          <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3 shadow" style={{ width: "80px", height: "80px", fontSize: "2.5rem" }}>
            <i className="fa-solid fa-check"></i>
          </div>

          <h1 className="fw-bold text-dark mb-2">Payment Successful! 🎉</h1>
          <p className="text-muted fs-6 mb-3 max-w-md mx-auto">
            Thank you for your order. We have received your payment and are preparing your items for delivery.
          </p>

          {session?.orderId && (
            <div className="d-inline-flex align-items-center gap-2 bg-light border rounded-pill px-3 py-1 text-secondary small fw-medium">
              <span>Order ID:</span>
              <strong className="text-dark">#{session.orderId}</strong>
            </div>
          )}
        </div>

        {session ? (
          <div className="row g-4">
            
            {/* Left Column: Order Summary & Customer Info */}
            <div className="col-lg-6">
              
              {/* Payment & Customer Card */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                  <h5 className="fw-bold m-0 text-dark">
                    <i className="fa-solid fa-receipt text-primary me-2"></i> Order Overview
                  </h5>
                  <span className={`badge ${session.payment_status === 'paid' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'} rounded-pill px-3 py-2 text-capitalize fs-7`}>
                    <i className="fa-solid fa-circle-check me-1"></i> {session.payment_status}
                  </span>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <span className="text-muted d-block small mb-1">Customer Name</span>
                      <strong className="text-dark d-block text-truncate">
                        {session.customer_details?.name || "Guest Customer"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <span className="text-muted d-block small mb-1">Email Address</span>
                      <strong className="text-dark d-block text-truncate">
                        {session.customer_details?.email || "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-primary-emphasis d-block small fw-semibold">Total Amount Paid</span>
                        <h3 className="fw-bold text-primary m-0">₹{(session.amount_total / 100).toFixed(2)}</h3>
                      </div>
                      <div className="p-3 bg-white rounded-circle text-primary shadow-sm">
                        <i className="fa-solid fa-credit-card fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Card */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <h5 className="fw-bold mb-3 text-dark d-flex align-items-center justify-content-between">
                  <span>
                    <i className="fa-solid fa-box-open text-primary me-2"></i> Items Purchased
                  </span>
                  <span className="badge bg-secondary rounded-pill fw-normal fs-7">
                    {session.line_items?.data?.length || 0} Items
                  </span>
                </h5>

                <div className="list-group list-group-flush border-top">
                  {session.line_items?.data?.map((item) => (
                    <div key={item.id} className="list-group-item px-0 py-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-light rounded-3 text-secondary">
                          <i className="fa-solid fa-bag-shopping fs-5"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold text-dark">{item.description}</h6>
                          <small className="text-muted">Quantity: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <strong className="text-dark d-block">
                          ₹{(item.price?.unit_amount / 100).toFixed(2)}
                        </strong>
                        <small className="text-muted">
                          Total: ₹{((item.price?.unit_amount * item.quantity) / 100).toFixed(2)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-4 shadow-sm border p-4 d-flex flex-column flex-sm-row gap-3">
                <button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="btn btn-primary btn-lg rounded-pill fw-semibold flex-fill d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {generatingPDF ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-file-arrow-down"></i>
                      Download & Email Invoice
                    </>
                  )}
                </button>

                <Link to="/" className="btn btn-outline-secondary btn-lg rounded-pill fw-semibold flex-fill d-flex align-items-center justify-content-center gap-2">
                  <i className="fa-solid fa-arrow-left"></i>
                  Continue Shopping
                </Link>
              </div>

            </div>

            {/* Right Column: Order Delivery & Live Tracking Map */}
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-sm border p-4 h-100 d-flex flex-column">
                
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <div>
                    <h5 className="fw-bold text-dark m-0">
                      <i className="fa-solid fa-map-location-dot text-danger me-2"></i> Live Delivery Tracking
                    </h5>
                    <small className="text-muted">Real-time status updates of your package</small>
                  </div>
                  <span className="badge bg-danger-subtle text-danger border border-danger rounded-pill px-3 py-1 animate-pulse">
                    ● Live
                  </span>
                </div>

                <div className="mb-3">
                  <DeliveryPartnerControls orderId={session?.orderId} />
                </div>

                <div className="flex-grow-1 rounded-3 overflow-hidden border position-relative" style={{ minHeight: "420px" }}>
                  <LiveTrackingMap orderId={session?.orderId} destination={myLocation} />
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-4 shadow-sm border p-5 text-center my-4">
            <i className="fa-solid fa-circle-exclamation text-warning display-4 mb-3"></i>
            <h4 className="fw-bold text-dark">Order Session Details Unavailable</h4>
            <p className="text-secondary small mb-4">
              We couldn't retrieve session details for this order. If you completed a purchase, check your email for confirmation.
            </p>
            <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
              Return to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Success;
