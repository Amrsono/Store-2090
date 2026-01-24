import strawberry
from typing import List, Optional
from sqlalchemy.orm import Session
from app.graphql.types import Product, User, Order, ProductCategory
from app.models import Product as ProductModel, User as UserModel, Order as OrderModel
from app.database import get_db


@strawberry.type
class Query:
    @strawberry.field
    def products(
        self,
        category: Optional[ProductCategory] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Product]:
        """Get all products with optional filtering"""
        db: Session = next(get_db())
        query = db.query(ProductModel).filter(ProductModel.is_active == True)
        
        if category:
            query = query.filter(ProductModel.category == category.value)
        
        products = query.offset(offset).limit(limit).all()
        
        return [
            Product(
                id=p.id,
                title=p.title,
                description=p.description,
                price=p.price,
                category=ProductCategory[p.category.name],
                gradient=p.gradient,
                size=p.size,
                stock=p.stock,
                image_url=p.image_url,
                is_active=bool(p.is_active),
                created_at=p.created_at
            )
            for p in products
        ]
    
    @strawberry.field
    def product(self, id: int) -> Optional[Product]:
        """Get a single product by ID"""
        db: Session = next(get_db())
        product = db.query(ProductModel).filter(ProductModel.id == id).first()
        
        if not product:
            return None
        
        return Product(
            id=product.id,
            title=product.title,
            description=product.description,
            price=product.price,
            category=ProductCategory[product.category.name],
            gradient=product.gradient,
            size=product.size,
            stock=product.stock,
            image_url=product.image_url,
            is_active=bool(product.is_active),
            created_at=product.created_at
        )
    
    @strawberry.field
    def user(self, id: int) -> Optional[User]:
        """Get user by ID (requires authentication in production)"""
        db: Session = next(get_db())
        user = db.query(UserModel).filter(UserModel.id == id).first()
        
        if not user:
            return None
        
        return User(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_admin=user.is_admin,
            created_at=user.created_at
        )
    
    @strawberry.field
    def my_orders(self, user_id: int) -> List[Order]:
        """Get orders for a user (requires authentication in production)"""
        db: Session = next(get_db())
        orders = db.query(OrderModel).filter(OrderModel.user_id == user_id).all()
        
        return [
            Order(
                id=o.id,
                user_id=o.user_id,
                total_amount=o.total_amount,
                status=o.status,
                shipping_address=o.shipping_address,
                created_at=o.created_at,
                items=[]  # Would populate with order items
            )
            for o in orders
        ]
