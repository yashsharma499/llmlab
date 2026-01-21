from fastapi import APIRouter
from app.services.architecture_service import get_architectures

router = APIRouter(prefix="/architectures", tags=["Architectures"])

@router.get("/")
def list_architectures():
    return get_architectures()