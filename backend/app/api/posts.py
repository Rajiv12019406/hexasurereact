from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.crud import (
    get_post_by_slug, get_post_by_id, get_posts, get_posts_count,
    create_post, update_post, delete_post
)
from app.schemas import (
    PostCreate, PostUpdate, PostResponse, PostListResponse, PostStatus
)
from app.core.security import get_current_user, get_current_super_admin
from app.models import User as UserModel, PostStatus as ModelPostStatus


router = APIRouter()


@router.get("", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(6, ge=1, le=50),
    status: Optional[PostStatus] = Query(None),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * per_page
    posts = get_posts(db, skip, per_page, status)
    total = get_posts_count(db, status)
    total_pages = (total + per_page - 1) // per_page
    return {
        "posts": posts,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }


@router.get("/featured", response_model=List[PostResponse])
def get_featured_posts(limit: int = Query(5, ge=1, le=10), db: Session = Depends(get_db)):
    posts = get_posts(db, 0, limit, ModelPostStatus.published)
    return posts


@router.get("/{slug}", response_model=PostResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = get_post_by_slug(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post_endpoint(
    post_data: PostCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    existing = get_post_by_slug(db, post_data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    post = create_post(db, post_data, current_user.id)
    return post


@router.get("/admin/my-posts", response_model=PostListResponse)
def get_my_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    status: Optional[PostStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    skip = (page - 1) * per_page
    posts = get_posts(db, skip, per_page, status, current_user.id)
    total = get_posts_count(db, status, current_user.id)
    total_pages = (total + per_page - 1) // per_page
    return {
        "posts": posts,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }


@router.put("/{post_id}", response_model=PostResponse)
def update_post_endpoint(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and not current_user.is_super_admin:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
    updated_post = update_post(db, post_id, post_update)
    return updated_post


@router.delete("/{post_id}", response_model=dict)
def delete_post_endpoint(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and not current_user.is_super_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    success = delete_post(db, post_id)
    return {"message": "Post deleted successfully"}