#!/usr/bin/env python3
import sys
import time
import logging
import os

def main():
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 4:
        print("Usage: python3 smsScripts.py <country> <operator> <scriptName>")
        sys.exit(1)

    country = sys.argv[1]
    operator = sys.argv[2]
    script_name = sys.argv[3]

    # Construct the log file path dynamically based on input parameters
    log_file_name = f"{script_name}_{country}_{operator}_output.log"
    log_file_path = os.path.join(os.path.expanduser('~/Documents/instenship/Dynamic SMS Management Web Application/sms-dashboard-project/backend/scripts'), log_file_name)

    # Set up logging to a file
    logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s - %(message)s')

    logging.info("Script is starting from the testScript...")  # Changed to logging
    logging.info(f"Starting SMS session for Country: {country}, Operator: {operator}")

    # Simulate some work for sending SMS messages
    for i in range(10):
        logging.info(f"Sending SMS... {i + 1}")
        time.sleep(2)

    logging.info(f"SMS session for Country: {country}, Operator: {operator} completed.")

if __name__ == "__main__":
    main()
