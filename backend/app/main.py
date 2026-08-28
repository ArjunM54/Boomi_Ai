import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.endpoints import router as api_router
from app.utils.seed import generate_parcel_data, generate_demo_images

app = FastAPI(
    title="BhoomiAI API",
    description="AI-Powered GIS Intelligence for Smarter Land Governance (SIH26014)",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files for Output Overlays and Sample Aerial Imagery
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
IMAGERY_DIR = os.path.join(BASE_DIR, "sample-data", "imagery")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(IMAGERY_DIR, exist_ok=True)

app.mount("/static/output", StaticFiles(directory=os.path.join(STATIC_DIR, "output")), name="static_output")
app.mount("/static/imagery", StaticFiles(directory=IMAGERY_DIR), name="static_imagery")

# Mount API routes
app.include_router(api_router)

@app.on_event("startup")
def startup_event():
    print("Initializing BhoomiAI Synthetic Dataset & Imagery...")
    try:
        generate_parcel_data()
        generate_demo_images()
        print("BhoomiAI Backend Startup Complete.")
    except Exception as e:
        print(f"Error seeding data on startup: {e}")

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "system": "BhoomiAI - AI-Powered GIS Intelligence Platform",
        "problem_statement": "SIH26014",
        "demo_target_parcel": "P-00102 (Survey No: 102/3A)"
    }
