// Jan Suraaj - Panchayati Raj Election 2027 Application Form Handler

document.addEventListener('DOMContentLoaded', () => {
  initFormElements();
  setupDobAgeCalculator();
  setupContactFields();
  setupBiodataUpload();
  setupConditionalLogic();
  setupRadioStyling();
  setupDistrictBlockCascade();
  setupSettingsModal();
  setupQrCreativeModal();
  setupSecretAdminEntry();
  setupFormSubmission();
});

// 1. Initialize Dynamic Select Elements
function initFormElements() {
  // Populate ZP Kshetra (1 to 75)
  const zpSelect = document.getElementById('zpKshetra');
  if (zpSelect) {
    for (let i = 1; i <= 75; i++) {
      const opt = document.createElement('option');
      opt.value = `क्षेत्र संख्या ${i}`;
      opt.textContent = `क्षेत्र संख्या ${i}`;
      zpSelect.appendChild(opt);
    }
  }

  // Populate Districts from BIHAR_GEO_DATA
  const distSelect = document.getElementById('district');
  if (distSelect && typeof BIHAR_GEO_DATA !== 'undefined') {
    const districts = Object.keys(BIHAR_GEO_DATA).sort();
    districts.forEach(dist => {
      const opt = document.createElement('option');
      opt.value = dist;
      opt.textContent = dist;
      distSelect.appendChild(opt);
    });
  }
}

// 2. Automated Age Calculator from Date of Birth (DOB)
function setupDobAgeCalculator() {
  const dobInput = document.getElementById('dob');
  const ageBox = document.getElementById('ageCalculationBox');
  const ageText = document.getElementById('calculatedAgeText');
  const notice = document.getElementById('eligibilityNotice');
  const hiddenAge = document.getElementById('calculatedAge');

  if (!dobInput) return;

  // Set maximum date as today (cannot be born in future)
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  dobInput.max = `${yyyy}-${mm}-${dd}`;

  dobInput.addEventListener('change', calculateAndDisplayAge);
  dobInput.addEventListener('input', calculateAndDisplayAge);

  function calculateAndDisplayAge() {
    const val = dobInput.value;
    if (!val) {
      if (ageBox) ageBox.style.display = 'none';
      if (hiddenAge) hiddenAge.value = '';
      return;
    }

    const birthDate = new Date(val);
    if (isNaN(birthDate.getTime())) {
      if (ageBox) ageBox.style.display = 'none';
      if (hiddenAge) hiddenAge.value = '';
      return;
    }

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years < 0) {
      if (ageBox) ageBox.style.display = 'none';
      if (hiddenAge) hiddenAge.value = '';
      return;
    }

    const ageFormatted = `${years} वर्ष ${months} माह`;
    if (hiddenAge) hiddenAge.value = ageFormatted;
    if (ageText) ageText.textContent = ageFormatted;

    if (ageBox) {
      ageBox.style.display = 'block';
      if (years >= 21) {
        ageBox.className = 'age-calc-box success';
        if (notice) {
          notice.innerHTML = '✅ <span style="color:#065f46; font-weight:600;">न्यूनतम 21 वर्ष की आयु योग्यता पूर्ण (चुनाव लड़ने हेतु पात्र)</span>';
        }
      } else {
        ageBox.className = 'age-calc-box warning';
        if (notice) {
          notice.innerHTML = `⚠️ <span style="color:#92400e; font-weight:600;">सूचना: पंचायती राज चुनाव नियमानुसार न्यूनतम उम्र 21 वर्ष अनिवार्य है (वर्तमान में ${years} वर्ष ${months} माह)।</span>`;
        }
      }
    }

    // Clear error
    document.getElementById('card_dob')?.classList.remove('has-error');
  }
}

