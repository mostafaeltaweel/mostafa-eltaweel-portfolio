"""Build the portfolio CV from confirmed profile and project information."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parent.parent
out = root / 'output/pdf/Mostafa-Eltaweel-Resume.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=24, leading=27, textColor=HexColor('#10382e'), spaceAfter=5),
    'role': ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=11, leading=15, spaceAfter=5),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=8.4, leading=12, textColor=HexColor('#3e5049')),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=HexColor('#13765c'), spaceBefore=13, spaceAfter=6),
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=9.4, leading=13, spaceAfter=3),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.1, leading=13, spaceAfter=5),
}
story = []
def p(text, style='body'):
    story.append(Paragraph(text, styles[style]))
p('MOSTAFA MOHAMED ELTAWEEL', 'name')
p('DATA ANALYST | POWER BI, SQL &amp; APPLIED AI', 'role')
p('Giza, Egypt | +20 111 261 1898 | <link href="mailto:mostafa.eltaweel000@gmail.com">mostafa.eltaweel000@gmail.com</link>', 'contact')
p('<link href="https://www.linkedin.com/in/mostafa-eltaweel/">LinkedIn: mostafa-eltaweel</link> | <link href="https://github.com/mostafaeltaweel">GitHub: mostafaeltaweel</link> | <link href="https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/">Portfolio &amp; project demos</link>', 'contact')
p('PROFILE', 'heading')
p('Data analyst focused on financial and operational reporting, with ERP technical support experience and hands-on portfolio work in Power BI, SQL, Python and applied AI. Completed the Applied AI &amp; Data Analysis diploma at Digilians; certificate pending. Seeking a Data Analyst or Junior BI role.')
p('TECHNICAL SKILLS', 'heading')
p('<b>Analytics &amp; BI:</b> Power BI, Power Query, DAX, data modeling, KPI reporting, Excel Pivot Tables.<br/><b>SQL &amp; Python:</b> joins, aggregations, CTEs, subqueries, Pandas, NumPy, data cleaning and exploratory analysis.<br/><b>Applied AI:</b> classification, model evaluation, neural networks, computer vision and Streamlit prototypes.')
p('SELECTED PORTFOLIO PROJECTS', 'heading')
p('Financial Fraud Analytics | Power BI', 'title')
p('Built a report for exploring fraud labels in synthetic financial transactions, with KPI measures, transaction-type filters and simulation-time views. The supplied snapshot shows about 1.049 million transactions and 1,142 fraud-labeled cases.')
p('Data Professional Survey Dashboard | Power BI', 'title')
p('Created an interactive view of 630 survey responses, covering compensation by role, tool preferences, geography and career satisfaction. Includes a recorded walkthrough.')
p('Electricity Theft Detection | Python, CNN-LSTM, Streamlit', 'title')
p('Developed a prototype that combines temporal modeling and engineered consumption features in a risk-scoring interface. Demonstrates data preparation, model integration and prediction presentation; intended for portfolio evaluation.')
p('EmoLens | Computer Vision, Transfer Learning', 'title')
p('Built a facial-expression classification prototype using EfficientNet-B3 and attention, with image, camera and video interfaces. Worked on dataset deduplication and confidence calibration.')
p('PROFESSIONAL EXPERIENCE', 'heading')
p('ERP Technical Support Specialist | Dewan Soft | Jan - Sep 2025', 'title')
p('Supported ERP users with system and data issues. Prepared and cleaned business data for operational reporting, investigated inconsistencies, and worked with internal teams to clarify reporting requirements and document data workflows.')
p('CREDENTIALS &amp; EDUCATION', 'heading')
p('<b>Applied AI &amp; Data Analysis Diploma</b> | Digilians<br/>Completed; awaiting the issued certificate.')
p('<b>Microsoft Certified: Power BI Data Analyst Associate (PL-300)</b> | Jul 2026<br/><b>Google Data Analytics Professional Certificate</b> | Apr 2026')
p('<b>Bachelor of Laws</b> | Cairo University | 2022')
doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=40, leftMargin=40, topMargin=34, bottomMargin=30, title='Mostafa Eltaweel - Data Analyst', author='Mostafa Eltaweel')
doc.build(story)
print(out)
