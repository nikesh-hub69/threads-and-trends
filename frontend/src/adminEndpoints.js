// src/adminEndpoints.js
export const ADMIN_ENDPOINTS = {
  // Orders
  ordersList: "/api/orders/admin/orders/",
  orderStatus: (orderId) => `/api/orders/admin/orders/${orderId}/status/`,
  orderDetail: (orderId) => `/api/orders/admin/orders/${orderId}/`,

  // ✅ NEW: Return Requests
  returnsList: "/api/orders/admin/return-requests/",
  returnDetail: (returnId) => `/api/orders/admin/return-requests/${returnId}/status/`,
  returnStatusUpdate: (returnId) => `/api/orders/admin/return-requests/${returnId}/status/`,

  // Stock management
  adminProducts: "/api/catalog/admin/products/",
  adminProductDetail: (id) => `/api/catalog/admin/products/${id}/`,
  adminProductUpdate: (id) => `/api/catalog/admin/products/${id}/update/`,
  adminVariantUpdate: (id) => `/api/catalog/admin/variants/${id}/update/`,
};