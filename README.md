# Down Payment Calculator - POS Suite

A clean, advanced, mobile-friendly financial calculator designed for retail POS down payment estimations.

---

## 🎯 Features & Behavior

### 1. Payment Summary on Demand
- The **Payment Summary** card is **hidden by default** when opening the site or clicking **Reset**.
- When the user enters the product parameters and clicks **Calculate Down Payment**, the card smoothly animates into view and automatically scrolls to the result.

### 2. "Estimated Quotation" via Actions Only
- The words **"Estimated Quotation"** do not appear on the website interface.
- Accessed exclusively when triggering export actions:
  - **Share on WhatsApp**: Exports full breakdown under `*ESTIMATED QUOTATION*`.
  - **Copy Quote**: Copies plaintext summary headed by `ESTIMATED QUOTATION`.
  - **Print Slip**: Formats a printable receipt headed by `ESTIMATED QUOTATION`.

### 3. Updated Labels & Terminology
- DBD Coupon hint: **`0.80% / 0.30%`**.
- Ledger toggle button: **`View More Details`**.
- Down Payment label: **`Down Payment (Net Fee)`**.
- Dealer / DBD line items: **`Dealer Charges (X%)`** and **`DBD Coupon (X%)`**.
- Disclaimer:
  > *"Note: This site only gives estimation calculations & not the final quotation as it changes as per schemes and the downpayment value may be vary between 10 - 999."*

---

## 💻 Local Access
- Running live at: `http://localhost:8090/`
- Directory: `C:\Users\tharu\.gemini\antigravity\scratch\bajaj-downpayment-calculator\`
