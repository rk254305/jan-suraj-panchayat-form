// Jan Suraaj - Panchayati Raj Election 2027 Application Form Handler

document.addEventListener('DOMContentLoaded', () => {
  initFormElements();
  setupConditionalLogic();
  setupRadioStyling();
  setupDistrictBlockCascade();
  setupSettingsModal();
  setupFormSubmission();
});

// 1. Initialize Dynamic Select Elements
function initFormElements() {
  // Populate Age (21 to 75 years)
  const ageSelect = document.getElementById('age');
  if (ageSelect) {
    for (let i = 21; i <= 75; i++) {
      const opt = document.createElement('option');
      opt.value = `${i} वर्ष`;
      opt.textContent = `${i} वर्ष`;
      ageSelect.appendChild(opt);
    }
  }

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

  // Populate Assembly Constituencies from BIHAR_ASSEMBLY_CONSTITUENCIES
  const assemblyDatalist = document.getElementById('assemblyList');
  if (assemblyDatalist && typeof BIHAR_ASSEMBLY_CONSTITUENCIES !== 'undefined') {
    BIHAR_ASSEMBLY_CONSTITUENCIES.forEach(ac => {
      const opt = document.createElement('option');
      opt.value = ac;
      assemblyDatalist.appendChild(opt);
    });
  }
}

// 2. Radio Button Visual Selection
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

// 3. Conditional Visibility Logic
function setupConditionalLogic() {
  // Post applied conditional: ZP Kshetra
  const postRadios = document.querySelectorAll('input[name="postApplied"]');
  const cardZpKshetra = document.getElementById('card_zpKshetra');
  const zpSelect = document.getElementById('zpKshetra');

  postRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'जिला परिषद सदस्य') {
        cardZpKshetra.classList.add('active');
        zpSelect.setAttribute('required', 'required');
      } else if (radio.checked) {
        cardZpKshetra.classList.remove('active');
        cardZpKshetra.classList.remove('has-error');
        zpSelect.removeAttribute('required');
        zpSelect.value = '';
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

  // Gender conditional: 8th pass note
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const optEighth = document.getElementById('opt_eighth');
  genderRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'महिला') {
        if (optEighth) optEighth.style.borderColor = '#d97706';
      } else if (radio.checked) {
        if (optEighth) optEighth.style.borderColor = '';
      }
    });
  });
}

// 4. District -> Block Cascading Dropdowns
function setupDistrictBlockCascade() {
  const distSelect = document.getElementById('district');
  const blockSelect = document.getElementById('block');

  if (!distSelect || !blockSelect) return;

  distSelect.addEventListener('change', () => {
    const selectedDist = distSelect.value;
    blockSelect.innerHTML = '';

    if (!selectedDist || typeof BIHAR_GEO_DATA === 'undefined' || !BIHAR_GEO_DATA[selectedDist]) {
      blockSelect.disabled = true;
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = '-- पहले जिला चुनें --';
      blockSelect.appendChild(defaultOpt);
      return;
    }

    blockSelect.disabled = false;
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = `-- ${selectedDist} के प्रखंड चुनें --`;
    blockSelect.appendChild(defaultOpt);

    const blocks = BIHAR_GEO_DATA[selectedDist];
    blocks.forEach(blk => {
      const opt = document.createElement('option');
      opt.value = blk;
      opt.textContent = blk;
      blockSelect.appendChild(opt);
    });

    distSelect.closest('.card')?.classList.remove('has-error');
  });

  blockSelect.addEventListener('change', () => {
    blockSelect.closest('.card')?.classList.remove('has-error');
  });
}

