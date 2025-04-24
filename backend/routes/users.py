from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from schemas.user import User as UserSchema, CircuitSaveRequest
from auth.dependencies import get_current_active_user
from models.user import User as UserModel
from models.database import get_db
from repositories import users as users_repository
from typing import Dict, Any
import logging

logger = logging.getLogger("bisqit")

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


@router.post("/save-circuit", response_model=UserSchema)
def save_circuit(
    circuit_data: CircuitSaveRequest,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Save a circuit for the current logged-in user
    """
    # Combine circuit and qubits into a single saved_circuit object
    saved_circuit = {
        "circuit": circuit_data.circuit,
        "qubits": circuit_data.qubits
    }
    
    updated_user = users_repository.save_user_circuit(db, current_user.id, saved_circuit)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return updated_user


@router.get("/circuit", response_model=Dict[str, Any])
def get_circuit(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get the saved circuit for the current logged-in user
    """
    circuit = users_repository.get_user_circuit(db, current_user.id)
    if not circuit:
        logger.info(f"No saved circuit found for user {current_user.id}")
        # Return an empty circuit instead of 404 to prevent frontend errors
        return {
            "circuit": {
                "gates": []
            },
            "qubits": [
                {"id": "default-qubit-0", "index": 0},
                {"id": "default-qubit-1", "index": 1}
            ]
        }
    return circuit
