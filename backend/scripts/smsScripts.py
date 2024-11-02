#!/usr/bin/env python3
import sys
import time
import logging
import os

# Construct the log file path dynamically
log_file_path = os.path.expanduser('~/Documents/instenship/Dynamic SMS Management Web Application/sms-dashboard-project/backend/scripts/sms_output.log')

# Set up logging to a file
logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s - %(message)s')

def main():
    logging.info("Script is starting from the smsScript...")  # Changed to logging

    if len(sys.argv) != 3:
        logging.error("Usage: python3 smsScripts.py <country> <operator>")
        print("Usage error")  # Debugging line
        sys.exit(1)

    country = sys.argv[1]
    operator = sys.argv[2]

    logging.info(f"Starting SMS session for Country: {country}, Operator: {operator}")

    # Simulate some work for sending SMS messages
    for i in range(10):
        logging.info(f"Sending SMS... {i + 1}")
        time.sleep(2)

    logging.info(f"SMS session for Country: {country}, Operator: {operator} completed.")

if __name__ == "__main__":
    main()