// 3. Contact Fields Handler (WhatsApp & "Same as Mobile")
function setupContactFields() {
  const mobileInput = document.getElementById('mobile');
  const waInput = document.getElementById('whatsapp');
  const sameCheckbox = document.getElementById('sameAsMobile');

  if (!mobileInput || !waInput || !sameCheckbox) return;

  sameCheckbox.addEventListener('change', () => {
    if (sameCheckbox.checked) {
      waInput.value = mobileInput.value.trim();
    }
  });

  mobileInput.addEventListener('input', () => {
    if (sameCheckbox.checked) {
      waInput.value = mobileInput.value.trim();
    }
  });
}

// 4. Optional Biodata / Resume File Upload Handler
let uploadedBiodata = null; // { fileName, fileSize, fileType, dataUrl }

function setupBiodataUpload() {
  const fileInput = document.getElementById('biodataFile');
  const prompt = document.getElementById('uploadPrompt');
  const preview = document.getElementById('fileInfoPreview');
  const nameDisplay = document.getElementById('fileNameDisplay');
  const sizeDisplay = document.getElementById('fileSizeDisplay');
  const btnRemove = document.getElementById('btnRemoveFile');
  const dropZone = document.getElementById('fileDropZone');

  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag & drop support
  ['dragenter', 'dragover'].forEach(evt => {
    dropZone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropZone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });
  });

  dropZone?.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });

  btnRemove?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearBiodata();
  });

  function handleFiles(files) {
    if (!files || !files[0]) return;
    const file = files[0];

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('फाइल का आकार 5 MB से अधिक है। कृपया 5 MB से छोटी फाइल चुनें।');
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedBiodata = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        fileType: file.type,
        dataUrl: event.target.result
      };

      if (nameDisplay) nameDisplay.textContent = file.name;
      if (sizeDisplay) sizeDisplay.textContent = uploadedBiodata.fileSize;
      if (prompt) prompt.style.display = 'none';
      if (preview) preview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function clearBiodata() {
    uploadedBiodata = null;
    fileInput.value = '';
    if (prompt) prompt.style.display = 'block';
    if (preview) preview.style.display = 'none';
  }
}

// 5. Radio Button Visual Selection
function setupRadioStyling() {
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.getAttribute('name');
      document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(r => {
        const parent = r.closest('.radio-option');
        if (parent) {
          if (r.checked) {
            parent.classList.add('selected');
          } else {
            parent.classList.remove('selected');
          }
        }
      });
      // Clear error on select
      const card = radio.closest('.card');
      if (card) card.classList.remove('has-error');
    });
  });
}

// 6. Conditional Visibility Logic
function setupConditionalLogic() {
  // Post applied conditional: ZP Kshetra (Optional - NO required check)
  const postRadios = document.querySelectorAll('input[name="postApplied"]');
  const cardZpKshetra = document.getElementById('card_zpKshetra');
  const zpSelect = document.getElementById('zpKshetra');

  postRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'जिला परिषद सदस्य') {
        cardZpKshetra.classList.add('active');
        // Note: No required attribute added (as requested: optional for ZP candidate)
      } else if (radio.checked) {
        cardZpKshetra.classList.remove('active');
        cardZpKshetra.classList.remove('has-error');
        if (zpSelect) zpSelect.value = '';
      }
    });
  });

  // Past election conditional: Past post
  const pastRadios = document.querySelectorAll('input[name="pastElection"]');
  const cardPastPost = document.getElementById('card_pastPost');

  pastRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'हाँ') {
        cardPastPost.classList.add('active');
      } else if (radio.checked) {
        cardPastPost.classList.remove('active');
        cardPastPost.classList.remove('has-error');
        document.querySelectorAll('input[name="pastPost"]').forEach(r => {
          r.checked = false;
          r.closest('.radio-option')?.classList.remove('selected');
        });
      }
    });
  });
}

