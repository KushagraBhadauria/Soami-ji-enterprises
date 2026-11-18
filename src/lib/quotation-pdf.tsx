import "server-only";
import path from "path";
import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import { site } from "./site";
import type { Quotation } from "./types";
import { amountInWords } from "./format";

/**
 * QUOTATION PDF TEMPLATE — matches the shop's existing quotation format
 * (bordered A4, logo + shop header, Bill To / Quotation No. / Dates,
 *  S.NO | ITEMS | QTY | RATE | AMOUNT table, total, amount in words, terms),
 * with the Soami Ji Enterprises logo as a watermark and as the "advertisement".
 */

const assets = path.join(process.cwd(), "assets");
Font.register({
  family: "Noto",
  fonts: [
    { src: path.join(assets, "fonts", "NotoSans-400.ttf"), fontWeight: 400 },
    { src: path.join(assets, "fonts", "NotoSans-700.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

const LOGO = path.join(assets, "logo.jpg");
const WATERMARK = path.join(assets, "watermark.png");

const C = {
  ink: "#111111",
  border: "#2B2B2B",
  line: "#9A9A9A",
  head: "#E3E3F6",
  title: "#4F4FB8",
  muted: "#555555",
  gold: "#9A7419",
};

const W = { sn: 44, qty: 60, rate: 70, amt: 80 }; // ITEMS column takes the rest

const s = StyleSheet.create({
  page: { fontFamily: "Noto", fontSize: 8.4, lineHeight: 1.3, color: C.ink, paddingTop: 22, paddingBottom: 40, paddingHorizontal: 30 },
  watermark: { position: "absolute", top: 230, left: 122, width: 350, height: 350 },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  topTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 0.3 },
  ad: { flexDirection: "row", alignItems: "center" },
  adLogo: { width: 22, height: 22, borderRadius: 11, marginRight: 5 },
  adText: { fontSize: 12.5, fontWeight: 700, color: C.gold },

  box: { borderWidth: 1, borderColor: C.border },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border, minHeight: 92 },
  logo: { width: 76, height: 76, borderRadius: 38 },
  headCenter: { flex: 1, alignItems: "center", paddingRight: 76 },
  shopName: { fontSize: 13.5, fontWeight: 700, color: C.title, marginBottom: 3 },
  headLine: { fontSize: 8.6, marginTop: 1.5, textAlign: "center" },
  bold: { fontWeight: 700 },

  billRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.border, minHeight: 74 },
  billLeft: { width: "50%", padding: 7, borderRightWidth: 1, borderRightColor: C.border },
  billRight: { flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  metaCol: { flex: 1, alignItems: "center" },
  metaK: { fontWeight: 700, fontSize: 8.6 },
  metaV: { marginTop: 1, fontSize: 8.6 },

  th: { flexDirection: "row", backgroundColor: C.head, borderBottomWidth: 1, borderBottomColor: C.border },
  thCell: { paddingVertical: 6, fontSize: 8.2, fontWeight: 400, textAlign: "center" },
  body: { minHeight: 300, flexDirection: "column" },
  tr: { flexDirection: "row" },
  td: { paddingVertical: 4, paddingHorizontal: 6 },
  colSn: { width: W.sn, textAlign: "center", borderRightWidth: 1, borderRightColor: C.border },
  colItem: { flex: 1, borderRightWidth: 1, borderRightColor: C.border },
  colQty: { width: W.qty, textAlign: "right", borderRightWidth: 1, borderRightColor: C.border },
  colRate: { width: W.rate, textAlign: "right", borderRightWidth: 1, borderRightColor: C.border },
  colAmt: { width: W.amt, textAlign: "right" },
  itemSub: { fontSize: 6.8, color: C.muted, marginTop: 0.5 },
  filler: { flexGrow: 1, flexDirection: "row" },
  totalRow: { flexDirection: "row", backgroundColor: C.head, borderTopWidth: 1, borderTopColor: C.border, borderBottomWidth: 1, borderBottomColor: C.border },

  section: { borderWidth: 1, borderColor: C.border, borderTopWidth: 0, paddingHorizontal: 7, paddingVertical: 5 },
  sectionTitle: { fontSize: 8.8, marginBottom: 2 },

  footer: { position: "absolute", bottom: 14, left: 0, right: 0, alignItems: "center" },
  footPill: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#DDDDDD", borderRadius: 4, paddingVertical: 4, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  footLogo: { width: 14, height: 14, borderRadius: 7, marginHorizontal: 4 },
  footText: { fontSize: 7.2, color: C.muted },
});

const num = (n: number) => Math.round(n).toLocaleString("en-IN");
const dmy = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });
const plainPhone = site.phone.replace(/^\+91\s*/, "").replace(/\s/g, "");

export function QuotationDoc({ q }: { q: Quotation }) {
  const created = new Date(q.created_at);
  const expiry = new Date(created.getTime() + site.quotation.validityDays * 864e5);
  const totalQty = q.items.reduce((n, i) => n + i.qty, 0);

  return (
    <Document title={`Quotation ${q.quote_no}`} author={site.brand} creator={site.brand} producer={site.brand}>
      <Page size="A4" style={s.page}>
        {/* Watermark */}
        <Image src={WATERMARK} style={s.watermark} fixed />

        {/* Top line: title + brand advertisement */}
        <View style={s.topRow} fixed>
          <Text style={s.topTitle}>QUOTATION</Text>
          <View style={s.ad}>
            <Image src={LOGO} style={s.adLogo} />
            <Text style={s.adText}>{site.brand}</Text>
          </View>
        </View>

        <View style={s.box}>
          {/* Shop header */}
          <View style={s.header}>
            <Image src={LOGO} style={s.logo} />
            <View style={s.headCenter}>
              <Text style={s.shopName}>{site.name}</Text>
              <Text style={[s.headLine, { color: C.gold, fontWeight: 700, marginTop: 0 }]}>{site.tagline}</Text>
              <Text style={s.headLine}>{site.address}</Text>
              <Text style={s.headLine}>
                <Text style={s.bold}>Mobile: </Text>
                {plainPhone}
                {"      "}
                <Text style={s.bold}>Email: </Text>
                {site.email}
              </Text>
              {site.gstin ? (
                <Text style={s.headLine}>
                  <Text style={s.bold}>GSTIN: </Text>
                  {site.gstin}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Bill to + quotation meta */}
          <View style={s.billRow}>
            <View style={s.billLeft}>
              <Text style={{ fontSize: 8.6 }}>BILL TO</Text>
              <Text style={[s.bold, { fontSize: 9, marginTop: 1 }]}>{q.customer_name.toUpperCase()}</Text>
              {q.customer_address ? <Text style={{ marginTop: 2 }}>Address:  {q.customer_address}</Text> : null}
              <Text style={{ marginTop: 2 }}>Mobile:  {q.customer_phone}</Text>
              {q.customer_email ? <Text style={{ marginTop: 2 }}>Email:  {q.customer_email}</Text> : null}
              {q.note ? <Text style={{ marginTop: 2, color: C.muted }}>Note:  {q.note}</Text> : null}
            </View>
            <View style={s.billRight}>
              <View style={s.metaCol}>
                <Text style={s.metaK}>Quotation No.</Text>
                <Text style={s.metaV}>{q.quote_no}</Text>
              </View>
              <View style={s.metaCol}>
                <Text style={s.metaK}>Quotation Date</Text>
                <Text style={s.metaV}>{dmy(created)}</Text>
              </View>
              <View style={s.metaCol}>
                <Text style={s.metaK}>Expiry Date</Text>
                <Text style={s.metaV}>{dmy(expiry)}</Text>
              </View>
            </View>
          </View>

          {/* Table header */}
          <View style={s.th}>
            <Text style={[s.thCell, s.colSn]}>S.NO.</Text>
            <Text style={[s.thCell, s.colItem]}>ITEMS</Text>
            <Text style={[s.thCell, s.colQty, { textAlign: "center" }]}>QTY.</Text>
            <Text style={[s.thCell, s.colRate, { textAlign: "center" }]}>RATE</Text>
            <Text style={[s.thCell, s.colAmt, { textAlign: "center" }]}>AMOUNT</Text>
          </View>

          {/* Rows + filler so the column lines run down to TOTAL */}
          <View style={s.body}>
            {q.items.map((it, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, s.colSn]}>{i + 1}</Text>
                <View style={[s.td, s.colItem]}>
                  <Text>
                    {it.name}
                    {it.condition === "used" ? " (Second-hand)" : ""}
                  </Text>
                  {it.description ? <Text style={s.itemSub}>{it.description}</Text> : null}
                </View>
                <Text style={[s.td, s.colQty]}>
                  {it.qty} {it.unit || "PCS"}
                </Text>
                <View style={[s.td, s.colRate]}>
                  <Text style={{ textAlign: "right" }}>{num(it.unit_price)}</Text>
                  {it.discount > 0 ? (
                    <Text style={[s.itemSub, { textAlign: "right" }]}>
                      <Text style={{ textDecoration: "line-through" }}>{num(it.mrp)}</Text> -{it.discount}%
                    </Text>
                  ) : null}
                </View>
                <Text style={[s.td, s.colAmt]}>{num(it.amount)}</Text>
              </View>
            ))}
            <View style={s.filler}>
              <View style={s.colSn} />
              <View style={s.colItem} />
              <View style={s.colQty} />
              <View style={s.colRate} />
              <View style={s.colAmt} />
            </View>
          </View>

          {/* Total */}
          <View style={[s.totalRow, { borderBottomWidth: 0 }]} wrap={false}>
            <Text style={[s.td, s.colSn]} />
            <Text style={[s.td, s.colItem, s.bold, { textAlign: "right", paddingRight: 10 }]}>TOTAL</Text>
            <Text style={[s.td, s.colQty, s.bold, { textAlign: "center" }]}>{totalQty}</Text>
            <Text style={[s.td, s.colRate]} />
            <Text style={[s.td, s.colAmt, s.bold]}>₹ {num(q.grand_total)}</Text>
          </View>
        </View>

        {/* Amount in words */}
        <View style={[s.section, { borderTopWidth: 1, marginTop: 8 }]} wrap={false}>
          <Text style={s.sectionTitle}>Total Amount (in words)</Text>
          <Text>{amountInWords(q.grand_total)}</Text>
          {q.total_discount > 0 ? (
            <Text style={{ marginTop: 2, color: C.gold, fontWeight: 700 }}>
              Total discount on MRP: ₹ {num(q.total_discount)}
            </Text>
          ) : null}
        </View>

        {/* Terms */}
        <View style={s.section} wrap={false}>
          <Text style={s.sectionTitle}>Terms and Conditions</Text>
          <Text style={{ lineHeight: 1.3, fontSize: 8 }}>{site.quotation.terms.map((t, i) => `${i + 1}- ${t}`).join("\n")}</Text>
        </View>

        {/* Footer advertisement */}
        <View style={s.footer} fixed>
          <View style={s.footPill}>
            <Text style={s.footText}>Quotation created by</Text>
            <Image src={LOGO} style={s.footLogo} />
            <Text style={[s.footText, { fontWeight: 700, color: C.gold }]}>{site.brand}</Text>
            <Text style={s.footText}>
              {"   |   "}{site.tagline}{"   |   "}Call / WhatsApp {plainPhone}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderQuotationPdf(q: Quotation): Promise<Buffer> {
  return renderToBuffer(<QuotationDoc q={q} />);
}
