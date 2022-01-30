import logging

# color codes for different colors

NORMAL = "\x1b[38;20m"
HEADER = "\033[95m"
OKBLUE = "\033[94m"
OKCYAN = "\033[96m"
OKGREEN = "\033[92m"
WARNING = "\033[93m"
FAIL = "\033[91m"
ENDC = "\033[0m"
BOLD = "\033[1m"
UNDERLINE = "\033[4m"
RED = "\x1b[31;20m"


class CustomFormatter(logging.Formatter):
    yellow = "\x1b[33;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format = " - %(message)s"

    FORMATS = {
        logging.DEBUG: NORMAL + "[~]" + format + reset,
        logging.INFO: BOLD + "[*]" + format + reset,
        logging.WARNING: WARNING + "[!]" + format + reset,
        logging.ERROR: BOLD + RED + "[#]" + format + reset,
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)
