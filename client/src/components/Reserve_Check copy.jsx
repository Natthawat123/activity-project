import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import axios from "axios";
import { useParams } from "react-router";
import { range, formatDate } from "../admin/components/Upload/Fx";

// Register the custom font
Font.register({
  family: "Sarabun",
  src: "https://fonts.gstatic.com/s/sarabun/v13/DtVmJx26TKEr37c9YMptulwm6gDXvwE.ttf",
});

// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Sarabun",
  },
  title: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: 12,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const ITEMS_PER_PAGE = 15;

const splitIntoPages = (reserves) => {
  const pages = [];
  for (let i = 0; i < reserves.length; i += ITEMS_PER_PAGE) {
    pages.push(reserves.slice(i, i + ITEMS_PER_PAGE));
  }
  return pages;
};

function PDFReserve() {
  const [reserves, setReserve] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [activity, setActivity] = useState({ title: "" });
  const { act_ID } = useParams();

  const dateS = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  const th = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    return `${Number(day)} ${thaiMonths[parseInt(month, 10) - 1]} ${
      parseInt(year, 10) + 543
    }`;
  };

  useEffect(() => {
    axios.get(`/api/reserve/${act_ID}`).then((res) => {
      const sortedReserves = res.data.sort((a, b) => a.login_ID - b.login_ID); // Sort by login_ID ascending
      setReserve(sortedReserves);
      setDateRange(range(sortedReserves[0].act_dateStart, sortedReserves[0].act_dateEnd));
      setActivity({ title: sortedReserves[0].act_title });
    });
  }, [act_ID]);

  const Quixote = ({ activity, dateRange, reserve }) => {
    const pages = splitIntoPages(reserve);
    let globalIndex = 1;

    const OrderColumnWidth = 5;
    const studentIdColumnWidth = 12;
    const classColumnWidth = 8;
    const nameColumnWidth = 20;
    const dateColumnWidth =
      (100 -
        (studentIdColumnWidth +
          nameColumnWidth +
          classColumnWidth +
          OrderColumnWidth)) /
      dateRange.length;

    return (
      <Document>
        {pages.map((pageReserves, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            style={styles.body}
            orientation="landscape"
          >
            <Text style={styles.title} fixed>
              รายชื่อผู้มีสิทธิ์เข้าร่วมกิจกรรม{reserves[0].act_title}
            </Text>
            <Text style={styles.title} fixed>
              {reserves[0].act_desc}
            </Text>
            <Text style={styles.title} fixed>
              ระหว่างวันที่ {th(dateS(reserves[0].act_dateStart))} - {th(dateS(reserves[0].act_dateEnd))}
            </Text>
            <Text style={styles.title} fixed>
              ณ {reserves[0].act_location}
            </Text>
            <Text style={[styles.title, {marginBottom: 10}]} fixed>
              โดย{" "}
              {reserves[0].staff_fname} {reserves[0].staff_lname}
            </Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]} fixed>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${OrderColumnWidth}%`, borderBottom: 0 },
                  ]}
                >
                  <Text style={styles.tableCell}></Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${studentIdColumnWidth}%`, borderBottom: 0 },
                  ]}
                >
                  <Text style={styles.tableCell}></Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${nameColumnWidth}%`, borderBottom: 0 },
                  ]}
                >
                  <Text style={styles.tableCell}></Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${classColumnWidth}%`, borderBottom: 0 },
                  ]}
                >
                  <Text style={styles.tableCell}></Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${dateColumnWidth * dateRange.length}%` },
                  ]}
                >
                  <Text style={styles.tableCell}>ลงชื่อเข้าร่วมกิจกรรม</Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableHeader]} fixed>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${OrderColumnWidth}%`, position: "relative" },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "absolute", top: -12, left: 2 },
                    ]}
                  >
                    ลำดับ{" "}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${studentIdColumnWidth}%`, position: "relative" },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "absolute", top: -12, left: 13 },
                    ]}
                  >
                    รหัสนักศึกษา
                  </Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${nameColumnWidth}%`, position: "relative" },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "absolute", top: -12, left: 44 },
                    ]}
                  >
                    ชื่อ - นามสกุล
                  </Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${classColumnWidth}%`, position: "relative" },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "absolute", top: -12, left: 8 },
                    ]}
                  >
                    หมู่เรียน
                  </Text>
                </View>
                {dateRange.map((date, i) => (
                  <View
                    key={i}
                    style={[styles.tableCol, { width: `${dateColumnWidth}%` }]}
                  >
                    <Text style={styles.tableCell}>{formatDate(date).th}</Text>
                  </View>
                ))}
              </View>

              {pageReserves.map((reserve, index) => {
                const isFirstInGroup =
                  index === 0 ||
                  reserve.login_ID !== pageReserves[index - 1].login_ID;

                return (
                  <View key={index} style={styles.tableRow}>
                    {isFirstInGroup && (
                      <>
                        <View
                          style={[
                            styles.tableCol,
                            { width: `${OrderColumnWidth}%` },
                          ]}
                        >
                          <Text style={styles.tableCell}>{globalIndex++}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: `${studentIdColumnWidth}%` },
                            { textAlign: "center" },
                          ]}
                        >
                          <Text
                            style={styles.tableCell}
                            rowSpan={dateRange.length}
                          >
                            {reserve.login_ID}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: `${nameColumnWidth}%` },
                          ]}
                        >
                          <Text
                            style={[styles.tableCell, { textAlign: "left" }]}
                            rowSpan={dateRange.length}
                          >
                            {`${reserve.std_fname} ${reserve.std_lname}`}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: `${classColumnWidth}%` },
                            { textAlign: "center" },
                          ]}
                        >
                          <Text
                            style={styles.tableCell}
                            rowSpan={dateRange.length}
                          >
                            {reserve.sec_name}
                          </Text>
                        </View>
                      </>
                    )}
                    {dateRange.map((date, i) => (
                      <View
                        key={i}
                        style={[
                          styles.tableCol,
                          { width: `${dateColumnWidth}%` },
                        ]}
                      >
                        <Text style={styles.tableCell}></Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
            <Text style={styles.pageNumber} fixed>
              หน้า {pageIndex + 1} / {pages.length}
            </Text>
          </Page>
        ))}
      </Document>
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <PDFDownloadLink
        document={
          <Quixote
            activity={activity}
            dateRange={dateRange}
            reserve={reserves}
          />
        }
        fileName={`ใบลงชื่อกิจกรรม_${activity.title}.pdf`}
        style={{
          textDecoration: "none",
          color: "blue",
          display: "block",
          textAlign: "center",
        }}
      >
        {({ loading }) => (loading ? "กำลังโหลดเอกสาร..." : "ดาวน์โหลดเอกสาร")}
      </PDFDownloadLink>
      <PDFViewer style={{ width: "100%", height: "100%" }} showToolbar={false}>
        <Quixote activity={activity} dateRange={dateRange} reserve={reserves} />
      </PDFViewer>
    </div>
  );
}

export default PDFReserve;
