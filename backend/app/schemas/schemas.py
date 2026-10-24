from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    super_admin = "super_admin"


class PostStatus(str, Enum):
    draft = "draft"
    published = "published"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.admin
    is_super_admin: bool = False


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_super_admin: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8)


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    excerpt: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=100)
    status: PostStatus = PostStatus.draft


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    excerpt: Optional[str] = Field(None, min_length=1)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[PostStatus] = None


class PostResponse(PostBase):
    id: int
    author_id: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    region: Optional[str] = Field(None, max_length=120)
    type: str = Field(..., min_length=1, max_length=50)
    message: str = Field(..., min_length=1, max_length=2000)
    guardian_confirmation: bool = True


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    company: Optional[str] = None
    region: Optional[str] = None
    type: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class InvestmentMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    organization: Optional[str] = Field(None, max_length=255)
    region: Optional[str] = Field(None, max_length=120)
    message: str = Field(..., min_length=1, max_length=2000)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MessageResponse(BaseModel):
    message: str