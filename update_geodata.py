import json

# Complete official 243 Bihar Vidhan Sabha Constituencies mapped strictly by District
BIHAR_DISTRICT_ASSEMBLIES = {
  "पश्चिम चम्पारण": [
    "1 - वाल्मीकि नगर (Valmiki Nagar)",
    "2 - रामनगर (Ramnagar - SC)",
    "3 - नरकटियागंज (Narkatiaganj)",
    "4 - बगहा (Bagaha)",
    "5 - लौरिया (Lauriya)",
    "6 - नौतन (Nautan)",
    "7 - चनपटिया (Chanpatia)",
    "8 - बेतिया (Bettiah)",
    "9 - सिकटा (Sikta)"
  ],
  "पूर्वी चम्पारण": [
    "10 - रक्सौल (Raxaul)",
    "11 - सुगौली (Sugauli)",
    "12 - नरकटिया (Narkatia)",
    "13 - हरसिद्धि (Harsidhi - SC)",
    "14 - गोविंदगंज (Govindganj)",
    "15 - केसरिया (Kesaria)",
    "16 - कल्याणपुर (Kalyanpur)",
    "17 - पिपरा (Pipra)",
    "18 - मधुबन (Madhuban)",
    "19 - मोतिहारी (Motihari)",
    "20 - चिरैया (Chiraia)",
    "21 - ढाका (Dhaka)"
  ],
  "शिवहर": [
    "22 - शिवहर (Sheohar)"
  ],
  "सीतामढ़ी": [
    "23 - रीगा (Riga)",
    "24 - बथनाहा (Bathnaha - SC)",
    "25 - परिहार (Parihar)",
    "26 - सुरसंड (Sursand)",
    "27 - बाजपट्टी (Bajpatti)",
    "28 - सीतामढ़ी (Sitamarhi)",
    "29 - रुन्नीसैदपुर (Runnisaidpur)",
    "30 - बेलसंड (Belsand)"
  ],
  "मधुबनी": [
    "31 - हरलाखी (Harlakhi)",
    "32 - बेनीपट्टी (Benipatti)",
    "33 - खजौली (Khajauli)",
    "34 - बाबूबरही (Babubarhi)",
    "35 - बिस्फी (Bisfi)",
    "36 - मधुबनी (Madhubani)",
    "37 - राजनगर (Rajnagar - SC)",
    "38 - झंझारपुर (Jhanjharpur)",
    "39 - फुलपरास (Phulparas)",
    "40 - लौकहा (Laukaha)"
  ],
  "सुपौल": [
    "41 - निर्मली (Nirmali)",
    "42 - पिपरा (Pipra)",
    "43 - सुपौल (Supaul)",
    "44 - त्रिवेणीगंज (Triveniganj - SC)",
    "45 - छातापुर (Chhatapur)"
  ],
  "अररिया": [
    "46 - नरपतगंज (Narpatganj)",
    "47 - रानीगंज (Raniganj - SC)",
    "48 - फारबिसगंज (Forbesganj)",
    "49 - अररिया (Araria)",
    "50 - जोकीहाट (Jokihat)",
    "51 - सिकटी (Sikti)"
  ],
  "किशनगंज": [
    "52 - बहादुरगंज (Bahadurganj)",
    "53 - ठाकुरगंज (Thakurganj)",
    "54 - किशनगंज (Kishanganj)",
    "55 - कोचाधामन (Kochadhaman)"
  ],
  "पूर्णियां": [
    "56 - अमौर (Amour)",
    "57 - बायसी (Baisi)",
    "58 - कस्बा (Kasba)",
    "59 - बनमनखी (Banmankhi - SC)",
    "60 - रुपौली (Rupauli)",
    "61 - धमदाहा (Dhamdaha)",
    "62 - पूर्णिया (Purnia)"
  ],
  "कटिहार": [
    "63 - कटिहार (Katihar)",
    "64 - कदवा (Kadwa)",
    "65 - बलरामपुर (Balrampur)",
    "66 - प्राणपुर (Pranpur)",
    "67 - मनिहारी (Manihari - ST)",
    "68 - बरारी (Barari)",
    "69 - कोढ़ा (Korha - SC)"
  ],
  "मधेपुरा": [
    "70 - आलमनगर (Alamnagar)",
    "71 - बिहारीगंज (Bihariganj)",
    "72 - सिंघेश्वर (Singheshwar - SC)",
    "73 - मधेपुरा (Madhepura)"
  ],
  "सहरसा": [
    "74 - सोनबरसा (Sonbarsha - SC)",
    "75 - सहरसा (Saharsa)",
    "76 - सिमरी बख्तियारपुर (Simri Bakhtiarpur)",
    "77 - महिषी (Mahishi)"
  ],
  "दरभंगा": [
    "78 - कुशेश्वर स्थान (Kusheshwar Asthan - SC)",
    "79 - गौड़ा बौराम (Gaura Bauram)",
    "80 - बेनीपुर (Benipur)",
    "81 - अलीनगर (Alinagar)",
    "82 - दरभंगा ग्रामीण (Darbhanga Rural)",
    "83 - दरभंगा (Darbhanga)",
    "84 - हायाघाट (Hayaghat)",
    "85 - बहादुरपुर (Bahadurpur)",
    "86 - केवटी (Keoti)",
    "87 - जाले (Jale)"
  ],
  "मुजफ्फरपुर": [
    "88 - गायघाट (Gaighat)",
    "89 - औराई (Aurai)",
    "90 - मीनापुर (Minapur)",
    "91 - बोचहां (Bochahan - SC)",
    "92 - सकरा (Sakra - SC)",
    "93 - कुढ़नी (Kurhani)",
    "94 - मुजफ्फरपुर (Muzaffarpur)",
    "95 - कांटी (Kanti)",
    "96 - बरूराज (Baruraj)",
    "97 - पारू (Paroo)",
    "98 - साहेबगंज (Sahebganj)"
  ],
  "गोपालगंज": [
    "99 - बैकुंठपुर (Baikunthpur)",
    "100 - बरौली (Barauli)",
    "101 - गोपालगंज (Gopalganj)",
    "102 - कुचायकोट (Kuchaikote)",
    "103 - भोरे (Bhore - SC)",
    "104 - हथुआ (Hathua)"
  ],
  "सिवान": [
    "105 - सिवान (Siwan)",
    "106 - जीरादेई (Ziradei)",
    "107 - दरौली (Darauli - SC)",
    "108 - रघुनाथपुर (Raghunathpur)",
    "109 - दरौंदा (Daraundha)",
    "110 - बड़हरिया (Barharia)",
    "111 - गोरियाकोठी (Goriakothi)",
    "112 - महाराजगंज (Maharajganj)"
  ],
  "सारण": [
    "113 - एकमा (Ekma)",
    "114 - मांझी (Manjhi)",
    "115 - बनियापुर (Baniapur)",
    "116 - तरैया (Taraiya)",
    "117 - मढ़ौरा (Marhaura)",
    "118 - छपरा (Chapra)",
    "119 - गड़खा (Garkha - SC)",
    "120 - अमनौर (Amnour)",
    "121 - परसा (Parsa)",
    "122 - सोनपुर (Sonepur)"
  ],
  "वैशाली": [
    "123 - हाजीपुर (Hajipur)",
    "124 - लालगंज (Lalganj)",
    "125 - वैशाली (Vaishali)",
    "126 - महुआ (Mahua)",
    "127 - राजा पाकर (Raja Pakar - SC)",
    "128 - राघोपुर (Raghopur)",
    "129 - महनार (Mahnar)",
    "130 - पातेपुर (Patepur - SC)"
  ],
  "समस्तीपुर": [
    "131 - कल्याणपुर (Kalyanpur - SC)",
    "132 - वारिसनगर (Warisnagar)",
    "133 - समस्तीपुर (Samastipur)",
    "134 - उजियारपुर (Ujiarpur)",
    "135 - मोरवा (Morwa)",
    "136 - सरायरंजन (Sarairanjan)",
    "137 - मोहिउद्दीननगर (Mohiuddinnagar)",
    "138 - विभूतिपुर (Bibhutipur)",
    "139 - रोसड़ा (Rosera - SC)",
    "140 - हसनपुर (Hasanpur)"
  ],
  "बेगूसराय": [
    "141 - चेरिया बरियारपुर (Cheria Bariarpur)",
    "142 - बछवाड़ा (Bachhwara)",
    "143 - तेघड़ा (Teghra)",
    "144 - मटिहानी (Matihani)",
    "145 - साहेबपुर कमाल (Sahebpur Kamal)",
    "146 - बेगूसराय (Begusarai)",
    "147 - बखरी (Bakhri - SC)"
  ],
  "खगड़िया": [
    "148 - अलौली (Alauli - SC)",
    "149 - खगड़िया (Khagaria)",
    "150 - बेलदौर (Beldaur)",
    "151 - परबत्ता (Parbatta)"
  ],
  "भागलपुर": [
    "152 - बिहपुर (Bihpur)",
    "153 - गोपालपुर (Gopalpur)",
    "154 - पीरपैंती (Pirpainti - SC)",
    "155 - कहलगांव (Kahalgaon)",
    "156 - भागलपुर (Bhagalpur)",
    "157 - सुल्तानगंज (Sultanganj)",
    "158 - नाथनगर (Nathnagar)"
  ],
  "बांका": [
    "159 - अमरपुर (Amarpur)",
    "160 - धोरैया (Dhoraiya - SC)",
    "161 - बांका (Banka)",
    "162 - कटोरिया (Katoria - ST)",
    "163 - बेलहर (Belhar)"
  ],
  "मुंगेर": [
    "164 - तारापुर (Tarapur)",
    "165 - मुंगेर (Munger)",
    "166 - जमालपुर (Jamalpur)"
  ],
  "लखीसराय": [
    "167 - सूर्यगढ़ा (Suryagarha)",
    "168 - लखीसराय (Lakhisarai)"
  ],
  "शेखपुरा": [
    "169 - शेखपुरा (Sheikhpura)",
    "170 - बरबीघा (Barbigha)"
  ],
  "नालन्दा": [
    "171 - अस्थावां (Asthawan)",
    "172 - बिहारशरीफ (Biharsharif)",
    "173 - राजगीर (Rajgir - SC)",
    "174 - इस्लामपुर (Islampur)",
    "175 - हिलसा (Hilsa)",
    "176 - नालंदा (Nalanda)",
    "177 - हरनौत (Harnaut)"
  ],
  "पटना": [
    "178 - मोकामा (Mokama)",
    "179 - बाढ़ (Barh)",
    "180 - बख्तियारपुर (Bakhtiarpur)",
    "181 - दीघा (Digha)",
    "182 - बांकीपुर (Bankipur)",
    "183 - कुम्हरार (Kumhrar)",
    "184 - पटना साहिब (Patna Sahib)",
    "185 - फतुहा (Fatuha)",
    "186 - दानापुर (Danapur)",
    "187 - मनेर (Maner)",
    "188 - फुलवारी (Phulwari - SC)",
    "189 - मसौढ़ी (Masaurhi - SC)",
    "190 - पालीगंज (Paliganj)",
    "191 - बिक्रम (Bikram)"
  ],
  "भोजपुर": [
    "192 - संदेश (Sandesh)",
    "193 - बड़हरा (Barhara)",
    "194 - आरा (Arrah)",
    "195 - अगिआंव (Agiaon - SC)",
    "196 - तरारी (Tarari)",
    "197 - जगदीशपुर (Jagdishpur)",
    "198 - शाहपुर (Shahpur)"
  ],
  "बक्सर": [
    "199 - ब्रह्मपुर (Brahmpur)",
    "200 - बक्सर (Buxar)",
    "201 - डुमरांव (Dumraon)",
    "202 - राजपुर (Rajpur - SC)"
  ],
  "कैमूर (भभुआ)": [
    "203 - रामगढ़ (Ramgarh)",
    "204 - मोहनिया (Mohania - SC)",
    "205 - भभुआ (Bhabua)",
    "206 - चैनपुर (Chainpur)"
  ],
  "रोहतास": [
    "207 - चेनारी (Chenari - SC)",
    "208 - सासाराम (Sasaram)",
    "209 - करगहर (Kargahar)",
    "210 - दिनारा (Dinara)",
    "211 - नोखा (Nokha)",
    "212 - डेहरी (Dehri)",
    "213 - काराकाट (Karakat)"
  ],
  "अरवल": [
    "214 - अरवल (Arwal)",
    "215 - कुर्था (Kurtha)"
  ],
  "जहानाबाद": [
    "216 - जहानाबाद (Jehanabad)",
    "217 - घोसी (Ghosi)",
    "218 - मखदुमपुर (Makhdumpur - SC)"
  ],
  "औरंगाबाद": [
    "219 - गोह (Goh)",
    "220 - ओबरा (Obra)",
    "221 - नबीनगर (Nabinagar)",
    "222 - कुटुंबा (Kutumba - SC)",
    "223 - औरंगाबाद (Aurangabad)",
    "224 - रफीगंज (Rafiganj)"
  ],
  "गया": [
    "225 - गुरुआ (Gurua)",
    "226 - शेरघाटी (Sherghati)",
    "227 - इमामगंज (Imamganj - SC)",
    "228 - बाराचट्टी (Barachatti - SC)",
    "229 - बोधगया (Bodh Gaya - SC)",
    "230 - गया टाउन (Gaya Town)",
    "231 - टिकारी (Tikari)",
    "232 - बेलागंज (Belaganj)",
    "233 - अतरी (Atri)",
    "234 - वजीरगंज (Wazirganj)"
  ],
  "नवादा": [
    "235 - रजौली (Rajauli - SC)",
    "236 - हिसुआ (Hisua)",
    "237 - नवादा (Nawada)",
    "238 - गोविंदपुर (Gobindpur)",
    "239 - वारिसलीगंज (Warsaliganj)"
  ],
  "जमुई": [
    "240 - सिकंदरा (Sikandra - SC)",
    "241 - जमुई (Jamui)",
    "242 - झाझा (Jhajha)",
    "243 - चकाई (Chakai)"
  ]
}

# Load District -> Blocks mapping from BIHAR_GEO_DATA
import pandas as pd
df_ps = pd.read_csv(r'E:\Candidates\panchayat_samiti_candidates_2021.csv', usecols=['District', 'Block'], dtype=str).dropna().drop_duplicates()
dist_blocks = {}
for dist in sorted(df_ps['District'].unique()):
    blks = sorted(df_ps[df_ps['District'] == dist]['Block'].unique().tolist())
    dist_blocks[dist] = blks

js_content = '/**\n * बिहार भौगोलिक डेटा (38 जिले, 522 प्रखंड, 243 विधानसभा क्षेत्र)\n */\n\n'
js_content += 'const BIHAR_GEO_DATA = ' + json.dumps(dist_blocks, ensure_ascii=False, indent=2) + ';\n\n'
js_content += 'const BIHAR_DISTRICT_ASSEMBLIES = ' + json.dumps(BIHAR_DISTRICT_ASSEMBLIES, ensure_ascii=False, indent=2) + ';\n'

with open(r'E:\Jan_Suraj_Panchayat_Form\geoData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"geoData.js updated successfully with {len(dist_blocks)} districts, all mapped blocks, and all 243 district-specific assemblies!")
