import pandas as pd
import json

df_ps = pd.read_csv(r'E:\Candidates\panchayat_samiti_candidates_2021.csv', usecols=['District', 'Block'], dtype=str).dropna().drop_duplicates()
dist_blocks = {}
for dist in sorted(df_ps['District'].unique()):
    blks = sorted(df_ps[df_ps['District'] == dist]['Block'].unique().tolist())
    dist_blocks[dist] = blks

df_mla = pd.read_csv(r'E:\bihar_vidhan_sabha_mlas.csv')
vs_list = [f"{r['cons_no']} - {r['cons_name']}" for _, r in df_mla.iterrows()]

content = 'const BIHAR_GEO_DATA = ' + json.dumps(dist_blocks, ensure_ascii=False, indent=2) + ';\n\n'
content += 'const BIHAR_ASSEMBLY_CONSTITUENCIES = ' + json.dumps(vs_list, ensure_ascii=False, indent=2) + ';\n'

with open(r'E:\Jan_Suraj_Panchayat_Form\geoData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated geoData.js with districts, blocks, and 243 Vidhan Sabha constituencies.')