// 7. District -> Assembly & Block Cascading Dropdowns
function setupDistrictBlockCascade() {
  const distSelect = document.getElementById('district');
  const assemblySelect = document.getElementById('assembly');
  const blockSelect = document.getElementById('block');
  const panchayatInput = document.getElementById('panchayat');

  if (!distSelect || !assemblySelect || !blockSelect) return;

  distSelect.addEventListener('change', () => {
    const selectedDist = distSelect.value;
    
    // Clear and reset assembly dropdown
    assemblySelect.innerHTML = '';
    // Clear and reset block dropdown
    blockSelect.innerHTML = '';

    if (!selectedDist) {
      assemblySelect.disabled = true;
      const optA = document.createElement('option');
      optA.value = '';
      optA.textContent = '-- पहले जिला चुनें --';
      assemblySelect.appendChild(optA);

      blockSelect.disabled = true;
      const optB = document.createElement('option');
      optB.value = '';
      optB.textContent = '-- पहले जिला चुनें --';
      blockSelect.appendChild(optB);

      document.getElementById('wrap_district')?.classList.add('has-error');
      return;
    }

    // District selected: clear district error
    document.getElementById('wrap_district')?.classList.remove('has-error');

    // 1. Populate Assembly Constituencies strictly for this district
    const assemblies = (typeof BIHAR_DISTRICT_ASSEMBLIES !== 'undefined' && BIHAR_DISTRICT_ASSEMBLIES[selectedDist]) || [];
    assemblySelect.disabled = false;
    const defaultOptA = document.createElement('option');
    defaultOptA.value = '';
    defaultOptA.textContent = `-- ${selectedDist} की विधानसभा चुनें (${assemblies.length}) --`;
    assemblySelect.appendChild(defaultOptA);

    assemblies.forEach(ac => {
      const opt = document.createElement('option');
      opt.value = ac;
      opt.textContent = ac;
      assemblySelect.appendChild(opt);
    });

    // 2. Populate Blocks strictly for this district
    const blocks = (typeof BIHAR_GEO_DATA !== 'undefined' && BIHAR_GEO_DATA[selectedDist]) || [];
    blockSelect.disabled = false;
    const defaultOptB = document.createElement('option');
    defaultOptB.value = '';
    defaultOptB.textContent = `-- ${selectedDist} के प्रखंड चुनें (${blocks.length}) --`;
    blockSelect.appendChild(defaultOptB);

    blocks.forEach(blk => {
      const opt = document.createElement('option');
      opt.value = blk;
      opt.textContent = blk;
      blockSelect.appendChild(opt);
    });

    checkLocationCardError();
  });

  assemblySelect.addEventListener('change', () => {
    if (assemblySelect.value) {
      document.getElementById('wrap_assembly')?.classList.remove('has-error');
      checkLocationCardError();
    }
  });

  blockSelect.addEventListener('change', () => {
    if (blockSelect.value) {
      document.getElementById('wrap_block')?.classList.remove('has-error');
      checkLocationCardError();
    }
  });

  if (panchayatInput) {
    panchayatInput.addEventListener('input', () => {
      if (panchayatInput.value.trim()) {
        document.getElementById('wrap_panchayat')?.classList.remove('has-error');
        checkLocationCardError();
      }
    });
  }

  function checkLocationCardError() {
    const cardLoc = document.getElementById('card_location');
    if (!cardLoc) return;
    const hasAnySubError = cardLoc.querySelectorAll('.sub-field.has-error').length > 0;
    if (!hasAnySubError) {
      cardLoc.classList.remove('has-error');
    }
  }
}

