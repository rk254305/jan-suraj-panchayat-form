/**
 * जन सुराज - मिशन पंचायती राज चुनाव 2027
 * प्रत्याशी आवेदन फॉर्म - Google Sheets Sync Webhook Script
 * 
 * 27 कॉलम - नए मेनू एवं संपूर्ण फ़ील्ड्स के साथ:
 * 1. Timestamp
 * 2. आवेदन संदर्भ संख्या (Ref ID)
 * 3. आवेदक का पूरा नाम
 * 4. मोबाइल नंबर
 * 5. व्हाट्सएप नंबर
 * 6. फेसबुक लिंक
 * 7. जन्म तिथि (DOB)
 * 8. उम्र (वर्ष व माह)
 * 9. लिंग
 * 10. धर्म
 * 11. जाति
 * 12. वर्ग (Category)
 * 13. चुनाव लड़ने का पद (मुखिया, सरपंच, वार्ड, पंचायत समिति, जिला परिषद, प्रखंड प्रमुख, चेयरमैन)
 * 14. जिला परिषद क्षेत्र संख्या (ऐच्छिक)
 * 15. पूर्व में चुनाव लड़े हैं?
 * 16. पूर्व में लड़े गए पद
 * 17. शैक्षणिक योग्यता
 * 18. वर्तमान व्यवसाय
 * 19. सामाजिक एवं राजनीतिक अनुभव
 * 20. चुनाव लड़ने का प्रमुख उद्देश्य
 * 21. जिला
 * 22. विधानसभा
 * 23. प्रखंड
 * 24. पंचायत
 * 25. वार्ड संख्या
 * 26. बायोडाटा फाइल
 * 27. अपनी राय
 */

// Target Google Sheet ID (User's Google Sheet: https://docs.google.com/spreadsheets/d/1gkYyqhc04suUydoU_I-5Ia2EJtbW__Dc53D-EHwmHjs/edit)
const TARGET_SPREADSHEET_ID = "1gkYyqhc04suUydoU_I-5Ia2EJtbW__Dc53D-EHwmHjs";

const HEADERS = [
  'Timestamp',
  'आवेदन संदर्भ संख्या (Ref ID)',
  'आवेदक का पूरा नाम',
  'मोबाइल नंबर',
  'व्हाट्सएप नंबर',
  'फेसबुक लिंक',
  'जन्म तिथि (DOB)',
  'उम्र (वर्ष व माह)',
  'लिंग',
  'धर्म',
  'जाति',
  'वर्ग',
  'चुनाव लड़ने का पद',
  'जिला परिषद क्षेत्र संख्या',
  'पूर्व में चुनाव लड़े हैं?',
  'पूर्व में लड़े गए पद',
  'शैक्षणिक योग्यता',
  'वर्तमान व्यवसाय',
  'सामाजिक एवं राजनीतिक अनुभव',
  'चुनाव लड़ने का प्रमुख उद्देश्य',
  'जिला',
  'विधानसभा',
  'प्रखंड',
  'पंचायत',
  'वार्ड संख्या',
  'बायोडाटा फाइल',
  'अपनी राय'
];

/**
 * Google Sheet UI Menu Setup
 * शीट खोलते ही ऊपर मेनू बार में '🌟 जन सुराज 2027' मेनू प्रकट होगा।
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🌟 जन सुराज 2027')
      .addItem('🔄 नए मेनू व हेडर अपडेट करें (27 कॉलम)', 'setupSheetHeaders')
      .addItem('📊 कुल आवेदनों के आँकड़े देखें', 'showQuickStats')
      .addToUi();
  } catch (err) {
    console.warn('onOpen UI note:', err);
  }
}

/**
 * 1-क्लिक से हेडर और शीट फ़ॉर्मेटिंग को नए मेनू अनुसार सेट करें
 */
