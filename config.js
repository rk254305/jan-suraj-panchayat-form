/**
 * जन सुराज - कॉन्फ़िगरेशन सेटिंग्स
 * 
 * यदि आपके पास Google Apps Script Web App URL है, तो उसे नीचे GOOGLE_SHEET_WEBHOOK_URL में दर्ज करें।
 * यदि खाली छोड़ दिया जाए, तो फॉर्म ऑटोमैटिक रूप से लोकल स्टोरेज (Offline / Browser Cache) में सुरक्षित रूप से सेव होगा
 * और एडमिन पैनल से भी एक्सपोर्ट किया जा सकेगा।
 */

const APP_CONFIG = {
  // Google Apps Script Web App URL (Live connected to user Google Sheet)
  GOOGLE_SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbw0jzRvvibQBjVCoWnJm1n2rKpA3H_5j61U5_O-WTxJREQIs5PlpW0zm3Uz-4o-daj6qQ/exec",
  
  // App Title
  APP_TITLE: "जन सुराज - पंचायती राज चुनाव 2027 प्रत्याशी आवेदन",
  
  // WhatsApp Helpline or Contact
  HELPLINE_NUMBER: "919876543210",
  
  // Year
  ELECTION_YEAR: "2027"
};
