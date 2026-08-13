import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';


const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ALL_SLOTS = [
  { time: "6:00 AM – 9:00 AM",   type: "free",       label: "Free",    fee: "Free" },
  { time: "9:00 AM – 12:00 PM",  type: "free",       label: "Free",    fee: "Free" },
  { time: "12:00 PM – 3:00 PM",  type: "express",    label: "Express", fee: "₹49"  },
  { time: "3:00 PM – 6:00 PM",   type: "free",       label: "Free",    fee: "Free" },
  { time: "6:00 PM – 9:00 PM",   type: "express",    label: "Express", fee: "₹49"  },
  { time: "9:00 PM – 11:00 PM",  type: "unavailable",label: "Full",    fee: "—"    },
];



// Simulate some slots being sold out on specific day offsets
const UNAVAILABLE_BY_OFFSET = {
  0: [0, 1, 2, 3, 4, 5], // today — all blocked (same-day disabled)
  1: [5],
  3: [2, 5],
};

function generateDates(count = 8) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { date: d, offset: i };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateCard({ dateObj, offset, selected, onSelect,confirm }) {
const confirmDate =
  confirm && typeof confirm === "string"
    ? parseInt(confirm.split(", ")[1].split(" ")[0])
    : null;

  
  
  const isToday = offset === 0;
 const isBooked = confirmDate === dateObj.getDate();
  return (
    <button
      disabled={isToday}
      onClick={() => onSelect(offset, dateObj)}
      style={{
        flex: "0 0 72px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 8px",
        borderRadius: 8,
        border: selected ? "2px solid #1D9E75" : "0.5px solid #e0e0e0",
        background: selected ? "#E1F5EE" : "#fff",
        cursor: isToday ? "not-allowed" : "pointer",
        opacity: isToday ? 0.4 : 1,
        transition: "all 0.15s",
        outline: "none",
      }}
      className={`${isBooked? "border-red" : ""}`}
    >
      <span style={{ fontSize: 11, color: selected ? "#0F6E56" : "#888", marginBottom: 4 }}>
        {DAYS[dateObj.getDay()]}
      </span>
      <span style={{ fontSize: 20, fontWeight: 500, color: selected ? "#0F6E56" : "#111" }}>
        {dateObj.getDate()}
      </span>
      <span style={{ fontSize: 10, color: selected ? "#0F6E56" : "#aaa", marginTop: 2 }}>
        {MONTHS[dateObj.getMonth()]}
      </span>
      {
        isBooked && (
            <span style={{ fontSize: 10, color: selected ? "#0F6E56" : "#aaa", marginTop: 2 }}>
              Booked
            </span>
        )
      }
       
    </button>
  );
}

function SlotBadge({ type }) {
  const styles = {
    free:        { background: "#E1F5EE", color: "#0F6E56" },
    express:     { background: "#FAEEDA", color: "#854F0B" },
    unavailable: { background: "#f3f3f3", color: "#999" },
  };
  const labels = { free: "Free", express: "Express", unavailable: "Full" };
  const s = styles[type] || styles.unavailable;
  return (
    <span style={{
      display: "inline-block",
      marginTop: 6,
      fontSize: 11,
      padding: "2px 10px",
      borderRadius: 99,
      fontWeight: 500,
      ...s,
    }}>
      {labels[type]}
    </span>
  );
}

function SlotCard({ slot, index, unavailable, selected, onSelect }) {
  const isBlocked = unavailable || slot.type === "unavailable";
  return (
    <button
      disabled={isBlocked}
      onClick={() => onSelect(index, slot)}
      style={{
        padding: "12px 14px",
        borderRadius: 8,
        border: selected ? "2px solid #1D9E75" : "0.5px solid #e0e0e0",
        background: selected ? "#E1F5EE" : "#fff",
        cursor: isBlocked ? "not-allowed" : "pointer",
        opacity: isBlocked ? 0.45 : 1,
        textAlign: "left",
        transition: "all 0.15s",
        outline: "none",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: selected ? "#0F6E56" : "#111" }}>
        {slot.time}
      </div>
      <SlotBadge type={isBlocked && slot.type !== "unavailable" ? "unavailable" : slot.type} />
    </button>
  );
}

