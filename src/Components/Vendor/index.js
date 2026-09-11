import React, { useState } from 'react';
import { Button, Modal, Form, Badge } from 'react-bootstrap';

function Vendor() {
    const [vendors, setVendors] = useState([
        { id: 1, name: "Niraj Sharma", email: "niraj123@gmail.com", phone: "8770238861", category: "Electronics", status: "Active" },
        { id: 2, name: "Pankaj Kumar", email: "pankajaj321@gmail.com", phone: "8989897890", category: "Packaging", status: "Active" },
        { id: 3, name: "Amit Verma", email: "amit1021@gmail.com", phone: "9019930321", category: "Logistics", status: "Pending" }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingVendorId, setEditingVendorId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        category: "General Supplies",
        status: "Active"
    });

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendorId(vendor.id);
            setFormData({
                name: vendor.name,
                email: vendor.email,
                phone: vendor.phone,
                category: vendor.category || "General Supplies",
                status: vendor.status || "Active"
            });
        } else {
            setEditingVendorId(null);
            setFormData({
                name: "",
                email: "",
                phone: "",
                category: "General Supplies",
                status: "Active"
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVendorId(null);
    };

    const handleSaveVendor = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) return;

        if (editingVendorId) {
            setVendors(vendors.map(v => v.id === editingVendorId ? { ...v, ...formData } : v));
        } else {
            const newEntry = {
                id: Date.now(),
                ...formData
            };
            setVendors([newEntry, ...vendors]);
        }

        handleCloseModal();
    };

    const handleDeleteVendor = (id) => {
        if (window.confirm("Are you sure you want to remove this vendor?")) {
            setVendors(vendors.filter(v => v.id !== id));
        }
    };

    const filteredVendors = vendors.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.toString().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        if (!name) return "V";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="gradient-custom min-vh-100 py-5 bg-light">
            <div className="container max-w-6xl">

                {/* Header Section */}
                <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-primary-subtle text-primary rounded-pill small fw-semibold mb-2">
                                <i className="fa-solid fa-truck-field"></i> Supplier Directory
                            </div>
                            <h2 className="fw-bold text-dark m-0">Vendor Management</h2>
                            <p className="text-muted small m-0 mt-1">
                                Maintain and monitor your supplier list, contact information, and active vendor operations.
                            </p>
                        </div>

                        <Button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary rounded-pill px-4 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        >
                            <i className="fa-solid fa-plus"></i> Add New Vendor
                        </Button>
                    </div>

                    {/* Quick Metrics */}
                    <div className="row g-3 mt-4 pt-3 border-top">
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-light rounded-3">
                                <span className="text-muted d-block small">Total Vendors</span>
                                <h4 className="fw-bold text-dark m-0">{vendors.length}</h4>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-success-subtle rounded-3">
                                <span className="text-success-emphasis d-block small">Active Partners</span>
                                <h4 className="fw-bold text-success m-0">
                                    {vendors.filter(v => v.status === "Active").length}
                                </h4>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-warning-subtle rounded-3">
                                <span className="text-warning-emphasis d-block small">Pending Review</span>
                                <h4 className="fw-bold text-warning m-0">
                                    {vendors.filter(v => v.status === "Pending").length}
                                </h4>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-indigo-subtle rounded-3 text-indigo">
                                <span className="text-indigo d-block small">Categories</span>
                                <h4 className="fw-bold m-0">
                                    {new Set(vendors.map(v => v.category)).size}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Main Table Card */}
                <div className="bg-white rounded-4 shadow-sm border p-4">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
                        <div className="position-relative flex-grow-1 max-w-md">
                            <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input
                                type="text"
                                className="form-control rounded-pill ps-5 py-2"
                                placeholder="Search vendors by name, email, phone or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="btn btn-sm btn-link text-secondary position-absolute top-50 end-0 translate-middle-y me-2 text-decoration-none"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>

                        <div className="text-muted small">
                            Showing <strong>{filteredVendors.length}</strong> of <strong>{vendors.length}</strong> vendors
                        </div>
                    </div>

                    {/* Vendors Table */}
                    <div className="table-responsive rounded-3 border">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="ps-4 py-3">Vendor Name</th>
                                    <th scope="col" className="py-3">Contact Email</th>
                                    <th scope="col" className="py-3">Phone Number</th>
                                    <th scope="col" className="py-3">Category</th>
                                    <th scope="col" className="py-3">Status</th>
                                    <th scope="col" className="text-end pe-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.length > 0 ? (
                                    filteredVendors.map((item) => (
                                        <tr key={item.id}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", fontSize: "0.9rem" }}>
                                                        {getInitials(item.name)}
                                                    </div>
                                                    <div>
                                                        <strong className="text-dark d-block mb-0">{item.name}</strong>
                                                        <small className="text-muted">ID: #{item.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a href={`mailto:${item.email}`} className="text-decoration-none text-secondary hover-primary">
                                                    <i className="fa-regular fa-envelope me-1 text-primary"></i> {item.email}
                                                </a>
                                            </td>
                                            <td>
                                                <span className="text-dark">
                                                    <i className="fa-solid fa-phone me-1 text-muted small"></i> {item.phone}
                                                </span>
                                            </td>
                                            <td>
                                                <Badge bg="light" className="text-dark border px-3 py-1.5 rounded-pill fw-normal">
                                                    {item.category || "General"}
                                                </Badge>
                                            </td>
                                            <td>
                                                <span className={`badge ${item.status === 'Active' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'} rounded-pill px-3 py-1.5 text-capitalize`}>
                                                    ● {item.status || "Active"}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex align-items-center justify-content-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="btn btn-sm btn-outline-primary rounded-circle"
                                                        style={{ width: "34px", height: "34px", padding: 0 }}
                                                        title="Edit Vendor"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVendor(item.id)}
                                                        className="btn btn-sm btn-outline-danger rounded-circle"
                                                        style={{ width: "34px", height: "34px", padding: 0 }}
                                                        title="Delete Vendor"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="py-4">
                                                <i className="fa-solid fa-user-slash display-5 text-muted mb-3"></i>
                                                <h6 className="fw-bold text-dark">No Vendors Found</h6>
                                                <p className="text-muted small mb-3">
                                                    {searchTerm ? `No results matching "${searchTerm}"` : "Your vendor list is currently empty."}
                                                </p>
                                                {searchTerm && (
                                                    <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setSearchTerm("")}>
                                                        Clear Search Filter
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Add / Edit Vendor Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">
                        {editingVendorId ? "Edit Vendor Details" : "Add New Vendor"}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveVendor}>
                    <Modal.Body className="py-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Vendor Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Niraj Sharma"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="rounded-3"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="e.g. niraj@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="rounded-3"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="e.g. 9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="rounded-3"
                            />
                        </Form.Group>

                        <div className="row g-3">
                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-secondary">Category</Form.Label>
                                    <Form.Select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="rounded-3"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Packaging">Packaging</option>
                                        <option value="Logistics">Logistics</option>
                                        <option value="General Supplies">General Supplies</option>
                                        <option value="Raw Materials">Raw Materials</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-secondary">Status</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="rounded-3"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" className="rounded-pill px-4" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="rounded-pill px-4 fw-semibold">
                            {editingVendorId ? "Update Vendor" : "Save Vendor"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Vendor;