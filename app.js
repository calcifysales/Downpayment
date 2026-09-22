/**
 * Bajaj Finserv EMI Down Payment Calculator
 * Clean, Simple & Mobile-Friendly Controller
 */

(function () {
  'use strict';

  // DOM Elements
  const el = {
    productPrice: document.getElementById('productPrice'),
    loanAmount: document.getElementById('loanAmount'),
    bajajCharges: document.getElementById('bajajCharges'),
    bankCharges: document.getElementById('bankCharges'),
    dealerChargesPercent: document.getElementById('dealerChargesPercent'),
    dbdCoupon: document.getElementById('dbdCoupon'),
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Output Section
    outputSection: document.getElementById('outputSection'),
    displayDownPayment: document.getElementById('displayDownPayment'),
    displayProductPrice: document.getElementById('displayProductPrice'),
    displayLoanAmount: document.getElementById('displayLoanAmount'),

    // Breakdown Collapsible
    toggleBreakdownBtn: document.getElementById('toggleBreakdownBtn'),
    breakdownBtnText: document.getElementById('breakdownBtnText'),
    breakdownDrawer: document.getElementById('breakdownDrawer'),
    bdBajaj: document.getElementById('bdBajaj'),
    bdBank: document.getElementById('bdBank'),
    bdDealerPercent: document.getElementById('bdDealerPercent'),
    bdDealerAmt: document.getElementById('bdDealerAmt'),
    bdDbd: document.getElementById('bdDbd'),
    bdTotalDp: document.getElementById('bdTotalDp'),
    bdMarginRow: document.getElementById('bdMarginRow'),
    bdMarginMoney: document.getElementById('bdMarginMoney'),
    bdTotalUpfrontRow: document.getElementById('bdTotalUpfrontRow'),
    bdTotalUpfront: document.getElementById('bdTotalUpfront'),

    // Share & Copy
    whatsappShareBtn: document.getElementById('whatsappShareBtn'),
    copyBtn: document.getElementById('copyBtn'),
    copyBtnLabel: document.getElementById('copyBtnLabel')
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

  let currentResult = null;

  // Perform Calculation
  function calculate() {
    const productPrice = parseCleanNumber(el.productPrice.value);
    const loanAmount = parseCleanNumber(el.loanAmount.value);

    // If both Product Price and Loan Amount are empty, keep output hidden
    if (productPrice === 0 && loanAmount === 0) {
      el.outputSection.classList.add('hidden');
      return;
    }

    const bajajCharges = parseCleanNumber(el.bajajCharges.value);
    const bankCharges = parseCleanNumber(el.bankCharges.value);
    const dealerPercent = parseCleanNumber(el.dealerChargesPercent.value);
    const dbdCoupon = parseCleanNumber(el.dbdCoupon.value);

    // Dealer Charges applied on Loan Amount
    const dealerAmt = Math.round(loanAmount * (dealerPercent / 100));

    // Down Payment Formula: Bajaj Charges + Dealer Charges + Bank Charges - DBD Coupon
    const rawDp = bajajCharges + dealerAmt + bankCharges - dbdCoupon;
    const downPayment = Math.max(0, rawDp);

    // Margin Money: difference if Loan < Product Price
    const marginMoney = Math.max(0, productPrice - loanAmount);
    const totalUpfront = marginMoney + downPayment;

    currentResult = {
      productPrice,
      loanAmount,
      bajajCharges,
      bankCharges,
      dealerPercent,
      dealerAmt,
      dbdCoupon,
      downPayment,
      marginMoney,
      totalUpfront
    };

    renderOutputs(currentResult);
    el.outputSection.classList.remove('hidden');
  }

  // Render values to UI
  function renderOutputs(res) {
    // 1. Primary Clean Outputs
    el.displayDownPayment.textContent = formatNumber(res.downPayment);
    el.displayProductPrice.textContent = `₹${formatNumber(res.productPrice)}`;
    el.displayLoanAmount.textContent = `₹${formatNumber(res.loanAmount)}`;

    // 2. Itemized Breakdown Details (Hidden inside toggle)
    el.bdBajaj.textContent = `₹${formatNumber(res.bajajCharges)}`;
    el.bdBank.textContent = `₹${formatNumber(res.bankCharges)}`;
    el.bdDealerPercent.textContent = `${res.dealerPercent}%`;
    el.bdDealerAmt.textContent = `₹${formatNumber(res.dealerAmt)}`;
    el.bdDbd.textContent = `- ₹${formatNumber(res.dbdCoupon)}`;
    el.bdTotalDp.textContent = `₹${formatNumber(res.downPayment)}`;

    if (res.marginMoney > 0) {
      el.bdMarginRow.style.display = 'flex';
      el.bdMarginMoney.textContent = `+ ₹${formatNumber(res.marginMoney)}`;
      el.bdTotalUpfrontRow.style.display = 'flex';
      el.bdTotalUpfront.textContent = `₹${formatNumber(res.totalUpfront)}`;
    } else {
      el.bdMarginRow.style.display = 'none';
      el.bdTotalUpfrontRow.style.display = 'none';
    }
  }

  // Format currency on blur or input
  function attachCurrencyFormatter(input) {
    input.addEventListener('blur', () => {
      const val = parseCleanNumber(input.value);
      if (val > 0) {
        input.value = formatNumber(val);
      }
    });

    input.addEventListener('input', () => {
      // If user is actively typing in Product Price and Loan Amount, auto calculate if both have values
      const price = parseCleanNumber(el.productPrice.value);
      const loan = parseCleanNumber(el.loanAmount.value);
      if (price > 0 && loan > 0) {
        calculate();
      }
    });
  }

  // Reset inputs
  function resetAll() {
    el.productPrice.value = '';
    el.loanAmount.value = '';
    el.bajajCharges.value = '699';
    el.bankCharges.value = '270';
    el.dealerChargesPercent.value = '';
    el.dbdCoupon.value = '';
    
    // Hide output
    el.outputSection.classList.add('hidden');
    
    // Reset breakdown accordion
    el.breakdownDrawer.classList.add('hidden');
    el.toggleBreakdownBtn.classList.remove('open');
    el.breakdownBtnText.textContent = 'View Itemized Charge Breakdown';
    currentResult = null;
  }

  // Share via WhatsApp
  function shareQuote() {
    if (!currentResult) return;
    const text = [
      `*CALCIFY_BAJAJ FINANCE - EMI QUOTATION*`,
      `📦 Product Price: ₹${formatNumber(currentResult.productPrice)}`,
      `💳 Loan Amount: ₹${formatNumber(currentResult.loanAmount)}`,
      `⚡ *DOWN PAYMENT: ₹${formatNumber(currentResult.downPayment)}*`,
      currentResult.marginMoney > 0 ? `💰 Total Upfront (incl. Margin): ₹${formatNumber(currentResult.totalUpfront)}` : null,
      `_Calculated via Calcify_Bajaj Finance._`
    ].filter(Boolean).join('\n');

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  // Copy Result
  function copyResult() {
    if (!currentResult) return;
    const text = [
      `CALCIFY_BAJAJ FINANCE - EMI DOWN PAYMENT`,
      `Product Price: ₹${formatNumber(currentResult.productPrice)}`,
      `Loan Amount: ₹${formatNumber(currentResult.loanAmount)}`,
      `Down Payment: ₹${formatNumber(currentResult.downPayment)}`,
      currentResult.marginMoney > 0 ? `Total Upfront: ₹${formatNumber(currentResult.totalUpfront)}` : null
    ].filter(Boolean).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        el.copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => {
          el.copyBtnLabel.textContent = 'Copy Result';
        }, 2000);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      el.copyBtnLabel.textContent = 'Copied!';
      setTimeout(() => {
        el.copyBtnLabel.textContent = 'Copy Result';
      }, 2000);
    }
  }

  // Init
  function init() {
    attachCurrencyFormatter(el.productPrice);
    attachCurrencyFormatter(el.loanAmount);
    attachCurrencyFormatter(el.bajajCharges);
    attachCurrencyFormatter(el.bankCharges);
    attachCurrencyFormatter(el.dbdCoupon);

    el.dealerChargesPercent.addEventListener('input', () => {
      const price = parseCleanNumber(el.productPrice.value);
      const loan = parseCleanNumber(el.loanAmount.value);
      if (price > 0 && loan > 0) {
        calculate();
      }
    });

    // Calculate Button
    el.calculateBtn.addEventListener('click', () => {
      calculate();
      if (!el.outputSection.classList.contains('hidden')) {
        el.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Reset Button
    el.resetBtn.addEventListener('click', resetAll);

    // Toggle Itemized Breakdown
    el.toggleBreakdownBtn.addEventListener('click', () => {
      const isHidden = el.breakdownDrawer.classList.contains('hidden');
      if (isHidden) {
        el.breakdownDrawer.classList.remove('hidden');
        el.toggleBreakdownBtn.classList.add('open');
        el.breakdownBtnText.textContent = 'Hide Itemized Charge Breakdown';
      } else {
        el.breakdownDrawer.classList.add('hidden');
        el.toggleBreakdownBtn.classList.remove('open');
        el.breakdownBtnText.textContent = 'View Itemized Charge Breakdown';
      }
    });

    // WhatsApp & Copy
    el.whatsappShareBtn.addEventListener('click', shareQuote);
    el.copyBtn.addEventListener('click', copyResult);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
