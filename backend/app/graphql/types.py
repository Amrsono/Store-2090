import strawberry
from typing import Optional
from datetime import datetime
from enum import Enum


@strawberry.enum
class ProductCategory(Enum):
    CLOTHES = "Clothes"
    SHOES = "Shoes"
    BAGS = "Bags"
    ACCESSORIES = "Accessories"


@strawberry.enum
class ProductSize(Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


@strawberry.enum
class OrderStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


@strawberry.type
class User:
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    email_verified: bool
    created_at: datetime


@strawberry.type
class Product:
    id: int
    title: str
    description: Optional[str]
    price: float
    category: ProductCategory
    gradient: Optional[str]
    size: ProductSize
    stock: int
    image_url: Optional[str]
    is_active: bool
    created_at: datetime


@strawberry.type
class OrderItem:
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[Product]


@strawberry.type
class Order:
    id: int
    user_id: int
    total_amount: float
    status: OrderStatus
    shipping_address: Optional[str]
    payment_method: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    items: list[OrderItem]


@strawberry.type
class AuthPayload:
    access_token: str
    token_type: str
    user: User


@strawberry.input
class UserInput:
    email: str
    username: str
    password: str
    full_name: Optional[str] = None


@strawberry.input
class LoginInput:
    email: str
    password: str


@strawberry.input
class ProductInput:
    title: str
    description: Optional[str] = None
    price: float
    category: ProductCategory
    gradient: Optional[str] = None
    size: ProductSize = ProductSize.MEDIUM
    stock: int = 0
    image_url: Optional[str] = None


@strawberry.input
class OrderItemInput:
    product_id: int
    quantity: int


@strawberry.input
class OrderInput:
    items: list[OrderItemInput]
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = "Cash"
