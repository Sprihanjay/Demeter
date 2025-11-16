# OCR Service Deployment Guide# Medical Document OCR with Google Vertex AI



This Python OCR service can be deployed to Vercel as a serverless function.This project uses Google Cloud Vision API to extract text from medical documents stored in Google Cloud Storage (GCS).



## Vercel Deployment Structure## Prerequisites



Your monorepo will have **3 Vercel projects**:- Google Cloud Project with Vision API enabled

- Service account with appropriate permissions

1. **Frontend** (`frontend/`) - Vite/React app- Python 3.7+

2. **Backend** (`backend/`) - Node.js/Express API- GCS bucket with medical documents

3. **OCR Service** (`backend/ocr/`) - Python serverless functions

## Setup Instructions

## Deploy OCR Service to Vercel

### 1. Enable Google Cloud APIs

### Step 1: Create Vercel Project

```bash

1. Go to [vercel.com/new](https://vercel.com/new)# Enable the Vision API

2. Import repository: `Sprihanjay/Demeter`gcloud services enable vision.googleapis.com

3. **Project Name**: `demeter-ocr`

4. **Framework Preset**: Other# Enable the Storage API

5. **Root Directory**: `backend/ocr`gcloud services enable storage.googleapis.com

```

### Step 2: Configure Build Settings

### 2. Create Service Account and Download Credentials

| Setting | Value |

|---------|-------|```bash

| Framework Preset | Other |# Create a service account

| Root Directory | `backend/ocr` |gcloud iam service-accounts create medical-ocr \

| Build Command | (leave empty) |    --display-name="Medical Document OCR Service"

| Output Directory | (leave empty) |

| Install Command | `pip install -r requirements.txt` |# Grant necessary permissions

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \

### Step 3: Add Environment Variables    --member="serviceAccount:medical-ocr@YOUR_PROJECT_ID.iam.gserviceaccount.com" \

    --role="roles/vision.viewer"

Go to **Settings → Environment Variables** and add:

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \

```bash    --member="serviceAccount:medical-ocr@YOUR_PROJECT_ID.iam.gserviceaccount.com" \

# Google Cloud Credentials (Base64 encoded)    --role="roles/storage.objectViewer"

GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}

# Create and download key

# Firebase Configgcloud iam service-accounts keys create ./service-account-key.json \

FIREBASE_PROJECT_ID=your-project-id    --iam-account=medical-ocr@YOUR_PROJECT_ID.iam.gserviceaccount.com

FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com```

```

### 3. Set Up Environment

**Important**: For Google credentials, you need to base64 encode your service account JSON:

```bash```bash

cat path/to/service-account.json | base64# Install dependencies

```pip install -r requirements.txt



### Step 4: Deploy# Set authentication

export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"

Click **Deploy** and wait for deployment to complete.export GOOGLE_CLOUD_PROJECT="your-project-id"

export GCS_BUCKET="your-bucket-name"

Your OCR endpoint will be available at:```

```

https://demeter-ocr.vercel.app/api/process### 4. Upload Medical Documents to GCS

```

```bash

## API Endpoint# Create the folder structure in GCS

gsutil -m cp local_documents/* gs://your-bucket-name/patient47/users/images/

### POST `/api/process````



Process OCR for a user's medical report.### 5. Run the OCR Processing



**Request:**```bash

```jsonpython ocr_medical_documents.py

{```

  "uid": "user-id-here"

}## Configuration

```

Update the following in `ocr_medical_documents.py`:

**Response:**

```json- `PROJECT_ID`: Your Google Cloud Project ID

{- `GCS_BUCKET`: Your GCS bucket name

  "full_text": "extracted text...",- `GCS_FOLDER`: Path to your medical documents (default: "patient47/users/images")

  "file_path": "path/to/file",

  "timestamp": "2025-11-16T..."## Output

}

```The script generates `ocr_results.json` containing:



## Update Backend to Use OCR Service```json

[

After deploying, update your Node.js backend (`backend/server.js`) to call the OCR service:  {

    "file_path": "patient47/users/images/document.jpg",

```javascript    "full_text": "Extracted text content...",

// Old (local Python)    "text_blocks": [

const ocrService = new OCRService("medicalDocuments");      {

        "text": "Block text",

// New (call Vercel Python function)        "confidence": 0.95,

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'https://demeter-ocr.vercel.app';        "bounding_box": [{"x": 0, "y": 0}, ...]

      }

app.post('/api/process-ocr', async (req, res) => {    ],

  const { uid } = req.body;    "total_blocks": 15,

      "error": null,

  const response = await fetch(`${OCR_SERVICE_URL}/api/process`, {    "timestamp": "2025-11-14T10:30:00"

    method: 'POST',  }

    headers: { 'Content-Type': 'application/json' },]

    body: JSON.stringify({ uid })```

  });

  ## Features

  const result = await response.json();

  res.json(result);- **Batch Processing**: Process multiple medical documents at once

});- **Confidence Scores**: Get OCR confidence for each text block

```- **Bounding Boxes**: Extract coordinates of detected text regions

- **Error Handling**: Detailed error messages for failed documents

Add to backend environment variables:- **GCS Integration**: Seamlessly read from and write to Cloud Storage

```bash- **JSON Export**: Save results in structured JSON format

OCR_SERVICE_URL=https://demeter-ocr.vercel.app

```## Supported File Formats



## Testing- JPEG (.jpg, .jpeg)

- PNG (.png)

Test the OCR endpoint:- PDF (.pdf)

```bash- TIFF (.tiff)

curl -X POST https://demeter-ocr.vercel.app/api/process \- GIF (.gif)

  -H "Content-Type: application/json" \

  -d '{"uid": "test-user-id"}'## Troubleshooting

```

### Authentication Error

## Complete Deployment OrderEnsure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly:

```bash

1. Deploy **OCR Service** → Get URLexport GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"

2. Deploy **Backend** with OCR_SERVICE_URL env var```

3. Deploy **Frontend** with backend URL

4. Remove `postinstall` from `backend/package.json`### API Not Enabled

Make sure Vision API is enabled in your Google Cloud project:
```bash
gcloud services enable vision.googleapis.com
```

### Permission Denied
Verify service account has appropriate IAM roles:
- `roles/vision.viewer`
- `roles/storage.objectViewer`

## API Reference

### MedicalDocumentOCR Class

- `__init__(project_id, gcs_bucket, gcs_folder)`: Initialize OCR processor
- `list_images_in_gcs_folder()`: List all processable images in GCS folder
- `extract_text_from_gcs_image(gcs_path)`: Extract text from a single image
- `process_all_documents()`: Process all documents in the folder
- `save_results_to_json(results, output_path)`: Save results locally
- `save_results_to_gcs(results, output_blob_name)`: Save results to GCS

## Example Usage

```python
from ocr_medical_documents import MedicalDocumentOCR

# Initialize processor
ocr = MedicalDocumentOCR(
    project_id="my-project",
    gcs_bucket="my-bucket",
    gcs_folder="patient47/users/images"
)

# Process documents
results = ocr.process_all_documents()

# Save results
ocr.save_results_to_json(results)
ocr.save_results_to_gcs(results)
```

## Notes

- The Vision API charges per image processed. Check pricing: https://cloud.google.com/vision/pricing
- PDFs are billed per page
- Consider implementing caching to avoid reprocessing documents
