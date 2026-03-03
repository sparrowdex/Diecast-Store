"use client";

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registering fonts - ensure these match your actual public folder paths
Font.register({
  family: 'GeistMono',
  fonts: [
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 700 }, 
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 700, fontStyle: 'italic' },
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 900 },
    { src: '/fonts/GeistMono-Regular.ttf', fontWeight: 900, fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 45,
    paddingBottom: 120, 
    backgroundColor: '#ffffff',
    fontFamily: 'GeistMono',
    display: 'flex',
    flexDirection: 'column',
    color: 'black'
  },
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerLeft: { width: '65%' }, // Prevents collision with the right side
  headerRight: { width: '35%', alignItems: 'flex-end', paddingTop: 4 }, // Locked to top right
  title: { fontSize: 30, fontWeight: 900, fontStyle: 'italic', letterSpacing: -1.5 }, // Slightly reduced size
  subtitle: { fontSize: 8, color: '#9ca3af', letterSpacing: 4, marginTop: 4 },
  headerBadgeText: { fontSize: 9, color: '#9ca3af', letterSpacing: 3, fontWeight: 'bold' },
  headerDateText: { fontSize: 6, color: '#000', marginTop: 10, fontWeight: 'bold' },
  thickDivider: { borderTop: '8 solid black', width: '100%', marginBottom: 40 },

  // --- INFO GRID ---
  grid: { flexDirection: 'row', gap: 40, marginBottom: 50 },
  gridCol: { flex: 1 },
  label: { fontSize: 8, color: '#9ca3af', letterSpacing: 2, marginBottom: 6, fontWeight: 'bold' },
  value: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  valueGroup: { marginTop: 25 },

  // --- TABLE ---
  tableTitle: { fontSize: 10, letterSpacing: 4, marginBottom: 12, borderBottom: '1 solid #e5e7eb', paddingBottom: 6, fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #e5e7eb', paddingBottom: 10, marginBottom: 10 },
  tableRow: { flexDirection: 'row', paddingVertical: 12 },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  itemName: { fontSize: 11, fontWeight: 900, textTransform: 'uppercase' },
  itemMeta: { fontSize: 7, color: '#9ca3af', marginTop: 4, textTransform: 'uppercase' },
  
  // --- FINANCIALS ---
  financialWrapper: { marginTop: 40 },
  financialDivider: { borderTop: '6 solid black', marginBottom: 20 },
  financialRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  financialLabel: { width: 150, fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  financialValue: { width: 80, fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, alignItems: 'center' },
  // FIXED: Adjusted width, font size, and tracking so it fits on one line
  totalLabel: { width: 160, fontSize: 10, fontWeight: 'bold', letterSpacing: 2 }, 
  totalValue: { width: 100, fontSize: 28, fontWeight: 900, fontStyle: 'italic', textAlign: 'right', letterSpacing: -1 },

  // --- FOOTER (CONTACT & DISCLAIMER) ---
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    left: 45,
    width: '60%',
  },
  contactTitle: { color: '#dc2626', fontSize: 8, fontWeight: 900, letterSpacing: 3, marginBottom: 8 },
  contactText: { fontSize: 8, color: '#374151', marginBottom: 3, fontWeight: 'bold' },
  disclaimerLine: { borderLeft: '2 solid #e5e7eb', paddingLeft: 12, marginTop: 20 },
  disclaimerText: { fontSize: 6, color: '#4b5563', lineHeight: 1.6, letterSpacing: 1, fontWeight: 'bold' },

  // --- STAMP ---
  stampContainer: {
    position: 'absolute',
    bottom: 45,
    right: 35,
    transform: 'rotate(-12deg)',
    opacity: 0.9,
  },
  stampOuter: { border: '4 solid #dc2626', padding: 3 },
  stampInner: { border: '1.5 solid #dc2626', padding: '12 24', alignItems: 'center' },
  stampText: { color: '#dc2626', fontSize: 26, fontWeight: 900, fontStyle: 'italic', letterSpacing: 1 },
  stampSub: { color: '#dc2626', fontSize: 8, letterSpacing: 3, fontWeight: 'bold', marginTop: 6 },

  // --- PAGE FOOTER ---
  pageFooter: { position: 'absolute', bottom: 20, left: 45, right: 45, flexDirection: 'row', justifyContent: 'space-between' },
  pageFooterText: { fontSize: 6, color: '#9ca3af' }
});

