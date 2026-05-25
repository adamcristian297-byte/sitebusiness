import sys
from pathlib import Path

# Add the backend directory to the Python path so `from server import app` works
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from server import app  # noqa: E402
