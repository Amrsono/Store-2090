from passlib.context import CryptContext

def diagnostic():
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    password = "admin123"
    hashed = pwd_context.hash(password)
    print(f"Generated Hash: {hashed}")
    
    is_valid = pwd_context.verify(password, hashed)
    print(f"Verification Success: {is_valid}")
    
    # Verify the specific hash I gave the user
    user_hash = "$pbkdf2-sha256$29000$.T/nnHMOwdg7ZyxFyPk/Jw$yNEctqHdQSnzZCGbfwC5sahOVMCeL/N1Z4M4YlX5wuo"
    user_verify = pwd_context.verify(password, user_hash)
    print(f"User Hash Verification: {user_verify}")

if __name__ == "__main__":
    diagnostic()
