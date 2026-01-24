import strawberry
from typing import Optional
from sqlalchemy.orm import Session
from app.graphql.types import (
    User, Product, Order, AuthPayload,
    UserInput, LoginInput, ProductInput, OrderInput
)
from app.models import (
    User as UserModel,
    Product as ProductModel,
    Order as OrderModel,
    OrderItem as OrderItemModel
)
from app.database import get_db
from app.utils.auth import get_password_hash, verify_password, create_access_token


@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, input: UserInput) -> AuthPayload:
        """Register a new user"""
        db: Session = next(get_db())
        
        # Check if user exists
        existing_user = db.query(UserModel).filter(
            (UserModel.email == input.email) | (UserModel.username == input.username)
        ).first()
        
        if existing_user:
            raise Exception("User with this email or username already exists")
        
        # Create new user
        hashed_password = get_password_hash(input.password)
        new_user = UserModel(
            email=input.email,
            username=input.username,
            hashed_password=hashed_password,
            full_name=input.full_name
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        access_token = create_access_token(data={"sub": new_user.email})
        
        return AuthPayload(
            access_token=access_token,
            token_type="bearer",
            user=User(
                id=new_user.id,
                email=new_user.email,
                username=new_user.username,
                full_name=new_user.full_name,
                is_active=new_user.is_active,
                is_admin=new_user.is_admin,
                created_at=new_user.created_at
            )
        )
    
    @strawberry.mutation
    def login(self, input: LoginInput) -> AuthPayload:
        """Login user and return JWT token"""
        db: Session = next(get_db())
        
        # Find user
        user = db.query(UserModel).filter(UserModel.email == input.email).first()
        
        if not user or not verify_password(input.password, user.hashed_password):
            raise Exception("Incorrect email or password")
        
        if not user.is_active:
            raise Exception("User account is inactive")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        return AuthPayload(
            access_token=access_token,
            token_type="bearer",
            user=User(
                id=user.id,
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                is_active=user.is_active,
                is_admin=user.is_admin,
                created_at=user.created_at
            )
        )
    
    @strawberry.mutation
    def create_product(self, input: ProductInput) -> Product:
        """Create a new product (admin only in production)"""
        db: Session = next(get_db())
        
        new_product = ProductModel(
            title=input.title,
            description=input.description,
            price=input.price,
            category=input.category.value,
            gradient=input.gradient,
            size=input.size.value,
            stock=input.stock,
            image_url=input.image_url
        )
        
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        
        return Product(
            id=new_product.id,
            title=new_product.title,
            description=new_product.description,
            price=new_product.price,
            category=input.category,
            gradient=new_product.gradient,
            size=input.size,
            stock=new_product.stock,
            image_url=new_product.image_url,
            is_active=bool(new_product.is_active),
            created_at=new_product.created_at
        )
    
    @strawberry.mutation
    def create_order(self, input: OrderInput, user_id: int) -> Order:
        """Create a new order (requires authentication in production)"""
        db: Session = next(get_db())
        
        # Calculate total
        total_amount = 0.0
        order_items = []
        
        for item_input in input.items:
            product = db.query(ProductModel).filter(ProductModel.id == item_input.product_id).first()
            if not product:
                raise Exception(f"Product {item_input.product_id} not found")
            
            if product.stock < item_input.quantity:
                raise Exception(f"Insufficient stock for {product.title}")
            
            total_amount += product.price * item_input.quantity
            order_items.append({
                "product_id": product.id,
                "quantity": item_input.quantity,
                "price": product.price
            })
        
        # Create order
        new_order = OrderModel(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=input.shipping_address
        )
        
        db.add(new_order)
        db.flush()
        
        # Create order items
        for item_data in order_items:
            order_item = OrderItemModel(
                order_id=new_order.id,
                **item_data
            )
            db.add(order_item)
            
            # Update product stock
            product = db.query(ProductModel).filter(ProductModel.id == item_data["product_id"]).first()
            product.stock -= item_data["quantity"]
        
        db.commit()
        db.refresh(new_order)
        
        return Order(
            id=new_order.id,
            user_id=new_order.user_id,
            total_amount=new_order.total_amount,
            status=new_order.status,
            shipping_address=new_order.shipping_address,
            created_at=new_order.created_at,
            items=[]
        )