function setupSheetHeaders(targetSheet) {
  let sheet = targetSheet;
  if (!sheet) {
    const ss = getSpreadsheet();
    sheet = ss.getSheetByName('आवेदन_डेटा') || ss.getActiveSheet();
  }

  // Row 1 में सभी 27 नए हेडर डालें
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);

  // जन सुराज आधिकारिक थीम स्टाइलिंग
  headerRange.setBackground('#F9B81B');       // जन सुराज ब्रैंड पीला
  headerRange.setFontColor('#000000');       // बोल्ड काला टेक्स्ट
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);

  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  return sheet;
}

function showQuickStats() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('आवेदन_डेटा') || ss.getActiveSheet();
  const totalRows = Math.max(0, sheet.getLastRow() - 1);
  SpreadsheetApp.getUi().alert(
    'जन सुराज पंचायती राज 2027',
    'कुल प्राप्त आवेदन: ' + totalRows + '\nसभी 27 कॉलम सक्रिय हैं।',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function getSpreadsheet() {
  try {
    if (TARGET_SPREADSHEET_ID) {
      return SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
    }
  } catch (e) {}
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  return handleResponse(e);
}

function doGet(e) {
  // Action to remotely trigger headers update
  if (e && e.parameter && (e.parameter.action === 'updateHeaders' || e.parameter.action === 'setup')) {
    const sheet = setupSheetHeaders();
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Google Sheet headers updated with 27 columns successfully!',
        columns: HEADERS.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // If GET has candidate data, record it; otherwise show status check
  if (e && e.parameter && (e.parameter.fullName || e.parameter.mobile || e.parameter.refId)) {
    return handleResponse(e);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'active', 
      message: 'जन सुराज पंचायती राज 2027 Webhook सक्रिय है। 27 कॉलम डेटा प्राप्त करने के लिए तैयार है।' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleResponse(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('आवेदन_डेटा') || ss.getActiveSheet();
    
    // Check if headers need setup or update
    const lastCol = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();
    if (lastRow === 0 || lastCol < HEADERS.length) {
      setupSheetHeaders(sheet);
    } else {
      const firstCell = sheet.getRange(1, 1).getValue();
      if (!firstCell || firstCell === '') {
        setupSheetHeaders(sheet);
      }
    }

    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        try {
          data = JSON.parse(decodeURIComponent(e.postData.contents));
        } catch (e2) {
          data = e.parameter || {};
        }
      }
    } else if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    }

    // Guard: Do not write empty row if no name, mobile, or district is present
    if (!data.fullName && !data.mobile && !data.district) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'ignored', 
          message: 'कोई डेटा प्राप्त नहीं हुआ (रिक्त आवेदन)।' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    const refId = data.refId || 'JS-' + Math.floor(100000 + Math.random() * 900000);

    const biodataInfo = data.biodataFileName 
      ? (data.biodataFileName + (data.biodataFileSize ? ' (' + data.biodataFileSize + ')' : ''))
      : '';

    // 27 Column Structure strictly aligned with HEADERS
    const row = [
      timestamp,
      refId,
      data.fullName || '',
      data.mobile || '',
      data.whatsapp || '',
      data.fbLink || '',
      data.dob || '',
      data.age || '',
      data.gender || '',
      data.religion || '',
      data.caste || '',
      data.category || '',
      data.postApplied || '',
      data.zpKshetra || '',
      data.pastElection || '',
      data.pastPost || '',
      data.education || '',
      data.occupation || '',
      data.experience || '',
      data.objective || '',
      data.district || '',
      data.assembly || '',
      data.block || '',
      data.panchayat || '',
      data.ward || '',
      biodataInfo,
      data.feedback || ''
    ];

    sheet.appendRow(row);

    // Apply clean formatting to data row
    const newRowIdx = sheet.getLastRow();
    const rowRange = sheet.getRange(newRowIdx, 1, 1, row.length);
    rowRange.setVerticalAlignment('middle');
    rowRange.setFontSize(10);
    sheet.setRowHeight(newRowIdx, 28);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'आवेदन सफलतापूर्वक दर्ज कर लिया गया है।',
        refId: refId,
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