const ManifestoDocument = ({ order, orderId }) => {
  const items = order?.items || [];
  const subtotal = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const logisticsFee = Number(order?.shippingFee || 0);
  const finalTotal = subtotal + logisticsFee;

  const uplinkDate = order?.createdAt 
    ? new Date(order.createdAt).toISOString().split('.')[0] + "Z"
    : "2026-01-24T16:00:00Z";

  return (
    <Document title={`MANIFESTO_${orderId}`}>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>THE_DIECAST_STORE</Text>
            <Text style={styles.subtitle}>CURATED_EXHIBITION_CORE_SYSTEM</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerBadgeText}>TECHNICAL_MANIFESTO_V2</Text>
            <Text style={styles.headerDateText}>UPLINK_STAMP: {uplinkDate}</Text>
          </View>
        </View>
        <View style={styles.thickDivider} />

        {/* INFO GRID */}
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <View>
              <Text style={styles.label}>{"// ORDER_REFERENCE"}</Text>
              <Text style={styles.value}>{orderId}</Text>
            </View>
            <View style={styles.valueGroup}>
              <Text style={styles.label}>{"// PAYMENT_PROTOCOL"}</Text>
              <Text style={styles.value}>{order?.paymentMethod || "RAZORPAY_SECURE_GATEWAY"}</Text>
            </View>
          </View>
          <View style={[styles.gridCol, { borderLeft: '1 solid #e5e7eb', paddingLeft: 25 }]}>
            <View>
              <Text style={styles.label}>{"// LOGISTICS_NODE_ID"}</Text>
              <Text style={styles.value}>{order?.trackingNumber || "PENDING_ALLOCATION"}</Text>
            </View>
            <View style={styles.valueGroup}>
              <Text style={styles.label}>{"// CARRIER_SERVICE"}</Text>
              <Text style={styles.value}>{order?.shippingProvider || "STANDARD"}</Text>
            </View>
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View>
          <Text style={styles.tableTitle}>EXHIBIT_ALLOCATION_MANIFEST</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.label]}>ITEM_DESCRIPTION</Text>
            <Text style={[styles.col2, styles.label]}>SCALE</Text>
            <Text style={[styles.col3, styles.label]}>VALUATION</Text>
          </View>
          
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <View style={styles.col1}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.brand || 'GENERIC'}{" // "}{item.genre?.replace(/_/g, ' ') || 'UNCATEGORIZED'}{" // PART_REF: "}{item.sku || item.id?.slice(-6).toUpperCase() || 'N/A'}
                </Text>
              </View>
              <Text style={[styles.col2, { fontSize: 10, fontWeight: 'bold' }]}>{item.scale || 'N/A'}</Text>
              <Text style={[styles.col3, { fontSize: 10, fontWeight: 900, fontStyle: 'italic' }]}>
                ₹{Number(item.price || 0).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* FINANCIALS */}
        <View style={styles.financialWrapper} wrap={false}>
          <View style={styles.financialDivider} />
          
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>SUBTOTAL_VALUATION</Text>
            <Text style={styles.financialValue}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>LOGISTICS_FEE</Text>
            <Text style={styles.financialValue}>₹{logisticsFee.toLocaleString()}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL_VALUATION</Text>
            <Text style={styles.totalValue}>₹{finalTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* ABSOLUTE BOTTOM SECTION - Contact & Disclaimer */}
        <View style={styles.bottomSection} fixed>
          <Text style={styles.contactTitle}>CONTACT_CENTER</Text>
          <Text style={styles.contactText}>support@diecaststore.com</Text>
          <Text style={styles.contactText}>+91 123-456-7890</Text>
          
          <View style={styles.disclaimerLine}>
            <Text style={styles.disclaimerText}>
              THIS MANIFEST SERVES AS OFFICIAL PROOF OF PURCHASE.{"\n"}
              ALL EXHIBITS ARE VERIFIED FOR AUTHENTICITY AND SCALE{"\n"}
              PRECISION AGAINST GALLERY_OS STANDARDS.
            </Text>
          </View>
        </View>

        {/* ABSOLUTE STAMP */}
        <View style={styles.stampContainer} fixed>
          <View style={styles.stampOuter}>
            <View style={styles.stampInner}>
              <Text style={styles.stampText}>PURCHASE_COMPLETED</Text>
              <Text style={styles.stampSub}>VERIFIED_BY_GALLERY_OS</Text>
            </View>
          </View>
        </View>

        {/* PAGE URL AND NUMBER */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.pageFooterText}>localhost:3000/access/orders</Text>
          <Text style={styles.pageFooterText} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
};

// MAIN EXPORT
export default function ManifestoButton({ order }) {
  if (!order) return null;
  const orderId = order.id || order._id || "UNASSIGNED";

  return (
    <PDFDownloadLink 
      document={<ManifestoDocument order={order} orderId={orderId} />}
      fileName={`MANIFESTO_${orderId.substring(0, 8)}.pdf`}
      className="group flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-all mt-2"
    >
      {({ loading }) => (
        <>
          <svg className="w-3 h-3 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {loading ? 'COMPILING...' : 'Generate_Technical_Manifesto.pdf'}
        </>
      )}
    </PDFDownloadLink>
  );
}