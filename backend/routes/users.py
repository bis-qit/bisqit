from fastapi import APIRouter, Depends

from schemas.user import User as UserSchema
from auth.dependencies import get_current_active_user
from models.user import User as UserModel

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me", response_model=UserSchema)
def get_current_user(current_user: UserModel = Depends(get_current_active_user)):
    """
    Get current logged in user's information
    """
    return current_user
