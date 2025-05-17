from flask import Flask, request, jsonify, send_file
import requests
from io import BytesIO
from openai import OpenAI
import fitz  # PyMuPDF
from flask_cors import CORS
import os
from dotenv import load_dotenv
from docx import Document
from fpdf import FPDF
import boto3
from botocore.exceptions import NoCredentialsError

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    raise ValueError("Missing OPENAI_API_KEY environment variable")

app = Flask(__name__)
CORS(app)
client = OpenAI()
my_model = "gpt-4o"

PROMPT = """
הטקסט הבא הוא תמלול של ישיבת צוות. 
נתח את התוכן ותחזיר לי תבנית מסודרת שתכלול:

סיכום כללי של הישיבה (פסקה קצרה)
מסקנות עיקריות שהועלו
חלוקה לספרינטים עם משימות מוגדרות (סדר כרונולוגי)
תחזיר את התשובה כמחרוזת אחת ברורה ומסודרת
"""

PDF_OUTPUT_PATH = "summary.pdf"
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

def download_file(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.content

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def extract_text_from_docx(file_bytes):
    doc = Document(BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def query_ai(text):
    response = client.chat.completions.create(
        model=my_model,
        messages=[
            {"role": "system", "content": "אתה מנתח תמלולי פגישות צוות"},
            {"role": "user", "content": f"{PROMPT}\n\nהתמלול הוא:\n{text}"}
        ]
    )
    return response.choices[0].message.content.strip()

def save_to_pdf(text, output_path=PDF_OUTPUT_PATH):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font("DejaVu", "", "DejaVuSans.ttf", uni=True)
    pdf.set_font("DejaVu", size=12)
    pdf.set_auto_page_break(auto=True, margin=15)
    lines = text.split('\n')
    for line in lines:
        pdf.multi_cell(0, 10, line, align='R')
    pdf.output(output_path)

def upload_file_to_s3(file_path, bucket_name, object_name, content_type="application/pdf"):
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )
    try:
        with open(file_path, "rb") as file:
            s3.upload_fileobj(
                Fileobj=file,
                Bucket=bucket_name,
                Key=object_name,
                ExtraArgs={"ContentType": content_type}
            )
        return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
    except NoCredentialsError:
        raise RuntimeError("Missing AWS credentials")

@app.route("/generate", methods=["POST"])
def process_file():
    data = request.json
    file_url = data.get("file_url")

    if not file_url:
        return jsonify({"error": "Missing file_url"}), 400

    try:
        file_bytes = download_file(file_url)

        if ".pdf" in file_url.lower():
            text = extract_text_from_pdf(file_bytes)
        elif ".docx" in file_url.lower():
            text = extract_text_from_docx(file_bytes)
        else:
            return jsonify({"error": "Unsupported file type. Only PDF or DOCX are allowed."}), 400

        if not text:
            return jsonify({"error": "Could not extract any text from the document."}), 400

        result = query_ai(text)
        save_to_pdf(result)

        # העלאה ל-S3
        object_name = f"summaries/summary_{os.path.basename(file_url).split('.')[0]}.pdf"
        s3_url = upload_file_to_s3(PDF_OUTPUT_PATH, BUCKET_NAME, object_name)

        return jsonify({
            "message": "Analysis complete",
            "s3_url": s3_url,
            "summary": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
