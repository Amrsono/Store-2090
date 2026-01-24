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
        
        # Import email utilities
        from app.utils.email import generate_verification_token, send_verification_email
        
        # Generate verification token
        verification_token = generate_verification_token()
        
        # Create new user
        hashed_password = get_password_hash(input.password)
        new_user = UserModel(
            email=input.email,
            username=input.username,
            hashed_password=hashed_password,
            full_name=input.full_name,
            email_verified=False,
            verification_token=verification_token
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Send verification email
        send_verification_email(new_user.email, verification_token, new_user.username)
        
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
                email_verified=new_user.email_verified,
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
                email_verified=user.email_verified,
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
            shipping_address=input.shipping_address,
            payment_method=input.payment_method
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
            payment_method=new_order.payment_method,
            created_at=new_order.created_at,
            updated_at=new_order.updated_at,
            items=[]
        )
    
    @strawberry.mutation
    def update_order_status(self, order_id: int, status: str) -> Order:
        """Update order status (admin only in production)"""
        db: Session = next(get_db())
        
        # Validate status
        valid_statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
        if status not in valid_statuses:
            raise Exception(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        # Find order
        order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            raise Exception(f"Order {order_id} not found")
        
        # Update status
        order.status = status
        db.commit()
        db.refresh(order)
        
        return Order(
            id=order.id,
            user_id=order.user_id,
            total_amount=order.total_amount,
            status=order.status,
            shipping_address=order.shipping_address,
            payment_method=order.payment_method,
            created_at=order.created_at,
            updated_at=order.updated_at,
            items=[]
        )
    
    @strawberry.mutation
    def update_user(self, user_id: int, full_name: Optional[str] = None, email: Optional[str] = None) -> User:
        """Update user information (admin only in production)"""
        db: Session = next(get_db())
        
        # Find user
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise Exception(f"User {user_id} not found")
        
        # Update fields if provided
        if full_name is not None:
            user.full_name = full_name
        if email is not None:
            # Check if email is already taken by another user
            existing = db.query(UserModel).filter(UserModel.email == email, UserModel.id != user_id).first()
            if existing:
                raise Exception("Email already in use by another user")
            user.email = email
        
        db.commit()
        db.refresh(user)
        
        return User(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_admin=user.is_admin,
            created_at=user.created_at
        )
    
    @strawberry.mutation
    def toggle_user_status(self, user_id: int) -> User:
        """Toggle user active status (admin only in production)"""
        db: Session = next(get_db())
        
        # Find user
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise Exception(f"User {user_id} not found")
        
        # Toggle status
        user.is_active = not user.is_active
        db.commit()
        db.refresh(user)
        
        return User(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_admin=user.is_admin,
            created_at=user.created_at
        )
    
    @strawberry.mutation
    def update_product(self, product_id: int, input: ProductInput) -> Product:
        """Update an existing product (admin only in production)"""
        db: Session = next(get_db())
        
        # Find product
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            raise Exception(f"Product {product_id} not found")
        
        # Update fields
        product.title = input.title
        product.description = input.description
        product.price = input.price
        product.category = input.category.value
        product.gradient = input.gradient
        product.size = input.size.value
        product.stock = input.stock
        if input.image_url:
            product.image_url = input.image_url
        
        db.commit()
        db.refresh(product)
        
        return Product(
            id=product.id,
            title=product.title,
            description=product.description,
            price=product.price,
            category=input.category,
            gradient=product.gradient,
            size=input.size,
            stock=product.stock,
            image_url=product.image_url,
            is_active=bool(product.is_active),
            created_at=product.created_at
        )
    
    @strawberry.mutation
    def delete_product(self, product_id: int) -> bool:
        """Delete a product (admin only in production)"""
        db: Session = next(get_db())
        
        # Find product
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            raise Exception(f"Product {product_id} not found")
        
        # Delete product
        db.delete(product)
        db.commit()
        
        return True
    
    @strawberry.mutation
    def verify_email(self, token: str) -> User:
        """Verify user email with verification token"""
        db: Session = next(get_db())
        
        # Find user by verification token
        user = db.query(UserModel).filter(UserModel.verification_token == token).first()
        if not user:
            raise Exception("Invalid or expired verification token")
        
        # Check if already verified
        if user.email_verified:
            raise Exception("Email already verified")
        
        # Mark as verified and clear token
        user.email_verified = True
        user.verification_token = None
        db.commit()
        db.refresh(user)
        
        # Send welcome email
        from app.utils.email import send_welcome_email
        send_welcome_email(user.email, user.username)
        
        return User(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_admin=user.is_admin,
            email_verified=user.email_verified,
            created_at=user.created_at
        )


