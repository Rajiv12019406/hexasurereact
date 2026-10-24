from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from passlib.context import CryptContext

from app.models import User, Post, ContactMessage, UserRole, PostStatus
from app.schemas import UserCreate, UserUpdate, PostCreate, PostUpdate, PostStatus as SchemaPostStatus

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# User CRUD
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        is_super_admin=user.is_super_admin,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True


# Post CRUD
def get_post_by_slug(db: Session, slug: str) -> Optional[Post]:
    return db.query(Post).filter(Post.slug == slug, Post.status == PostStatus.published).first()


def get_post_by_id(db: Session, post_id: int) -> Optional[Post]:
    return db.query(Post).filter(Post.id == post_id).first()


def get_posts(
    db: Session, 
    skip: int = 0, 
    limit: int = 10, 
    status: Optional[PostStatus] = None,
    author_id: Optional[int] = None
) -> List[Post]:
    query = db.query(Post)
    if status:
        query = query.filter(Post.status == status)
    if author_id:
        query = query.filter(Post.author_id == author_id)
    return query.order_by(desc(Post.published_at)).offset(skip).limit(limit).all()


def get_posts_count(db: Session, status: Optional[PostStatus] = None, author_id: Optional[int] = None) -> int:
    query = db.query(func.count(Post.id))
    if status:
        query = query.filter(Post.status == status)
    if author_id:
        query = query.filter(Post.author_id == author_id)
    return query.scalar()


def create_post(db: Session, post: PostCreate, author_id: int) -> Post:
    db_post = Post(
        **post.model_dump(),
        author_id=author_id,
    )
    if post.status == SchemaPostStatus.published:
        db_post.published_at = func.now()
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def update_post(db: Session, post_id: int, post_update: PostUpdate) -> Optional[Post]:
    db_post = get_post_by_id(db, post_id)
    if not db_post:
        return None
    
    update_data = post_update.model_dump(exclude_unset=True)
    was_draft = db_post.status == PostStatus.draft
    becoming_published = update_data.get("status") == SchemaPostStatus.published
    
    for field, value in update_data.items():
        setattr(db_post, field, value)
    
    if was_draft and becoming_published:
        db_post.published_at = func.now()
    
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_post(db: Session, post_id: int) -> bool:
    db_post = get_post_by_id(db, post_id)
    if not db_post:
        return False
    db.delete(db_post)
    db.commit()
    return True


# Contact Message CRUD
def create_contact_message(db: Session, message_data: dict) -> ContactMessage:
    db_message = ContactMessage(**message_data)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_contact_messages(db: Session, skip: int = 0, limit: int = 100) -> List[ContactMessage]:
    return db.query(ContactMessage).order_by(desc(ContactMessage.created_at)).offset(skip).limit(limit).all()