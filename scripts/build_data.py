"""Turns data/Financial_loan_data.xlsx into src/data.js (pre-aggregated numbers the dashboard reads).
Run this only when the Excel data changes:   python scripts/build_data.py
Render does NOT run this step; the generated src/data.js is committed to Git."""
import json, pandas as pd
df = pd.read_excel('data/Financial_loan_data.xlsx')
df['PURPOSE'] = df.PURPOSE.str.title().str.replace('_', ' ')
P = sorted(df.PURPOSE.unique()); G = list('ABCDEFG'); S = ['Fully Paid', 'Current', 'Charged Off']
H = ['Rent', 'Mortgage', 'Own', 'Other']; ST = sorted(df.ADDRESS_STATE.unique())
idx = lambda L: {v: i for i, v in enumerate(L)}
df['p'] = df.PURPOSE.map(idx(P)); df['g'] = df.GRADE.map(idx(G)); df['s'] = df.LOAN_STATUS.map(idx(S))
df['m'] = df.ISSUE_DATE.dt.month; df['t'] = (df.TERM.str.strip() == '60 months').astype(int)
df['h'] = df.HOME_OWNERSHIP.str.title().map({'Rent': 0, 'Mortgage': 1, 'Own': 2}).fillna(3).astype(int)
df['st'] = df.ADDRESS_STATE.map(idx(ST))
def rows(keys, **agg):
    t = df.groupby(keys).agg(**agg).reset_index()
    return [[round(x, 4) if isinstance(x, float) else int(x) for x in r] for r in t.values.tolist()]
M = json.load(open('data/us-map.json'))
D = dict(P=P, G=G, S=S, H=H, ST=ST, map=dict(p=M['paths'], n=M['names']),
  c=rows(['p','g','s'], n=('ID','count'), f=('LOAN_AMOUNT','sum'), r=('TOTAL_PAYMENT','sum'), i=('INT_RATE','sum'), d=('DTI','sum')),
  m=rows(['p','g','m'], n=('ID','count'), f=('LOAN_AMOUNT','sum'), r=('TOTAL_PAYMENT','sum')),
  t=rows(['p','g','t'], n=('ID','count')), h=rows(['p','g','h'], n=('ID','count')), s=rows(['p','g','st'], n=('ID','count')))
open('src/data.js', 'w', encoding='utf8').write('window.LOAN_DATA=' + json.dumps(D, separators=(',', ':')) + ';\n')
print('wrote src/data.js for', len(df), 'loans')
