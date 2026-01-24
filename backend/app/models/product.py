from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class ProductCategory(str, enum.Enum):
    CLOTHES = "Clothes"
    SHOES = "Shoes"
    BAGS = "Bags"
    ACCESSORIES = "Accessories"


class ProductSize(str, enum.Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(SQLEnum(ProductCategory), nullable=False, index=True)
    gradient = Column(String(100))
    size = Column(SQLEnum(ProductSize), default=ProductSize.MEDIUM)
    stock = Column(Integer, default=0)
    image_url = Column(String(500))
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")