// 5. Settings Modal (Google Sheets Connection)
function setupSettingsModal() {
  const btnOpen = document.getElementById('btnOpenSettings');
  const modal = document.getElementById('settingsModal');
  const btnCancel = document.getElementById('btnCancelSettings');
  const btnSave = document.getElementById('btnSaveSettings');
  const inputUrl = document.getElementById('inputWebhookUrl');

  if (!btnOpen || !modal) return;

  btnOpen.addEventListener('click', () => {
    const currentUrl = localStorage.getItem('jan_suraj_sheet_url') || APP_CONFIG.GOOGLE_SHEET_WEBHOOK_URL || '';
    inputUrl.value = currentUrl;
    modal.style.display = 'flex';
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };

  btnCancel.addEventListener('click', closeModal);

  btnSave.addEventListener('click', () => {
    const val = inputUrl.value.trim();
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

// 6. Form Submission & Validation
function setupFormSubmission() {
  const form = document.getElementById('panchayatForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const spinner = document.getElementById('submitSpinner');
  const successModal = document.getElementById('successModal');
  const btnCloseModal = document.getElementById('btnCloseModal');

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

    // 3. Age
    const age = document.getElementById('age').value;
    if (!age) flagError('card_age');

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

    // 9. ZP Kshetra (if applicable)
    let zpKshetra = '';
    if (postApplied === 'जिला परिषद सदस्य') {
      zpKshetra = document.getElementById('zpKshetra').value;
      if (!zpKshetra) flagError('card_zpKshetra');
    }

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
    const assembly = document.getElementById('assembly').value.trim();
    const block = document.getElementById('block').value;
    const panchayat = document.getElementById('panchayat').value.trim();
    const ward = document.getElementById('ward').value.trim();

    if (!district || !assembly || !block || !panchayat) {
      flagError('card_location');
    }

    // Feedback
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
      age,
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
      feedback
    };

    // UI Loading state
    btnSubmit.disabled = true;
    spinner.style.display = 'block';

    // 1. Store in Local Storage (Always reliable backup)
    try {
      const existing = JSON.parse(localStorage.getItem('jan_suraj_submissions') || '[]');
      existing.unshift(submissionData);
      localStorage.setItem('jan_suraj_submissions', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Transmit to Google Sheet
    const sheetUrl = localStorage.getItem('jan_suraj_sheet_url') || APP_CONFIG.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl && sheetUrl.startsWith('http')) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Webhook
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submissionData)
        });
      } catch (err) {
        console.warn('Google Sheet submission fetch notice:', err);
      }
    }

    // End loading
    btnSubmit.disabled = false;
    spinner.style.display = 'none';

    // Show Success Modal
    showSuccessModal(submissionData);
    form.reset();
    document.querySelectorAll('.radio-option.selected').forEach(el => el.classList.remove('selected'));
    document.getElementById('card_zpKshetra').classList.remove('active');
    document.getElementById('card_pastPost').classList.remove('active');
    document.getElementById('block').disabled = true;
  });

  // Success modal controls
  function showSuccessModal(data) {
    document.getElementById('modalRefId').textContent = data.refId;
    document.getElementById('sum_name').textContent = data.fullName;
    document.getElementById('sum_mobile').textContent = data.mobile;
    document.getElementById('sum_post').textContent = data.zpKshetra ? `${data.postApplied} (${data.zpKshetra})` : data.postApplied;
    document.getElementById('sum_location').textContent = `${data.district}, प्रखंड: ${data.block}, पं: ${data.panchayat}`;

    // WhatsApp Share Link
    const waText = encodeURIComponent(
      `*जन सुराज पंचायती राज चुनाव - 2027*\n\nमैंने जन सुराज के तहत अपनी उम्मीदवारी का आवेदन सफलतापूर्वक दर्ज कर दिया है!\n\n` +
      `👤 प्रत्याशी: ${data.fullName}\n` +
      `🗳️ पद: ${data.postApplied}\n` +
      `📍 जिला: ${data.district} | प्रखंड: ${data.block}\n` +
      `🆔 आवेदन Ref ID: ${data.refId}\n\n` +
      `बिहार तब बदलेगा जब वार्ड सदस्य से लेकर मुख्यमंत्री तक अच्छे लोग चुनें जाएँगे!\n` +
      `जय बिहार, जय जन सुराज!`
    );
    document.getElementById('btnShareWhatsapp').href = `https://api.whatsapp.com/send?text=${waText}`;

    // Print Receipt
    document.getElementById('btnPrintReceipt').onclick = () => {
      window.print();
    };

    successModal.style.display = 'flex';
  }

  btnCloseModal.addEventListener('click', () => {
    successModal.style.display = 'none';
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.style.display = 'none';
  });
}
