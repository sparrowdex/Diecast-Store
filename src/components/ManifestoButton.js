"use client";

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registering font to match the Geist Mono industrial vibe
Font.register({
  family: 'GeistMono',
  src: 'https://fonts.gstatic.com/s/geistmono/v1/L0x9DFM0_L6O9P7K-O0.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 45,
    backgroundColor: '#ffffff',
    fontFamily: 'GeistMono',
    display: 'flex',
    flexDirection: 'column',
    color: 'black'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '8 solid black',
    paddingBottom: 25,
    marginBottom: 35,
  },
  title: { fontSize: 42, fontWeight: 'heavy', fontStyle: 'italic', letterSpacing: -2 },
  badge: { backgroundColor: 'black', color: 'white', padding: '6 14', fontSize: 9, letterSpacing: 3, fontWeight: 'bold' },
  grid: { flexDirection: 'row', gap: 40, marginBottom: 50 },
  gridCol: { flex: 1 },
  label: { fontSize: 9, color: '#9ca3af', letterSpacing: 2, marginBottom: 6, fontWeight: 'bold' },
  value: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  tableTitle: { fontSize: 10, letterSpacing: 4, marginBottom: 12, borderBottom: '2 solid #eeeeee', paddingBottom: 6, fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #eeeeee', paddingBottom: 10, marginBottom: 10 },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #f9f9f9', paddingVertical: 18 },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  financialSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '3 solid black',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalContainer: { width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 9, color: '#9ca3af', fontWeight: 'bold' },
  totalAmount: { fontSize: 32, fontWeight: 'heavy', fontStyle: 'italic', letterSpacing: -1, marginTop: 10 },
  stamp: {
    position: 'absolute',
    right: 50,
    bottom: 90,
    border: '8 solid #dc2626',
    padding: '12 24',
    transform: 'rotate(-12deg)',
    opacity: 0.85,
  },
  stampInner: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, border: '2 solid #dc2626' },
  stampText: { color: '#dc2626', fontSize: 22, fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' },
  stampSub: { color: '#dc2626', fontSize: 8, textAlign: 'center', marginTop: 6, letterSpacing: 3, fontWeight: 'bold' },
  telemetry: {
    marginTop: 'auto',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#d1d5db',
    letterSpacing: 4,
    fontWeight: 'bold'
  }
});

const ManifestoDocument = ({ order, orderId }) => {
  // Logic to handle pricing properly
  const subtotal = order.items?.reduce((acc, item) => acc + Number(item.price), 0) || 0;
  const shippingFee = Number(order.shippingFee) || 0;
  const finalTotal = subtotal + shippingFee;

  return (
    <Document title={`MANIFESTO_${orderId}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>THE_DIECAST_STORE</Text>
            <Text style={{ fontSize: 9, color: '#9ca3af', letterSpacing: 5 }}>CURATED_EXHIBITION_CORE_SYSTEM</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.badge}><Text>TECHNICAL_MANIFESTO_V2.0</Text></View>
            <Text style={{ fontSize: 7, color: '#9ca3af', marginTop: 10 }}>UPLINK: {new Date().toISOString()}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>// ORDER_REFERENCE</Text>
            <Text style={styles.value}>{orderId}</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>// PAYMENT_PROTOCOL</Text>
              <Text style={styles.value}>{order.paymentMethod || "RAZORPAY_SECURE"}</Text>
            </View>
          </View>
          <View style={[styles.gridCol, { borderLeft: '1 solid #f3f4f6', paddingLeft: 35 }]}>
            <Text style={styles.label}>// LOGISTICS_NODE_ID</Text>
            <Text style={styles.value}>{order.trackingNumber || "PENDING_ALLOCATION"}</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>// CARRIER_SERVICE</Text>
              <Text style={styles.value}>{order.shippingProvider || "SHIPROCKET_EXPRESS"}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.tableTitle}>EXHIBIT_ALLOCATION_MANIFEST</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.label]}>ITEM_DESCRIPTION</Text>
            <Text style={[styles.col2, styles.label]}>SCALE</Text>
            <Text style={[styles.col3, styles.label]}>VALUATION</Text>
          </View>
          {(order.items || []).map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 8, color: '#9ca3af', marginTop: 4 }}>
                  {item.brand || 'GENERIC'} // {item.genre || 'UNCATEGORIZED'}
                </Text>
              </View>
              <Text style={[styles.col2, { fontSize: 11 }]}>{item.scale || 'N/A'}</Text>
              <Text style={[styles.col3, { fontSize: 13, fontWeight: 'bold', fontStyle: 'italic' }]}>
                ₹{Number(item.price).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.financialSection}>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL_VALUATION</Text>
              <Text style={{ fontSize: 10 }}>₹{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SHIPPING_&_HANDLING</Text>
              <Text style={{ fontSize: 10 }}>₹{shippingFee.toLocaleString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTop: '1 solid #eee', paddingTop: 15 }}>
              <Text style={[styles.totalLabel, { color: 'black' }]}>TOTAL_VALUATION</Text>
              <Text style={styles.totalAmount}>₹{finalTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stamp}>
          <View style={styles.stampInner} />
          <Text style={styles.stampText}>PURCHASE_COMPLETED</Text>
          <Text style={styles.stampSub}>VERIFIED_BY_GALLERY_OS</Text>
        </View>

        <View style={styles.telemetry}>
          <Text>NODE_ID: {orderId.substring(0, 6)}</Text>
          <Text>--- SECURE_MANIFEST_PROTOCOL_ACTIVE ---</Text>
          <Text>PAGE_01_OF_01</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function ManifestoButton({ order }) {
  if (!order) return null;
  const orderId = order.id || "UNASSIGNED";

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
