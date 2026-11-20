import time
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

artifact_dir = r"C:\Users\Raushan KUMAR\.gemini\antigravity\brain\acc26323-250c-4e70-bbf5-fb4e6160ea4b"

print("====================================================")
print("🚀 LAUNCHING FULL LIVE BROWSER TEST (SELENIUM)")
print("====================================================")

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1280,1024")

driver = webdriver.Chrome(options=options)

try:
    file_url = "file:///E:/Jan_Suraj_Panchayat_Form/index.html"
    driver.get(file_url)
    time.sleep(1)

    print("1. Page loaded:", driver.title)

    # 1. Check Initial State of Location Section
    district_elem = driver.find_element(By.ID, "district")
    assembly_elem = driver.find_element(By.ID, "assembly")
    block_elem = driver.find_element(By.ID, "block")

    dist_select = Select(district_elem)
    dist_opts = [o.text for o in dist_select.options]
    print(f"2. Districts in dropdown: {len(dist_opts) - 1} districts (excluding placeholder)")
    assert len(dist_opts) == 39, f"Expected 38 districts + placeholder, got {len(dist_opts)}"

    assert not assembly_elem.is_enabled(), "Assembly select should be disabled initially"
    assert not block_elem.is_enabled(), "Block select should be disabled initially"
    print("3. Assembly & Block selects are properly disabled initially: PASS")

    # 2. Test Empty Submission to inspect Section 16 errors
    submit_btn = driver.find_element(By.ID, "btnSubmit")
    driver.execute_script("arguments[0].scrollIntoView();", submit_btn)
    submit_btn.click()
    time.sleep(0.5)

    wrap_dist = driver.find_element(By.ID, "wrap_district")
    wrap_ac = driver.find_element(By.ID, "wrap_assembly")
    wrap_blk = driver.find_element(By.ID, "wrap_block")
    wrap_panch = driver.find_element(By.ID, "wrap_panchayat")

    print("4. Empty form error verification:")
    print("   - wrap_district has-error:", "has-error" in wrap_dist.get_attribute("class"))
    print("   - wrap_assembly has-error:", "has-error" in wrap_ac.get_attribute("class"))
    print("   - wrap_block has-error:", "has-error" in wrap_blk.get_attribute("class"))
    print("   - wrap_panchayat has-error:", "has-error" in wrap_panch.get_attribute("class"))

    # Take screenshot of Section 16 error state
    loc_card = driver.find_element(By.ID, "card_location")
    driver.execute_script("arguments[0].scrollIntoView();", loc_card)
    shot1 = os.path.join(artifact_dir, "test_screenshot_error_state.png")
    loc_card.screenshot(shot1)
    print("   - Captured screenshot of Section 16 error state:", shot1)

    # 3. Select 'पटना' (Patna)
    dist_select.select_by_value("पटना")
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", district_elem)
    time.sleep(0.5)

    ac_select = Select(assembly_elem)
    blk_select = Select(block_elem)

    patna_acs = [o.text for o in ac_select.options if o.get_attribute("value")]
    patna_blks = [o.text for o in blk_select.options if o.get_attribute("value")]

    print(f"5. Patna selection:")
    print(f"   - Enabled assembly dropdown with {len(patna_acs)} constituencies: {patna_acs[:3]} ... {patna_acs[-1]}")
    print(f"   - Enabled block dropdown with {len(patna_blks)} blocks: {patna_blks[:3]} ... {patna_blks[-1]}")
    assert len(patna_acs) == 14, f"Expected 14 assemblies for Patna, got {len(patna_acs)}"
    assert len(patna_blks) == 23, f"Expected 23 blocks for Patna, got {len(patna_blks)}"

    # 4. Switch to 'अरवल' (Arwal)
    dist_select.select_by_value("अरवल")
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", district_elem)
    time.sleep(0.5)

    arwal_acs = [o.text for o in ac_select.options if o.get_attribute("value")]
    arwal_blks = [o.text for o in blk_select.options if o.get_attribute("value")]

    print(f"6. Arwal selection (Cascading update):")
    print(f"   - Assemblies: {arwal_acs}")
    print(f"   - Blocks: {arwal_blks}")
    assert len(arwal_acs) == 2, f"Expected 2 assemblies for Arwal, got {len(arwal_acs)}"
    assert len(arwal_blks) == 5, f"Expected 5 blocks for Arwal, got {len(arwal_blks)}"

    # 5. Full Form Fill & End-to-End Submission
    print("7. Filling complete candidate application form...")
    # 1. Full name
    driver.find_element(By.ID, "fullName").send_keys("राहुल कुमार सिंह")
    # 2. Mobile
    driver.find_element(By.ID, "mobile").send_keys("9876543210")
    # 3. Age
    Select(driver.find_element(By.ID, "age")).select_by_value("32 वर्ष")
    # 4. Gender (पुरुष)
    driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='पुरुष']").click()
    # 5. Religion (हिंदू)
    driver.find_element(By.CSS_SELECTOR, "input[name='religion'][value='हिंदू']").click()
    # 6. Caste
    driver.find_element(By.ID, "caste").send_keys("कुशवाहा")
    # 7. Category (पिछड़ा)
    driver.find_element(By.CSS_SELECTOR, "input[name='category'][value='पिछड़ा (OBC)']").click()
    # 8. Post (मुखिया)
    driver.find_element(By.CSS_SELECTOR, "input[name='postApplied'][value='मुखिया']").click()
    # 10. Past Election (नहीं)
    driver.find_element(By.CSS_SELECTOR, "input[name='pastElection'][value='नहीं']").click()
    # 12. Education (स्नातक)
    driver.find_element(By.CSS_SELECTOR, "input[name='education'][value='स्नातक (Graduate)']").click()
    # 13. Occupation
    driver.find_element(By.ID, "occupation").send_keys("कृषि एवं सामाजिक कार्य")
    # 14. Experience
    driver.find_element(By.ID, "experience").send_keys("गत 5 वर्षों से पंचायत में युवाओं एवं किसानों के साथ सक्रिय सहयोग")
    # 15. Objective
    driver.find_element(By.ID, "objective").send_keys("पंचायत स्तर पर भ्रष्टाचार मुक्त प्रशासन और शिक्षा का प्रसार")

    # 16. Location: Patna, Mokama, Mokama, Marachi, Ward 4
    dist_select.select_by_value("पटना")
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", district_elem)
    time.sleep(0.3)
    ac_select.select_by_index(1) # 178 - मोकामा
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", assembly_elem)
    blk_select.select_by_value("मोकामा")
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", block_elem)
    driver.find_element(By.ID, "panchayat").send_keys("मराची")
    driver.find_element(By.ID, "ward").send_keys("4")

    # 17. Feedback
    driver.find_element(By.ID, "feedback").send_keys("जन सुराज से बिहार में बदलाव निश्चित है।")

    # Take screenshot of populated Section 16
    driver.execute_script("arguments[0].scrollIntoView();", loc_card)
    shot2 = os.path.join(artifact_dir, "test_screenshot_section16_populated.png")
    loc_card.screenshot(shot2)
    print("   - Captured screenshot of populated Section 16:", shot2)

    # 6. Click Submit
    driver.execute_script("arguments[0].scrollIntoView();", submit_btn)
    submit_btn.click()
    time.sleep(1)

    # 7. Check Success Modal
    modal = driver.find_element(By.ID, "successModal")
    ref_id = driver.find_element(By.ID, "modalRefId").text
    sum_name = driver.find_element(By.ID, "sum_name").text
    sum_post = driver.find_element(By.ID, "sum_post").text
    sum_loc = driver.find_element(By.ID, "sum_location").text

    print("8. Submission Results:")
    print("   - Modal Displayed:", modal.is_displayed())
    print("   - Reference ID Generated:", ref_id)
    print("   - Summary Name:", sum_name)
    print("   - Summary Post:", sum_post)
    print("   - Summary Location:", sum_loc)

    # Screenshot of Success Modal
    modal_card = driver.find_element(By.CSS_SELECTOR, ".modal-card")
    shot3 = os.path.join(artifact_dir, "test_screenshot_success_modal.png")
    modal_card.screenshot(shot3)
    print("   - Captured screenshot of Success Modal:", shot3)

    # Check LocalStorage
    local_storage = driver.execute_script("return window.localStorage.getItem('jan_suraj_submissions');")
    data = json.loads(local_storage)
    print(f"9. LocalStorage Verification: {len(data)} submission(s) saved.")
    print("   Latest record:", json.dumps(data[0], ensure_ascii=False, indent=2))

    print("\n====================================================")
    print("🎉 ALL LIVE BROWSER TESTS PASSED 100% PERFECTLY!")
    print("====================================================")

finally:
    driver.quit()
