from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from auth.utils import get_password_hash
from typing import Dict, Any
import sqlalchemy.exc
import logging

logger = logging.getLogger("bisqit")


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def save_user_circuit(db: Session, user_id: int, circuit_data: Dict[str, Any]):
    try:
        db_user = get_user(db, user_id)
        if db_user:
            try:
                db_user.saved_circuit = circuit_data
                db.commit()
                db.refresh(db_user)
                logger.info(f"Successfully saved circuit for user {user_id}")
                return db_user
            except sqlalchemy.exc.SQLAlchemyError as e:
                db.rollback()
                logger.error(f"Database error when saving circuit: {str(e)}")
                return None
        return None
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error saving circuit: {str(e)}")
        return None


def get_user_circuit(db: Session, user_id: int):
    try:
        db_user = get_user(db, user_id)
        if db_user:
            # Check if saved_circuit exists and has the expected structure
            if db_user.saved_circuit and isinstance(db_user.saved_circuit, dict):
                if "circuit" in db_user.saved_circuit and "qubits" in db_user.saved_circuit:
                    logger.info(f"Successfully retrieved circuit for user {user_id}")
                    return db_user.saved_circuit
                else:
                    logger.warning(f"Saved circuit for user {user_id} has invalid format")
            # Return None if circuit doesn't exist or has incorrect format
            return None
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching circuit: {str(e)}")
        return None