// 8. Settings Modal (Google Sheets Connection)
function setupSettingsModal() {
  const btnOpen = document.getElementById('btnOpenSettings');
  const modal = document.getElementById('settingsModal');
  const btnCancel = document.getElementById('btnCancelSettings');
  const btnSave = document.getElementById('btnSaveSettings');
  const inputUrl = document.getElementById('inputWebhookUrl');

  if (!modal) return;

  btnOpen?.addEventListener('click', () => {
    const currentUrl = localStorage.getItem('jan_suraj_sheet_url') || (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.GOOGLE_SHEET_WEBHOOK_URL : '') || '';
    if (inputUrl) inputUrl.value = currentUrl;
    modal.style.display = 'flex';
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  btnCancel?.addEventListener('click', closeModal);

  btnSave?.addEventListener('click', () => {
    const val = inputUrl ? inputUrl.value.trim() : '';
    if (val) {
      localStorage.setItem('jan_suraj_sheet_url', val);
      alert('Google Sheet Webhook URL सफलतापूर्वक सुरक्षित कर लिया गया है!');
    } else {
      localStorage.removeItem('jan_suraj_sheet_url');
      alert('Google Sheet Webhook URL हटा दिया गया है। आवेदन लोकल स्टोरेज में सेव होंगे।');
    }
    closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// 9. Campaign Poster & QR Code Generator Modal
function setupQrCreativeModal() {
  const btnOpen = document.getElementById('btnOpenCreative');
  const bannerPill = document.getElementById('bannerQrPill');
  const modal = document.getElementById('creativeModal');
  const btnClose = document.getElementById('btnCloseCreative');
  const btnPrint = document.getElementById('btnPrintCreative');
  const btnCopy = document.getElementById('btnCopyFormLink');
  const btnShareWa = document.getElementById('btnSharePosterWa');
  const qrContainer = document.getElementById('creativeQrCode');
  const formUrlDisplay = document.getElementById('creativeFormUrl');

  if (!modal) return;

  // Determine official form public URL for QR & Poster
  const formUrl = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.FORM_URL)
    ? APP_CONFIG.FORM_URL
    : 'https://jan-suraj-panchayat-form.vercel.app/';
  if (formUrlDisplay) formUrlDisplay.textContent = formUrl;

  let qrRendered = false;

  function renderQrCode() {
    if (qrRendered || !qrContainer) return;
    qrContainer.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: formUrl,
        width: 190,
        height: 190,
        colorDark: '#0d5c3a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
      qrRendered = true;
    }
  }

  const openCreativeModal = () => {
    renderQrCode();
    modal.style.display = 'flex';
  };

  btnOpen?.addEventListener('click', openCreativeModal);
  bannerPill?.addEventListener('click', openCreativeModal);

  btnClose?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  btnPrint?.addEventListener('click', () => {
    window.print();
  });

  btnCopy?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formUrl).then(() => {
        alert('आवेदन फॉर्म लिंक कॉपी कर लिया गया है:\n' + formUrl);
      });
    } else {
      prompt('आवेदन फॉर्म लिंक कॉपी करें:', formUrl);
    }
  });

  if (btnShareWa) {
    const waPosterMsg = encodeURIComponent(
      `*जन सुराज | मिशन पंचायती राज चुनाव - 2027*\n\n` +
      `बिहार में बदलाव की राजनीति में सही और कर्मठ लोगों की भागीदारी!\n\n` +
      `मुखिया, सरपंच, वार्ड, पंचायत समिति, जिला परिषद, प्रखंड प्रमुख व चेयरमैन पद हेतु अपनी उम्मीदवारी का आवेदन इस लिंक पर दर्ज करें:\n\n` +
      `👉 ${formUrl}\n\n` +
      `सही लोग • सही सोच • सामूहिक प्रयास\nजय बिहार, जय जन सुराज!`
    );
    btnShareWa.href = `https://api.whatsapp.com/send?text=${waPosterMsg}`;
  }
}

// 10. Secret Admin Portal Entry (3 Clicks on Footer Logo or Ctrl+Shift+A)
function setupSecretAdminEntry() {
  const trigger = document.getElementById('secretAdminTrigger');
  let clickCount = 0;
  let clickTimer = null;

  trigger?.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount >= 3) {
      clickCount = 0;
      window.location.href = 'admin.html';
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1500);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });
}

