import logging
import traceback
from pathlib import Path
from typing import Any, Dict

BASE_DIR = Path(__file__).resolve().parent.parent
LOG_FILE_PATH = BASE_DIR / "logs.log"

LOG_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger("api_logger")
logger.setLevel(logging.INFO)
logger.propagate = False

# Prevent duplicate handlers during reloads
if not logger.handlers:
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s\n%(stack_trace)s\n"
    )

    # ---- File handler ----
    file_handler = logging.FileHandler(LOG_FILE_PATH)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # ---- Console handler ----
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)


def log_exception(exc: Exception, context: dict | None = None):
    stack_trace = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))

    extra: Dict[str, Any] = {"stack_trace": stack_trace}
    if context:
        extra["context"] = context

    logger.error(str(exc), extra=extra)
