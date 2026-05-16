
import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("Success! App imported.")
except Exception as e:
    print(f"FAILED to import app: {e}")
    import traceback
    traceback.print_exc()
