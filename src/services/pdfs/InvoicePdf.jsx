import { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "@assets/images/logo.png";
import rupeIcon from "@assets/icons/rupee.png";
import rupeIconWhite from "@assets/icons/rupeewhite.png";

import bgLogo from "@assets/images/bg-logo.png";


// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        lineHeight: 1.7,
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.2,
        objectFit: 'contain',
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },
    headerText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#002060",
    },
    subHeaderText: {
        fontSize: 10,
        marginBottom: 5,
    },
    section: {
        marginBottom: 20,
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#D9E9FF",
        borderBottomColor: "#B0C4DE",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    tableHeaderCell: {
        flex: 1,
        padding: 5,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableCell: {
        flex: 1,
        padding: 5,
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#E0E0E0",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    totalRow: {
        flexDirection: "row",
        backgroundColor: "#D9E9FF",
        borderTopWidth: 1,
        borderTopColor: "#B0C4DE",
    },
    totalCell: {
        flex: 1,
        padding: 5,
        fontWeight: "bold",
        textAlign: "center",
    },
    footer: {
        position: 'absolute',
        bottom: 0, // Places the footer at the bottom of the page
        left: 0, // Aligns to the left edge
        right: 0, // Aligns to the right edge
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        paddingTop: 10,
        textAlign: "center", // Centers the text horizontally
    },
});

// Invoice component
const InvoicePdf = ({ data }) => {
    const { invoice_no, items, invoice_date, customer_address, customer_phone, payment_due_date, customer_name, customer_id, delivery_date, payment_date, payment_method, sales_person, paid_amount, due_amount, grand_total } = data || {};

    return (
        <Document style={{ fontFamily: 'Helvetica' }}>
            <Page size="A4" style={styles.page}>
                <Image
                    src={bgLogo}
                    style={styles.backgroundImage}
                />

                <View style={styles.header}>
                    <View>
                        <Text style={{ marginLeft: -10, marginTop: -10 }}>
                            <Image src={logo} alt="logo" style={{ width: 130, height: 30, display: "block" }} />
                            {/* <Text style={styles.subHeaderText}>{invoice_date || 'invoice_no'}</Text> */}
                        </Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.headerText}>INVOICE:</Text>
                        <Text style={styles.subHeaderText}>  {invoice_no || ''}</Text>
                    </View>
                </View>

                {/* Bill To and Bill From */}
                <View style={[styles.section, { flexDirection: "row", justifyContent: "space-between" }]}>
                    <View>
                        <Text style={[styles.headerText, { marginBottom: 8 }]}>Bill To</Text>
                        <Text>Customer: {customer_name || '--'}</Text>
                        <Text>Customer ID: {customer_id || '--'}</Text>
                        <Text>Address: {customer_address || '--'}</Text>
                        <Text>Phone: {customer_phone || '--'}</Text>
                    </View>
                    <View>
                        <Text style={[styles.headerText, { marginBottom: 8 }]}>Bill From</Text>
                        <Text>Recipient: Amirait™ Dev Rise Global Technologies Pvt Ltd</Text>
                        <Text>Address: Phase 1, Saharanpur Rd, Shakti Vihar, Majra, Dehradun</Text>
                        <Text>Phone: +91 7017986097</Text>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={[styles.section, { flexDirection: "row", justifyContent: "space-between" }]}>
                    <View>
                        <Text>Payment Due: {payment_due_date || '--'}</Text>
                        <Text>Salesperson:{sales_person || '--'}</Text>
                    </View>
                    <View>
                        <Text>Delivery Date: {delivery_date || '--'}</Text>
                        <Text>Payment Method: {payment_method || '--'}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Qty.</Text>
                        <Text style={styles.tableHeaderCell}>Item#</Text>
                        <Text style={styles.tableHeaderCell}>Description</Text>
                        <Text style={styles.tableHeaderCell}>Unit Price</Text>
                        <Text style={styles.tableHeaderCell}>Discount</Text>
                        <Text style={styles.tableHeaderCell}>Sub Total</Text>
                    </View>

                    {/* Table Rows */}
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>{item.qty || '--'}</Text>
                                <Text style={styles.tableCell}>{item.item || '--'}</Text>
                                <Text style={styles.tableCell}>{item.description || '--'}</Text>
                                <Text style={styles.tableCell}> <Image src={rupeIcon} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{item.price || '--'}</Text>
                                <Text style={styles.tableCell}>{item.discount || '--'}%</Text>
                                <Text style={styles.tableCell}><Image src={rupeIcon} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{item.total || '--'}</Text>
                            </View>
                        </Fragment>
                    ))}

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalCell, { flex: 4 }]}>Total Discount</Text>
                        <Text style={[styles.totalCell, { flex: 2 }]}><Image src={rupeIcon} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>000000</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalCell, { flex: 4 }]}><Image src={rupeIcon} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>Subtotal</Text>
                        <Text style={[styles.totalCell, { flex: 2 }]}><Image src={rupeIcon} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{grand_total || '--'}</Text>
                    </View>
                    <View style={[styles.totalRow, { backgroundColor: "#3E90F0" }]}>
                        <Text style={[styles.totalCell, { flex: 4, color: "#FFF" }]}>Total</Text>
                        <Text style={[styles.totalCell, { flex: 2, color: "#FFF" }]}><Image src={rupeIconWhite} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{grand_total || '--'}</Text>
                    </View>
                    <View style={[styles.totalRow, { backgroundColor: "#3E90F0" }]}>
                        <Text style={[styles.totalCell, { flex: 4 }]}>Total Paid</Text>
                        <Text style={[styles.totalCell, { flex: 2,color: "#FFF"  }]}><Image src={rupeIconWhite} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{paid_amount || '--'}</Text>
                    </View>
                    <View style={[styles.totalRow, { backgroundColor: "#3E90F0" }]}>
                        <Text style={[styles.totalCell, { flex: 4 }]}>Amount Due</Text>
                        <Text style={[styles.totalCell, { flex: 2 ,color: "#FFF" }]}><Image src={rupeIconWhite} style={{ width: 10, height: 8, objectFit: 'contain' }}></Image>{due_amount || '--'}</Text>
                    </View>

                </View>


                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for your business!</Text>
                    <Text>
                        Amirait™ Dev Rise Global Technologies Pvt Ltd
                        {"\n"}Phase-1, Saharanpur Rd, Shakti Vihar, Majra, Dehradun
                        {"\n"}P.No. +91 7017986097 | info@amirait.com
                    </Text>
                </View>
            </Page>
        </Document >
    );
};

export default InvoicePdf;
