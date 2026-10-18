"""Build the portfolio CV from confirmed profile and project information."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
import shutil

root = Path(__file__).resolve().parent.parent
out = root / 'output/pdf/Mostafa-Eltaweel-Resume.pdf'
assets_resume = root / 'assets/Resume.pdf'
out.parent.mkdir(parents=True, exist_ok=True)

primary = HexColor('#0d3b31')
accent = HexColor('#0f766e')
text_dark = HexColor('#1f2937')
muted = HexColor('#4b5563')

styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=18, leading=21, textColor=primary, spaceAfter=2),
    'role': ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=accent, spaceAfter=3),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=8, leading=11, textColor=muted, spaceAfter=5),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=primary, spaceBefore=7, spaceAfter=3),
    'subheading': ParagraphStyle('subheading', fontName='Helvetica-Bold', fontSize=8.8, leading=12, textColor=text_dark, spaceAfter=1),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=8.2, leading=11.2, textColor=text_dark, spaceAfter=3),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=8, leading=10.8, textColor=text_dark, leftIndent=8, spaceAfter=2),
}

story = []
def p(text, style='body'):
    story.append(Paragraph(text, styles[style]))

p('MOSTAFA MOHAMED ELTAWEEL', 'name')
p('DATA ANALYST | BUSINESS INTELLIGENCE &amp; APPLIED AI', 'role')
p('Giza, Egypt | +20 111 261 1898 | <link href="mailto:mostafa.eltaweel000@gmail.com">mostafa.eltaweel000@gmail.com</link> | <link href="https://www.linkedin.com/in/mostafa-eltaweel/">LinkedIn</link> | <link href="https://github.com/mostafaeltaweel">GitHub</link> | <link href="https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/">Live Portfolio</link>', 'contact')

p('PROFESSIONAL SUMMARY', 'heading')
p('Commercial Data Analyst and certified BI Specialist combining a background in enterprise ERP technical support and a Bachelor of Laws from Cairo University. Bridges critical evidence-based deduction and forensic metric diagnosis with advanced Power BI, SQL, Python, and autonomous AI automation. Proven track record modeling 1.05M+ financial transactions, diagnosing operational root causes for a 37% booking cancellation rate, and deploying end-to-end AI agent workflows. Holds Microsoft PL-300 and Google Data Analytics credentials.')

p('CORE COMPETENCIES &amp; MINDSET FRAMEWORK', 'heading')
p('<b>Critical &amp; Analytical Thinking:</b> Root-cause diagnostic analysis, hypothesis stress-testing, evidence-based reasoning, data storytelling.<br/>'
  '<b>Business Intelligence &amp; Analytics:</b> Microsoft Power BI Desktop, DAX (Time Intelligence, iterators), Power Query ETL, Star Schema Data Modeling, KPI Reporting, Excel (Advanced, Financial &amp; Operational Systems).<br/>'
  '<b>SQL &amp; Data Engineering:</b> Complex Joins, CTEs, Window Functions, Aggregations, Data Cleaning &amp; Normalization, Schema Design.<br/>'
  '<b>Applied AI &amp; Rapid Prototyping:</b> Python, Pandas, NumPy, Scikit-learn, PyTorch, Computer Vision (CNN-LSTM, TrOCR), Streamlit Cloud Deployment.<br/>'
  '<b>Automation &amp; Autonomous Agents:</b> n8n Workflow Automation, Groq LLM API, Webhooks, REST APIs, JSON structuring, Google Sheets CRM.')

p('FEATURED TECHNICAL PROJECTS', 'heading')

p('Hotel Booking Performance &amp; Cancellation Diagnostics | Power BI, SQL, DAX', 'subheading')
p('• Diagnosed 119k+ reservations across City and Resort hotels to uncover operational drivers behind a 37% cancellation rate.<br/>'
  '• Formulated time-intelligence DAX measures isolating lead-time volatility (&gt;90-day bookings had 2x cancellation likelihood) and distribution channel dependencies (OTA vs Direct).<br/>'
  '• Authored SQL data transformations and built an interactive executive dashboard with targeted policy recommendations to protect peak occupancy.', 'bullet')

p('Financial Fraud Analytics at Scale | Power BI &amp; Financial Risk Modeling', 'subheading')
p('• Modeled 1.05M synthetic transactions to identify high-risk anomaly patterns across 1,142 confirmed fraud cases (0.11% occurrence).<br/>'
  '• Proved that 100% of fraud instances were concentrated in TRANSFER and CASH_OUT channels, creating filtered risk views that reduce manual transaction review hours for audit teams.', 'bullet')

p('Autonomous AI Lead Qualification &amp; CRM Agent | n8n, Groq API, Google Sheets', 'subheading')
p('• Architected a 4-pipeline autonomous n8n workflow system capturing inbound sales inquiries across Telegram and Gmail.<br/>'
  '• Integrated Groq LLM with prompt constraints to parse client intent, urgency, and budget into schema-validated JSON.<br/>'
  '• Automated instant Telegram push notifications for high-priority leads and synchronized records to Google Sheets Mini CRM, cutting lead response latency from hours to under 30 seconds.', 'bullet')

p('Electricity Theft Detection System | Python, CNN-LSTM, Streamlit', 'subheading')
p('• Engineered a hybrid deep learning model combining 2D-CNN spatial consumption signatures with LSTM temporal anomaly modeling to detect meter tampering.<br/>'
  '• Built and cloud-deployed an interactive Streamlit application enabling utility inspection teams to prioritize high-risk field inspections based on probabilistic scoring.', 'bullet')

p('RxHand-AI: Prescription Recognition &amp; Structuring | PyTorch, TrOCR, Streamlit', 'subheading')
p('• Designed an open-vocabulary handwritten text recognition pipeline using Vision Transformers (TrOCR) to transcribe cursive physician notes.<br/>'
  '• Structured unstructured clinical outputs into standardized JSON schemas with confidence scoring and human-in-the-loop review.', 'bullet')

p('PROFESSIONAL EXPERIENCE', 'heading')
p('ERP Technical Support Specialist | Dewan Soft | Jan 2025 - Sep 2025', 'subheading')
p('• Supported enterprise users with relational database and workflow issues, preserving data integrity across accounting and inventory modules.<br/>'
  '• Cleaned, normalized, and extracted operational business data to fulfill departmental reporting and management dashboard requirements.<br/>'
  '• Collaborated across departments to document data workflows, clarify business metric definitions, and eliminate reporting discrepancies.', 'bullet')

p('CREDENTIALS &amp; EDUCATION', 'heading')
p('<b>Microsoft Certified: Power BI Data Analyst Associate (PL-300)</b> | Jul 2026<br/>'
  '<b>Google Data Analytics Professional Certificate</b> | Apr 2026<br/>'
  '<b>Applied AI &amp; Data Analysis Diploma</b> | Digilians (Completed; awaiting certificate issuance)<br/>'
  '<b>Bachelor of Laws (LL.B.)</b> | Cairo University (2022)')

doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=36, leftMargin=36, topMargin=26, bottomMargin=22, title='Mostafa Eltaweel - Data Analyst Resume', author='Mostafa Eltaweel')
doc.build(story)

# Also sync to assets/Resume.pdf
shutil.copyfile(out, assets_resume)
print(f'Resume generated successfully: {out}')
