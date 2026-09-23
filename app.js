/**
 * Estimated Quotation - Down Payment Calculation Suite
 * Live Reactive Vertical Layout Controller
 */

(function () {
  'use strict';

  // --- Element Selectors ---
  const el = {
    // Inputs
    productPrice: document.getElementById('productPrice'),

    // Separated Checkboxes & Wrappers
    checkReplacement: document.getElementById('checkReplacement'),
    checkAdvance: document.getElementById('checkAdvance'),
    deductionsInputsGrid: document.getElementById('deductionsInputsGrid'),
    replacementFieldWrap: document.getElementById('replacementFieldWrap'),
    advanceFieldWrap: document.getElementById('advanceFieldWrap'),
    replacementAmt: document.getElementById('replacementAmt'),
    advancePaymentAmt: document.getElementById('advancePaymentAmt'),
    netLoanNoticeBar: document.getElementById('netLoanNoticeBar'),
    netLoanPreviewVal: document.getElementById('netLoanPreviewVal'),

    // Charges
    bajajCharges: document.getElementById('bajajCharges'),
    bankCharges: document.getElementById('bankCharges'),
    dealerChargesPercent: document.getElementById('dealerChargesPercent'),
    dealerAmountLiveBadge: document.getElementById('dealerAmountLiveBadge'),
    dbdCouponPercent: document.getElementById('dbdCouponPercent'),
    dbdAmountLiveBadge: document.getElementById('dbdAmountLiveBadge'),

    // Buttons
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    whatsappShareBtn: document.getElementById('whatsappShareBtn'),
    copyBtn: document.getElementById('copyBtn'),
    copyBtnLabel: document.getElementById('copyBtnLabel'),
    printBtn: document.getElementById('printBtn'),

    // Outputs
    displayDownPayment: document.getElementById('displayDownPayment'),
    displayTotalUpfront: document.getElementById('displayTotalUpfront'),
    displayProductPrice: document.getElementById('displayProductPrice'),
    displayLoanAmount: document.getElementById('displayLoanAmount'),

    // Dropdown Itemized Fee Ledger
    toggleLedgerBtn: document.getElementById('toggleLedgerBtn'),
    ledgerBtnLabel: document.getElementById('ledgerBtnLabel'),
    ledgerDrawer: document.getElementById('ledgerDrawer'),
    bdBajaj: document.getElementById('bdBajaj'),
    bdBank: document.getElementById('bdBank'),
    bdDealerPercent: document.getElementById('bdDealerPercent'),
    bdDealerAmt: document.getElementById('bdDealerAmt'),
    bdDbdPercent: document.getElementById('bdDbdPercent'),
    bdDbd: document.getElementById('bdDbd'),
    bdDeductionsSection: document.getElementById('bdDeductionsSection'),
    bdReplacementRow: document.getElementById('bdReplacementRow'),
    bdReplacementVal: document.getElementById('bdReplacementVal'),
    bdAdvanceRow: document.getElementById('bdAdvanceRow'),
    bdAdvanceVal: document.getElementById('bdAdvanceVal'),
    bdTotalDp: document.getElementById('bdTotalDp'),
    bdMarginRow: document.getElementById('bdMarginRow'),
    bdMarginMoney: document.getElementById('bdMarginMoney'),
    bdGrandTotalUpfront: document.getElementById('bdGrandTotalUpfront'),

    // Print Elements
    printDate: document.getElementById('printDate'),
    pPrice: document.getElementById('pPrice'),
    pRepRow: document.getElementById('pRepRow'),
    pRepVal: document.getElementById('pRepVal'),
    pAdvRow: document.getElementById('pAdvRow'),
    pAdvVal: document.getElementById('pAdvVal'),
    pNetLoan: document.getElementById('pNetLoan'),
    pBajaj: document.getElementById('pBajaj'),
    pBank: document.getElementById('pBank'),
    pDealerPct: document.getElementById('pDealerPct'),
    pDealerAmt: document.getElementById('pDealerAmt'),
    pDbdPct: document.getElementById('pDbdPct'),
    pDbdAmt: document.getElementById('pDbdAmt'),
    pDp: document.getElementById('pDp'),
    pMarginRow: document.getElementById('pMarginRow'),
    pMargin: document.getElementById('pMargin'),
    pTotalUpfront: document.getElementById('pTotalUpfront'),
    resultsSection: document.getElementById('resultsSection')
  };

  // Indian Number Formatter
  const inFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });

  function formatNumber(num) {
    if (isNaN(num) || num === null || num === undefined) return '0';
    return inFormatter.format(Math.round(num));
  }

  function parseCleanNumber(val) {
    if (!val) return 0;
    const cleanStr = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  }

  let state = {};
  let isCalculated = false;

  // =========================================================================
  // DEDUCTIONS GRID TOGGLE HELPER
  // =========================================================================

  function syncDeductionsVisibility() {
    const isRep = el.checkReplacement.checked;
    const isAdv = el.checkAdvance.checked;

    if (!isRep && !isAdv) {
      el.deductionsInputsGrid.style.display = 'none';
      el.replacementFieldWrap.style.display = 'none';
      el.advanceFieldWrap.style.display = 'none';
      el.netLoanNoticeBar.style.display = 'none';
      el.replacementAmt.value = '';
      el.advancePaymentAmt.value = '';
      return;
    }

    el.deductionsInputsGrid.style.display = 'grid';

    if (isRep && isAdv) {
      // Both selected: side by side (1 col each)
      el.replacementFieldWrap.style.display = 'block';
      el.replacementFieldWrap.classList.remove('full-width');
      el.advanceFieldWrap.style.display = 'block';
      el.advanceFieldWrap.classList.remove('full-width');
    } else if (isRep) {
      // Only Replacement selected
      el.replacementFieldWrap.style.display = 'block';
      el.replacementFieldWrap.classList.add('full-width');
      el.advanceFieldWrap.style.display = 'none';
      el.advancePaymentAmt.value = '';
    } else if (isAdv) {
      // Only Pre-Booking selected
      el.advanceFieldWrap.style.display = 'block';
      el.advanceFieldWrap.classList.add('full-width');
      el.replacementFieldWrap.style.display = 'none';
      el.replacementAmt.value = '';
    }
  }

  // =========================================================================
  // CORE CALCULATION ENGINE
  // =========================================================================

  function calculate() {
    const productPrice = parseCleanNumber(el.productPrice.value);
    const baseLoan = productPrice;

    // Separated Deductions
    const isReplacementActive = el.checkReplacement.checked;
    const isAdvanceActive = el.checkAdvance.checked;

    const replacementAmt = isReplacementActive ? parseCleanNumber(el.replacementAmt.value) : 0;
    const advancePaymentAmt = isAdvanceActive ? parseCleanNumber(el.advancePaymentAmt.value) : 0;
    const totalDeductions = replacementAmt + advancePaymentAmt;

    // Loan Amount: Deducted from base Loan Amount (Product Price); Product Price remains constant
    const netLoanAmount = Math.max(0, baseLoan - totalDeductions);

    // Update Loan Amount preview badge in deductions box
    if (isReplacementActive || isAdvanceActive) {
      el.netLoanNoticeBar.style.display = 'flex';
      el.netLoanPreviewVal.textContent = `₹${formatNumber(netLoanAmount)}`;
    } else {
      el.netLoanNoticeBar.style.display = 'none';
    }

    // Standard pre-filled charges
    const bajajCharges = parseCleanNumber(el.bajajCharges.value);
    const bankCharges = parseCleanNumber(el.bankCharges.value);

    // 1. Dealer Charges (%) applied strictly on Product Price
    const dealerPercent = parseCleanNumber(el.dealerChargesPercent.value);
    const dealerChargesAmt = Math.round(productPrice * (dealerPercent / 100));
    el.dealerAmountLiveBadge.textContent = dealerChargesAmt > 0 ? `+₹${formatNumber(dealerChargesAmt)}` : '₹0';

    // 2. DBD Coupon (%) applied strictly on Product Price (Default 0.80%)
    const dbdPercent = parseCleanNumber(el.dbdCouponPercent.value);
    const dbdCouponAmt = Math.round(productPrice * (dbdPercent / 100));
    el.dbdAmountLiveBadge.textContent = dbdCouponAmt > 0 ? `-₹${formatNumber(dbdCouponAmt)}` : '-₹0';

    // Down Payment Formula:
    // Down Payment = Bajaj Charges + Dealer Charges + Bank Charges - DBD Coupon
    const rawDp = bajajCharges + dealerChargesAmt + bankCharges - dbdCouponAmt;
    const downPayment = Math.max(0, rawDp);

    // Margin Money is 0 since base loan matches product price
    const marginMoney = 0;

    // Total Upfront to Collect at Store = Down Payment (Charges) + Pre-Booking Amount (if any)
    const totalUpfrontToCollect = downPayment + advancePaymentAmt;

    state = {
      productPrice,
      baseLoan,
      isReplacementActive,
      isAdvanceActive,
      replacementAmt,
      advancePaymentAmt,
      totalDeductions,
      netLoanAmount,
      bajajCharges,
      bankCharges,
      dealerPercent,
      dealerChargesAmt,
      dbdPercent,
      dbdCouponAmt,
      downPayment,
      marginMoney,
      totalUpfrontToCollect
    };

    if (isCalculated) {
      renderOutputs(state);
    }
  }

  // =========================================================================
  // RENDER OUTPUTS
  // =========================================================================

  function renderOutputs(s) {
    // 1. Hero Outputs
    el.displayDownPayment.textContent = formatNumber(s.downPayment);
    el.displayTotalUpfront.textContent = formatNumber(s.totalUpfrontToCollect);
    el.displayProductPrice.textContent = `₹${formatNumber(s.productPrice)}`;
    el.displayLoanAmount.textContent = `₹${formatNumber(s.netLoanAmount)}`;

    // 2. Itemized Ledger Breakdown
    el.bdBajaj.textContent = `+ ₹${formatNumber(s.bajajCharges)}`;
    el.bdBank.textContent = `+ ₹${formatNumber(s.bankCharges)}`;
    el.bdDealerPercent.textContent = `${s.dealerPercent}%`;
    el.bdDealerAmt.textContent = `+ ₹${formatNumber(s.dealerChargesAmt)}`;
    el.bdDbdPercent.textContent = `${s.dbdPercent}%`;
    el.bdDbd.textContent = `- ₹${formatNumber(s.dbdCouponAmt)}`;
    el.bdTotalDp.textContent = `₹${formatNumber(s.downPayment)}`;

    // Deductions row in breakdown
    if (s.totalDeductions > 0) {
      el.bdDeductionsSection.style.display = 'block';
      if (s.replacementAmt > 0) {
        el.bdReplacementRow.style.display = 'flex';
        el.bdReplacementVal.textContent = `- ₹${formatNumber(s.replacementAmt)}`;
      } else {
        el.bdReplacementRow.style.display = 'none';
      }

      if (s.advancePaymentAmt > 0) {
        el.bdAdvanceRow.style.display = 'flex';
        el.bdAdvanceVal.textContent = `+ ₹${formatNumber(s.advancePaymentAmt)} (Cash at POS)`;
      } else {
        el.bdAdvanceRow.style.display = 'none';
      }
    } else {
      el.bdDeductionsSection.style.display = 'none';
    }

    // Margin Money & Grand Total
    if (s.marginMoney > 0) {
      el.bdMarginRow.style.display = 'flex';
      el.bdMarginMoney.textContent = `+ ₹${formatNumber(s.marginMoney)}`;
    } else {
      el.bdMarginRow.style.display = 'none';
    }

    el.bdGrandTotalUpfront.textContent = `₹${formatNumber(s.totalUpfrontToCollect)}`;

    // 3. Update Printable Slip
    el.pPrice.textContent = `₹${formatNumber(s.productPrice)}`;
    el.pNetLoan.textContent = `₹${formatNumber(s.netLoanAmount)}`;
    el.pBajaj.textContent = `₹${formatNumber(s.bajajCharges)}`;
    el.pBank.textContent = `₹${formatNumber(s.bankCharges)}`;
    el.pDealerPct.textContent = `${s.dealerPercent}%`;
    el.pDealerAmt.textContent = `+₹${formatNumber(s.dealerChargesAmt)}`;
    el.pDbdPct.textContent = `${s.dbdPercent}%`;
    el.pDbdAmt.textContent = `-₹${formatNumber(s.dbdCouponAmt)}`;
    el.pDp.textContent = `₹${formatNumber(s.downPayment)}`;
    el.pTotalUpfront.textContent = `₹${formatNumber(s.totalUpfrontToCollect)}`;

    if (s.replacementAmt > 0) {
      el.pRepRow.style.display = 'table-row';
      el.pRepVal.textContent = `-₹${formatNumber(s.replacementAmt)}`;
    } else {
      el.pRepRow.style.display = 'none';
    }

    if (s.advancePaymentAmt > 0) {
      el.pAdvRow.style.display = 'table-row';
      el.pAdvVal.textContent = `-₹${formatNumber(s.advancePaymentAmt)}`;
    } else {
      el.pAdvRow.style.display = 'none';
    }

    if (s.marginMoney > 0) {
      el.pMarginRow.style.display = 'table-row';
      el.pMargin.textContent = `₹${formatNumber(s.marginMoney)}`;
    } else {
      el.pMarginRow.style.display = 'none';
    }

    el.printDate.textContent = `Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  }

  // =========================================================================
  // USER ACTIONS & HELPERS
  // =========================================================================

  function attachCurrencyFormatter(input, onDone) {
    input.addEventListener('blur', () => {
      const val = parseCleanNumber(input.value);
      if (val > 0) {
        input.value = formatNumber(val);
      }
      if (onDone) onDone();
    });

    input.addEventListener('input', () => {
      if (onDone) onDone();
    });
  }

  function handleCalculateClick() {
    const price = parseCleanNumber(el.productPrice.value);
    if (!price || price <= 0) {
      el.productPrice.classList.add('input-error');
      el.productPrice.focus();
      setTimeout(() => {
        el.productPrice.classList.remove('input-error');
      }, 1200);
      return;
    }

    isCalculated = true;
    calculate();
    renderOutputs(state);

    // Reveal Payment Summary
    el.resultsSection.classList.remove('hidden');
    el.resultsSection.style.display = 'block';

    // Smoothly scroll down to Payment Summary
    setTimeout(() => {
      el.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function resetForm() {
    isCalculated = false;
    el.productPrice.value = '';
    el.checkReplacement.checked = false;
    el.checkAdvance.checked = false;
    syncDeductionsVisibility();

    el.bajajCharges.value = '699';
    el.bankCharges.value = '270';
    el.dealerChargesPercent.value = '';
    el.dbdCouponPercent.value = '0.80';

    // Hide Payment Summary
    el.resultsSection.classList.add('hidden');
    el.resultsSection.style.display = 'none';

    // Reset ledger dropdown state
    el.ledgerDrawer.classList.add('hidden');
    el.toggleLedgerBtn.classList.remove('open');
    el.ledgerBtnLabel.textContent = 'View More Details';

    calculate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // WhatsApp Share
  function shareQuoteWhatsApp() {
    if (!state.productPrice) {
      alert('Please enter Product Price and calculate quotation.');
      return;
    }

    const text = [
      `*ESTIMATED QUOTATION*`,
      `📅 Date: ${new Date().toLocaleDateString('en-IN')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Product Price:* ₹${formatNumber(state.productPrice)}`,
      `💳 *Loan Amount:* ₹${formatNumber(state.netLoanAmount)}`,
      state.replacementAmt > 0 ? `✂️ *Replacement / Exchange:* -₹${formatNumber(state.replacementAmt)}` : null,
      state.advancePaymentAmt > 0 ? `💵 *Pre-Booking Amount:* ₹${formatNumber(state.advancePaymentAmt)}` : null,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*Fee Breakdown:*`,
      `• Bajaj Charges: ₹${formatNumber(state.bajajCharges)}`,
      `• Bank Charges: ₹${formatNumber(state.bankCharges)}`,
      `• Dealer Charges (${state.dealerPercent}%): +₹${formatNumber(state.dealerChargesAmt)}`,
      `• DBD Coupon (${state.dbdPercent}%): -₹${formatNumber(state.dbdCouponAmt)}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⚡ *Down Payment (Net Fee): ₹${formatNumber(state.downPayment)}*`,
      state.totalUpfrontToCollect !== state.downPayment ? `👉 *TOTAL UPFRONT PAYABLE AT POS: ₹${formatNumber(state.totalUpfrontToCollect)}*` : null,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*Note:* This site only gives estimation calculations & not the final quotation as it changes as per schemes and the downpayment value may be vary between 10 - 999.`
    ].filter(Boolean).join('\n');

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  // Copy Quote
  function copyQuoteResult() {
    if (!state.productPrice) {
      alert('Please enter Product Price and calculate quotation.');
      return;
    }

    const text = [
      `ESTIMATED QUOTATION`,
      `Product Price: ₹${formatNumber(state.productPrice)}`,
      `Loan Amount: ₹${formatNumber(state.netLoanAmount)}`,
      state.replacementAmt > 0 ? `Replacement / Exchange: -₹${formatNumber(state.replacementAmt)}` : null,
      state.advancePaymentAmt > 0 ? `Pre-Booking Amount: ₹${formatNumber(state.advancePaymentAmt)}` : null,
      `Down Payment (Net Fee): ₹${formatNumber(state.downPayment)}`,
      state.totalUpfrontToCollect !== state.downPayment ? `Total Upfront at POS: ₹${formatNumber(state.totalUpfrontToCollect)}` : null,
      `Note: This site only gives estimation calculations & not the final quotation as it changes as per schemes and the downpayment value may be vary between 10 - 999.`
    ].filter(Boolean).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        el.copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => { el.copyBtnLabel.textContent = 'Copy Quote'; }, 2000);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      el.copyBtnLabel.textContent = 'Copied!';
      setTimeout(() => { el.copyBtnLabel.textContent = 'Copy Quote'; }, 2000);
    }
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function init() {
    // 1. Separated Checkbox Listeners with Side-by-Side Sync
    el.checkReplacement.addEventListener('change', () => {
      syncDeductionsVisibility();
      calculate();
    });

    el.checkAdvance.addEventListener('change', () => {
      syncDeductionsVisibility();
      calculate();
    });

    // 2. Real-time Currency Formatter & Live Calculation Listeners
    attachCurrencyFormatter(el.productPrice, calculate);
    attachCurrencyFormatter(el.replacementAmt, calculate);
    attachCurrencyFormatter(el.advancePaymentAmt, calculate);
    attachCurrencyFormatter(el.bajajCharges, calculate);
    attachCurrencyFormatter(el.bankCharges, calculate);

    el.dealerChargesPercent.addEventListener('input', calculate);
    el.dbdCouponPercent.addEventListener('input', calculate);

    // 3. Dropdown Toggle for Itemized Ledger
    el.toggleLedgerBtn.addEventListener('click', () => {
      const isHidden = el.ledgerDrawer.classList.contains('hidden');
      if (isHidden) {
        el.ledgerDrawer.classList.remove('hidden');
        el.toggleLedgerBtn.classList.add('open');
        el.ledgerBtnLabel.textContent = 'Hide Details';
      } else {
        el.ledgerDrawer.classList.add('hidden');
        el.toggleLedgerBtn.classList.remove('open');
        el.ledgerBtnLabel.textContent = 'View More Details';
      }
    });

    // 4. Action Buttons
    el.calculateBtn.addEventListener('click', handleCalculateClick);
    el.resetBtn.addEventListener('click', resetForm);
    el.whatsappShareBtn.addEventListener('click', shareQuoteWhatsApp);
    el.copyBtn.addEventListener('click', copyQuoteResult);
    el.printBtn.addEventListener('click', () => {
      calculate();
      window.print();
    });

    // Ensure Payment Summary is hidden on initial load
    el.resultsSection.classList.add('hidden');
    el.resultsSection.style.display = 'none';
    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
