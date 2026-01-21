from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import logging

from app.routes.architectures import router as architecture_router
from app.routes.generate import router as generate_router
from app.routes.context import router as context_router
from app.routes.sampling import router as sampling_router
from app.routes.rlhf import router as rlhf_router
from app.routes.evaluate import router as eval_router
from app.routes.model_comparison import router as model_comparison_router
from app.routes.tuning import router as tuning_router


load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="LLM Architecture Lab")

@app.on_event("startup")
def startup():
    from app.database.rlhf_db import init_db
    try:
        init_db()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.exception("Database initialization failed")
        raise e

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception(f"Unhandled error at {request.url}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc)
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(architecture_router)
app.include_router(generate_router)
app.include_router(context_router)
app.include_router(sampling_router)
app.include_router(rlhf_router)
app.include_router(eval_router)
app.include_router(model_comparison_router)
app.include_router(tuning_router)


@app.get("/")
def root():
    return {"status": "Backend running"}