// 11. Form Submission & Validation
function setupFormSubmission() {
  const form = document.getElementById('panchayatForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const spinner = document.getElementById('submitSpinner');
  const successModal = document.getElementById('successModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');

  // Input clear error listeners
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.closest('.card')?.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;
    let firstErrorCard = null;

    // Helper to flag error
    const flagError = (cardId) => {
      const card = document.getElementById(cardId);
      if (card) {
        card.classList.add('has-error');
        if (!firstErrorCard) firstErrorCard = card;
      }
      isValid = false;
    };

    // 1. Full Name
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) flagError('card_fullName');

    // 2. Mobile (10 digits)
    const mobile = document.getElementById('mobile').value.trim();
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) flagError('card_mobile');

    // Contact Details: WhatsApp & Facebook (Optional)
    const whatsapp = document.getElementById('whatsapp')?.value.trim() || '';
    const fbLink = document.getElementById('fbLink')?.value.trim() || '';

    // 3. Date of Birth (DOB) & Age
    const dob = document.getElementById('dob').value;
    const calculatedAge = document.getElementById('calculatedAge').value || '';
    if (!dob) {
      flagError('card_dob');
    }

    // 4. Gender
    const gender = form.querySelector('input[name="gender"]:checked')?.value;
    if (!gender) flagError('card_gender');

    // 5. Religion
    const religion = form.querySelector('input[name="religion"]:checked')?.value;
    if (!religion) flagError('card_religion');

    // 6. Caste
    const caste = document.getElementById('caste').value.trim();
    if (!caste) flagError('card_caste');

    // 7. Category
    const category = form.querySelector('input[name="category"]:checked')?.value;
    if (!category) flagError('card_category');

    // 8. Post Applied
    const postApplied = form.querySelector('input[name="postApplied"]:checked')?.value;
    if (!postApplied) flagError('card_postApplied');

    // 9. ZP Kshetra (Optional - NO required check, NO asterisk)
    const zpKshetra = document.getElementById('zpKshetra')?.value || '';

    // 10. Past Election
    const pastElection = form.querySelector('input[name="pastElection"]:checked')?.value;
    if (!pastElection) flagError('card_pastElection');

    // 11. Past Post (if pastElection === 'हाँ')
    let pastPost = '';
    if (pastElection === 'हाँ') {
      pastPost = form.querySelector('input[name="pastPost"]:checked')?.value;
      if (!pastPost) flagError('card_pastPost');
    }

    // 12. Education
    const education = form.querySelector('input[name="education"]:checked')?.value;
    if (!education) flagError('card_education');

    // 13. Occupation
    const occupation = document.getElementById('occupation').value.trim();
    if (!occupation) flagError('card_occupation');

    // 14. Experience
    const experience = document.getElementById('experience').value.trim();
    if (!experience) flagError('card_experience');

    // 15. Objective
    const objective = document.getElementById('objective').value.trim();
    if (!objective) flagError('card_objective');

    // 16. Location
    const district = document.getElementById('district').value;
    const assembly = document.getElementById('assembly').value;
    const block = document.getElementById('block').value;
    const panchayat = document.getElementById('panchayat').value.trim();
    const ward = document.getElementById('ward').value.trim();

    let locError = false;
    if (!district) {
      document.getElementById('wrap_district')?.classList.add('has-error');
      locError = true;
    } else {
      document.getElementById('wrap_district')?.classList.remove('has-error');
    }

    if (!assembly) {
      document.getElementById('wrap_assembly')?.classList.add('has-error');
      locError = true;
    } else {
      document.getElementById('wrap_assembly')?.classList.remove('has-error');
    }

    if (!block) {
      document.getElementById('wrap_block')?.classList.add('has-error');
      locError = true;
    } else {
      document.getElementById('wrap_block')?.classList.remove('has-error');
    }

    if (!panchayat) {
      document.getElementById('wrap_panchayat')?.classList.add('has-error');
      locError = true;
    } else {
      document.getElementById('wrap_panchayat')?.classList.remove('has-error');
    }

    if (locError) {
      flagError('card_location');
    } else {
      document.getElementById('card_location')?.classList.remove('has-error');
    }

    // 17. Biodata (Optional)
    const biodataFileName = uploadedBiodata ? uploadedBiodata.fileName : '';
    const biodataFileSize = uploadedBiodata ? uploadedBiodata.fileSize : '';

    // 18. Feedback (Optional)
    const feedback = document.getElementById('feedback').value.trim();

    if (!isValid) {
      if (firstErrorCard) {
        firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Generate Reference ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const refId = `JS-PR-2027-${randomDigits}`;
    const timestamp = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' });

    const submissionData = {
      refId,
      timestamp,
      fullName,
      mobile,
      whatsapp,
      fbLink,
      dob,
      age: calculatedAge,
      gender,
      religion,
      caste,
      category,
      postApplied,
      zpKshetra,
      pastElection,
      pastPost,
      education,
      occupation,
      experience,
      objective,
      district,
      assembly,
      block,
      panchayat,
      ward,
      biodataFileName,
      biodataFileSize,
      biodataFile: uploadedBiodata ? uploadedBiodata.dataUrl : '',
      feedback
    };

    // UI Loading state
    btnSubmit.disabled = true;
    spinner.style.display = 'block';

    // 1. Store in Local Storage (Always reliable backup)
    try {
      const existing = JSON.parse(localStorage.getItem('jan_suraj_submissions') || '[]');
      // To prevent storage quota issues if large base64 files are uploaded, store metadata and first 50KB or file name
      const storeData = { ...submissionData };
      if (storeData.biodataFile && storeData.biodataFile.length > 500000) {
        storeData.biodataFile = storeData.biodataFile.substring(0, 500000) + '...[truncated]';
      }
      existing.unshift(storeData);
      localStorage.setItem('jan_suraj_submissions', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Transmit to Google Sheet
    const sheetUrl = localStorage.getItem('jan_suraj_sheet_url') || (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.GOOGLE_SHEET_WEBHOOK_URL : '');
    let sheetSynced = false;
    if (sheetUrl && sheetUrl.startsWith('http') && !sheetUrl.includes('SAMPLE_DEPLOYMENT_URL')) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Webhook
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(submissionData)
        });
        sheetSynced = true;
      } catch (err) {
        console.warn('Google Sheet submission fetch notice:', err);
      }
    }

    // End loading
    btnSubmit.disabled = false;
    spinner.style.display = 'none';

    // Show Success Modal
    showSuccessModal(submissionData, sheetSynced, sheetUrl);
    resetFormState();
  });

  const resetFormState = () => {
    form.reset();
    document.querySelectorAll('.radio-option.selected').forEach(el => el.classList.remove('selected'));
    document.getElementById('card_zpKshetra')?.classList.remove('active');
    document.getElementById('card_pastPost')?.classList.remove('active');
    
    // Reset DOB age box
    const ageBox = document.getElementById('ageCalculationBox');
    if (ageBox) ageBox.style.display = 'none';
    const hiddenAge = document.getElementById('calculatedAge');
    if (hiddenAge) hiddenAge.value = '';

    // Reset Biodata
    uploadedBiodata = null;
    const prompt = document.getElementById('uploadPrompt');
    const preview = document.getElementById('fileInfoPreview');
    if (prompt) prompt.style.display = 'block';
    if (preview) preview.style.display = 'none';

    // Reset Assembly & Block selects
    const assemblySelect = document.getElementById('assembly');
    if (assemblySelect) {
      assemblySelect.innerHTML = '<option value="">-- पहले जिला चुनें --</option>';
      assemblySelect.disabled = true;
    }
    const blockSelect = document.getElementById('block');
    if (blockSelect) {
      blockSelect.innerHTML = '<option value="">-- पहले जिला चुनें --</option>';
      blockSelect.disabled = true;
    }

    // Clear all error states
    document.querySelectorAll('.card.has-error').forEach(c => c.classList.remove('has-error'));
    document.querySelectorAll('.sub-field.has-error').forEach(sf => sf.classList.remove('has-error'));
  };

  form.addEventListener('reset', () => {
    setTimeout(resetFormState, 10);
  });

  // Success modal controls
  function showSuccessModal(data, sheetSynced, sheetUrl) {
    document.getElementById('modalRefId').textContent = data.refId;
    document.getElementById('sum_name').textContent = data.fullName;
    document.getElementById('sum_mobile').textContent = data.mobile;

    // WhatsApp summary row
    const rowWa = document.getElementById('row_sum_wa');
    const sumWa = document.getElementById('sum_whatsapp');
    if (data.whatsapp) {
      if (rowWa) rowWa.style.display = 'flex';
      if (sumWa) sumWa.textContent = data.whatsapp;
    } else {
      if (rowWa) rowWa.style.display = 'none';
    }

    // Age / DOB summary
    const sumAge = document.getElementById('sum_age');
    if (sumAge) {
      sumAge.textContent = data.age ? `${data.age} (जन्म तिथि: ${data.dob})` : (data.dob || '-');
    }

    // Post applied
    document.getElementById('sum_post').textContent = data.zpKshetra ? `${data.postApplied} (${data.zpKshetra})` : data.postApplied;
    document.getElementById('sum_location').textContent = `${data.district}, प्रखंड: ${data.block}, पं: ${data.panchayat}`;

    // Biodata row
    const rowBio = document.getElementById('row_sum_bio');
    const sumBio = document.getElementById('sum_biodata');
    if (data.biodataFileName) {
      if (rowBio) rowBio.style.display = 'flex';
      if (sumBio) sumBio.textContent = `${data.biodataFileName} (${data.biodataFileSize})`;
    } else {
      if (rowBio) rowBio.style.display = 'none';
    }

    // Sheet Sync Status indicator
    const syncBadge = document.getElementById('syncStatusBadge');
    if (syncBadge) {
      if (sheetSynced) {
        syncBadge.style.backgroundColor = '#ecfdf5';
        syncBadge.style.color = '#065f46';
        syncBadge.style.border = '1px solid #a7f3d0';
        syncBadge.innerHTML = '🟢 <strong>Google Sheet:</strong> डेटा आपकी Google Sheet में सफलता पूर्वक भेजा गया!';
      } else {
        syncBadge.style.backgroundColor = '#fffbeb';
        syncBadge.style.color = '#92400e';
        syncBadge.style.border = '1px solid #fde68a';
        syncBadge.innerHTML = '💾 <strong>लोकल बैकअप सुरक्षित:</strong> Google Sheet में सिंक करने हेतु ऊपर ⚙️ सेटिंग्स बटन में अपना Apps Script Web App URL डालें।';
      }
    }

    // WhatsApp Share Link
    const waText = encodeURIComponent(
      `*जन सुराज पंचायती राज चुनाव - 2027*\n\nमैंने जन सुराज के तहत अपनी उम्मीदवारी का आवेदन सफलतापूर्वक दर्ज कर दिया है!\n\n` +
      `👤 प्रत्याशी: ${data.fullName}\n` +
      `🗳️ पद: ${data.postApplied}${data.zpKshetra ? ' (' + data.zpKshetra + ')' : ''}\n` +
      `📍 जिला: ${data.district} | प्रखंड: ${data.block}\n` +
      `🆔 आवेदन Ref ID: ${data.refId}\n\n` +
      `बिहार तब बदलेगा जब वार्ड सदस्य से लेकर मुख्यमंत्री तक अच्छे लोग चुनें जाएँगे!\n` +
      `जय बिहार, जय जन सुराज!`
    );
    document.getElementById('btnShareWhatsapp').href = `https://api.whatsapp.com/send?text=${waText}`;

    successModal.style.display = 'flex';
  }

  // Print Receipt
  btnPrintReceipt?.addEventListener('click', () => {
    window.print();
  });

  btnCloseModal?.addEventListener('click', () => {
    successModal.style.display = 'none';
  });

  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.style.display = 'none';
  });
}
