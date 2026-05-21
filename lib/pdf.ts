import jsPDF from "jspdf";

export function generatePDF(
  days: any[],
  inc: string[],
  exc: string[],
  totals?: {
    total: number;
    adjusted: number;
    perPerson: number;
    final: number;
  },
  marginPct: string = "0",
  title: string = "NorthStar Voyage – Tour Itinerary",
  tagline: string = "Boundless Journey"
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const ml = 15;
  const mr = 15;
  const mt = 15;
  let y = mt;

  const pkgTitle = title;

function checkPage(needed: number) {
  if (y + needed > 277) {
    doc.addPage();
    y = mt;
  }
}

function drawHeader() {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(26, 63, 160);

  doc.text("NorthStar Voyage", ml, y + 6);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 140);

  doc.text("Boundless Journey", ml, y + 11);

  doc.setDrawColor(200, 205, 220);
  doc.line(ml, y + 14, W - mr, y + 14);

  y += 18;
}

drawHeader();

  // ── Executive Summary ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);
  doc.text("1. Executive Summary", ml, y);
  y += 6;

  days.forEach((d, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(26, 63, 160);

    const lbl = `Day ${i + 1}: `;
    doc.text(lbl, ml + 2, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 60);

const summary = d.events.length
  ? d.events
      .map(
        (e: any) =>
e.context?.label ?? e.name      )
      .slice(0, 5)
      .join(" • ")
  : d.title;

const lines = doc.splitTextToSize(
  summary,
  W - ml - mr - 2 - doc.getTextWidth(lbl)
);

    doc.text(lines, ml + 2 + doc.getTextWidth(lbl), y);

    y += lines.length * 4.5 + 0.5;
  });

  y += 4;
  doc.line(ml, y, W - mr, y);
  y += 6;

  // ── Detailed Itinerary ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);
  doc.text("2. Detailed Itinerary", ml, y);
  y += 8;

  days.forEach((d, i) => {
    checkPage(24);

    doc.setFillColor(233, 238, 252);
    doc.setDrawColor(160, 185, 230);
    doc.setLineWidth(0.4);

const summary = d.events.length
  ? d.events
      .map(
        (e: any) =>
e.context?.label ?? e.name      )
      .slice(0, 5)
      .join(" • ")
  : d.title;

const dayTitle = `Day ${i + 1}: ${summary}`;    const lines = doc.splitTextToSize(dayTitle, W - ml - mr - 6);
    const h = lines.length * 5.5 + 5;

    doc.roundedRect(ml, y, W - ml - mr, h, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 55, 140);
    doc.text(lines, ml + 3.5, y + 5);

    y += h + 5;

    if (d.events.length === 0) {
      checkPage(8);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(140, 140, 150);

      doc.text("Free day / no scheduled activities.", ml + 5, y);

      y += 7;
    } else {
      d.events.forEach((e: any) => {
        checkPage(14);

        // Bullet
        doc.setFillColor(26, 63, 160);
        doc.circle(ml + 4.5, y - 0.5, 1.3, "F");

        // Event title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 40);

const label =
  e.context?.label ?? e.name;

doc.text(label, ml + 8, y);


        y += 4.5;

        // Description
        if (e.customDesc) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(80, 80, 100);

          const desc = doc.splitTextToSize(
            e.customDesc,
            W - ml - mr - 10
          );

          doc.text(desc, ml + 8, y);

          y += desc.length * 4 + 3;
        } else {
          y += 2;
        }
      });
    }

    if (i < days.length - 1) {
      checkPage(8);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 120);

      doc.text("Overnight stay in Kathmandu.", ml + 5, y);

      y += 6;
    }

    y += 3;
  });

  // ── Inclusions & Exclusions ──
  checkPage(30);

  doc.setDrawColor(210, 215, 230);
  doc.line(ml, y, W - mr, y);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);
  doc.text("3. Inclusions & Exclusions", ml, y);

  y += 7;

  const colW = (W - ml - mr - 5) / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.setTextColor(20, 110, 60);
  doc.text("Inclusion", ml, y);

  doc.setTextColor(170, 30, 30);
  doc.text("Exclusion", ml + colW + 5, y);

  y += 5;

  const max = Math.max(inc.length, exc.length);

  for (let i = 0; i < max; i++) {
    checkPage(7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    if (inc[i]) {
      const il = doc.splitTextToSize("• " + inc[i], colW);

      doc.setTextColor(30, 30, 50);
      doc.text(il, ml, y);
    }

    if (exc[i]) {
      const el = doc.splitTextToSize("• " + exc[i], colW);

      doc.setTextColor(30, 30, 50);
      doc.text(el, ml + colW + 5, y);
    }

    y += 5.5;
  }

  // ── Package Cost ──
  checkPage(40);

  y += 3;

  doc.setDrawColor(210, 215, 230);
  doc.line(ml, y, W - mr, y);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);

  doc.text("4. Package Cost", ml, y);

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 110);

  doc.text(
    "Cost based on hotel category, number of travelers, and season.",
    ml,
    y
  );

  y += 6;

  const t = totals || {
    total: 0,
    adjusted: 0,
    perPerson: 0,
    final: 0,
  };

  const costRows = [
    ["Gross Total (all activities combined)", `$${t.total}`],
    ["Adjusted Total", `$${t.adjusted}`],
    ["Per Person", `$${t.perPerson}`],
    [`Final Price (incl. ${marginPct}% margin)`, `$${t.final}`],
  ];

  doc.setFillColor(240, 244, 252);

  doc.roundedRect(
    ml,
    y,
    W - ml - mr,
    costRows.length * 7 + 4,
    2,
    2,
    "F"
  );

  costRows.forEach((row, i) => {
    const last = i === costRows.length - 1;

    doc.setFont("helvetica", last ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 50);

    doc.text(row[0], ml + 4, y + 6 + i * 7);

    doc.setFont("helvetica", "bold");

    doc.setTextColor(
      last ? 20 : 26,
      last ? 120 : 63,
      last ? 60 : 160
    );

    doc.text(row[1], W - mr - 4, y + 6 + i * 7, {
      align: "right",
    });

    if (!last) {
      doc.setDrawColor(210, 215, 230);
      doc.setLineWidth(0.2);

      doc.line(
        ml + 3,
        y + 9 + i * 7,
        W - mr - 3,
        y + 9 + i * 7
      );
    }
  });

  y += costRows.length * 7 + 8;

  // ── Notes ──
  checkPage(28);

  doc.setDrawColor(210, 215, 230);
  doc.line(ml, y, W - mr, y);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);

  doc.text("5. Notes", ml, y);

  y += 5;

  const notes = [
    "INR 500 and 2000 denominations are not accepted in Nepal.",
    "Valid Passport or Voter ID is required for travel.",
    "Itinerary is subject to change based on operational conditions.",
  ];

  notes.forEach((n) => {
    checkPage(8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 80);

    const nl = doc.splitTextToSize("• " + n, W - ml - mr);

    doc.text(nl, ml, y);

    y += nl.length * 4.5 + 2;
  });

  // ── Terms & Conditions ──
  checkPage(50);

  y += 3;

  doc.setDrawColor(210, 215, 230);
  doc.line(ml, y, W - mr, y);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 40);

  doc.text("6. Terms & Conditions", ml, y);

  y += 6;

  const cw3 = (W - ml - mr) / 3;

  const thead = [
    "Payment Policy",
    "Cancellation Policy",
    "Child Policy",
  ];

  const tbody = [
    [
      "30% at the time of booking",
      "30–60 days prior: 10%",
      "Below 4 years: Complimentary",
    ],
    [
      "20% prior to arrival",
      "15–29 days prior: 20%",
      "Above 10 years: Adult rate",
    ],
    [
      "50% upon arrival",
      "7–14 days prior: 60%",
      "",
    ],
    [
      "",
      "Within 7 days: 100%",
      "",
    ],
  ];

  // Header row
  doc.setFillColor(220, 228, 248);
  doc.rect(ml, y, W - ml - mr, 7, "F");

  thead.forEach((h2, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 50, 130);

    doc.text(h2, ml + i * cw3 + 3, y + 5);
  });

  y += 7;

  // Table rows
  tbody.forEach((row, ri) => {
    checkPage(7);

    if (ri % 2 === 0) {
      doc.setFillColor(250, 251, 254);
    } else {
      doc.setFillColor(243, 246, 252);
    }

    doc.rect(ml, y, W - ml - mr, 6.5, "F");

    row.forEach((cell, ci) => {
      if (!cell) return;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 70);

      doc.text(cell, ml + ci * cw3 + 3, y + 4.5);
    });

    y += 6.5;
  });

  // ── Footer ──
  y += 8;

  doc.setDrawColor(200, 205, 220);
  doc.line(ml, y, W - mr, y);

  y += 4;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 160);

  doc.text(
    "NorthStar Voyage — Boundless Journey | This itinerary is computer-generated for planning purposes.",
    ml,
    y
  );

  doc.save("itinerary.pdf");
}