# Bajaj Finserv - EMI Down Payment Calculator

A simplified, vertical, mobile-first web application designed for Bajaj Finserv EMI down payment calculation.

---

## 🎯 Design & Flow

1. **Clean Vertical Mobile-Friendly Layout**:
   - Centered, clean layout (`max-width: 480px`).
   - Official Bajaj Finserv White and Royal Blue (`#0063A7`) theme.

2. **Clean Inputs (No Suggestions / No Presets)**:
   - **Product Price (₹)**: Blank, ready for user input.
   - **Loan Amount (₹)**: Blank, ready for user input.
   - **Bajaj Charges (₹)**: Pre-entered as **₹699** (editable).
   - **Bank Charges (₹)**: Pre-entered as **₹270** (editable).
   - **Dealer Charges (%)**: Blank, ready for input (e.g. 1.5). Applied on Loan Amount.
   - **DBD Coupon (₹)**: Blank, ready for input (e.g. 500).

3. **Output Revealed Vertically Below**:
   - Hidden until the user enters Product Price and Loan Amount (or taps "Calculate Down Payment").
   - **Final Clean Output**:
     - **Down Payment**: Large bold figure.
     - **Product Price**: ₹...
     - **Loan Amount**: ₹...
   - **No Formulas or Internal Breakdown Disclosed Directly**:
     - Formulas and itemized values remain hidden until the user taps **"View Itemized Charge Breakdown"**.
     - When expanded, shows Bajaj Charges, Bank Charges, Dealer Charges, DBD Coupon deduction, and Margin Money (if Loan < Price).

4. **Action Buttons**:
   - **Share via WhatsApp**: Ready-to-send formatted quotation.
   - **Copy Result**: Quick clipboard copy.
   - **Reset**: Resets all fields back to blank (keeping Bajaj ₹699 and Bank ₹270) and hides output.

---

## 💻 Local Access
- Running live at: `http://localhost:8085/`
- Open `index.html` in any browser.