function SummaryCard({ dateObj, slot, onConfirm, address = "123 Main Street, Delhi" }) {
  if (!dateObj || !slot) return null;
  const dateStr = `${DAYS[dateObj.getDay()]}, ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]}`;
  const rows = [
    { label: "Delivery date", value: dateStr },
    { label: "Time window",   value: slot.time },
    { label: "Delivery fee",  value: slot.fee },
    { label: "Address",       value: address },
  ];
  return (
    <div style={{
      marginTop: 24,
      background: "#fff",
      border: "0.5px solid #e0e0e0",
      borderRadius: 12,
      padding: "20px",
    }}>
      {rows.map((r) => (
        <div key={r.label} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: "0.5px solid #f0f0f0",
          fontSize: 14,
        }}>
          <span style={{ color: "#888" }}>{r.label}</span>
          <span style={{ fontWeight: 500, color: "#111" }}>{r.value}</span>
        </div>
      ))}
      <button
        onClick={onConfirm}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "13px",
          borderRadius: 8,
          background: "#1D9E75",
          color: "#fff",
          fontSize: 15,
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.target.style.background = "#0F6E56")}
        onMouseLeave={e => (e.target.style.background = "#1D9E75")}
      >
        Confirm delivery slot
      </button>
    </div>
  );
}

function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "#E1F5EE",
      border: "0.5px solid #5DCAA5",
      borderRadius: 8,
      padding: "12px 16px",
      marginTop: 16,
      fontSize: 14,
      color: "#0F6E56",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: "#1D9E75",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
          <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );
}


const Addslot = (message) => toast(message, {
    theme: "dark",
});


// ─── Main Component ───────────────────────────────────────────────────────────

export default function DeliverySlotBooking({
  
  onBookingConfirmed,
  location,
  address = location? location : "Please Select Address",
}) {
  const dates = generateDates(8);
  const [selectedOffset, setSelectedOffset] = useState(null);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
//   const [toast, setToast] = useState({ visible: false, message: "" });

  const unavailableSlots = selectedOffset !== null  
    ? UNAVAILABLE_BY_OFFSET[selectedOffset] || []
    : [];

  function handleDateSelect(offset, dateObj) {
    setSelectedOffset(offset);
    setSelectedDateObj(dateObj);
    setSelectedSlotIdx(null);
    setSelectedSlot(null);
    // setToast({ visible: false, message: "" });
  }

  function handleSlotSelect(idx, slot) {
    setSelectedSlotIdx(idx);
    setSelectedSlot(slot);
    // setToast({ visible: false, message: "" });
    slotConfirm(idx)
  }


  

const[confirm,slotConfirm] = useState(null);
  function handleConfirm() {
    const dateStr = `${DAYS[selectedDateObj.getDay()]}, ${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()]}`;
    

    
    const booking = { date: dateStr, slot: selectedSlot, address };
    // setToast({ visible: true, message: `Delivery booked for ${dateStr}, ${selectedSlot.time}` });
    setSelectedOffset(null);
    setSelectedDateObj(null);
    setSelectedSlotIdx(null);
    setSelectedSlot(null);
    slotConfirm(dateStr)
    Addslot( `Delivery booked for ${dateStr}, ${selectedSlot.time}`)


    if (onBookingConfirmed) onBookingConfirmed(booking);
  }
  
   


  return (
    <div style={{ maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>

      {/* Date strip */}
      <p style={labelStyle}>Choose delivery date</p>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {dates.map(({ date, offset }) => (
          <DateCard
            key={offset}
            dateObj={date}
            offset={offset}
            selected={selectedOffset === offset}
            onSelect={handleDateSelect}
            confirm={confirm}


          />
        ))}
      </div>

      <hr style={{ margin: "24px 0", border: "none", borderTop: "0.5px solid #e0e0e0" }} />

      {/* Slots */}
      <p style={labelStyle}>
        {selectedDateObj
          ? `Available slots — ${DAYS[selectedDateObj.getDay()]}, ${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()]}`
          : "Select a date to see available slots"}
      </p>

      {selectedDateObj && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {ALL_SLOTS.map((slot, i) => (
            <SlotCard
              key={i}
              slot={slot}
              index={i}
              unavailable={unavailableSlots.includes(i)}
              selected={selectedSlotIdx === i}
              onSelect={handleSlotSelect}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {selectedSlot && (
        <SummaryCard
          dateObj={selectedDateObj}
          slot={selectedSlot}
          onConfirm={handleConfirm}
          address={address}

        />
      )}

      {/* Toast */}
      {/* <Toast visible={toast.visible} message={toast.message} /> */}
          <ToastContainer theme="light" />
    </div>
  );
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 12,
};