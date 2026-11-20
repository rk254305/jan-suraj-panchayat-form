/**
 * जन सुराज - मिशन पंचायती राज चुनाव 2027
 * प्रत्याशी आवेदन फॉर्म - Google Sheets Sync Webhook Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet where you want responses stored.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any code in the editor and PASTE this entire script.
 * 4. Click 'Save' (Ctrl + S).
 * 5. Click 'Deploy' > 'New deployment'.
 * 6. Under 'Select type', choose 'Web app'.
 * 7. Set:
 *    - Description: "Jan Suraaj Panchayat Form Receiver"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial for public web forms)
 * 8. Click 'Deploy' and authorize access.
 * 9. Copy the generated Web App URL and paste it into config.js or the app's Settings modal!
 */

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

function doPost(e) {
  return handleResponse(e);
}

function doGet(e) {
  // If GET has candidate data, record it; otherwise show status check (avoids blank rows on browser visit)
  if (e && e.parameter && (e.parameter.fullName || e.parameter.mobile || e.parameter.refId)) {
    return handleResponse(e);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'active', 
      message: 'जन सुराज पंचायती राज 2027 Webhook सक्रिय है। डेटा सुरक्षित रूप से प्राप्त करने के लिए तैयार है।' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleResponse(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('आवेदन_डेटा') || ss.getActiveSheet();
    
    // Ensure sheet has headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#F9B81B');
      headerRange.setFontWeight('bold');
      headerRange.setFontColor('#000000');
      sheet.setFrozenRows(1);
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
