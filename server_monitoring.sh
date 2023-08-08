#!/bin/bash

# Email alert settings
recipient="demo@example.com"  # Replace with the recipient's email address
subject="Server Monitoring Alert"   # Replace with the subject of your email

# Thresholds for server metrics (adjust as needed)
cpu_threshold=80     # Percentage of CPU usage (e.g., 80%)
memory_threshold=80  # Percentage of memory usage (e.g., 80%)
disk_threshold=80    # Percentage of disk usage (e.g., 80%)

# Function to send email alert
send_alert() {
    local message="$1"
    echo "$message" | mail -s "$subject" "$recipient"
}

# Function to check CPU usage
check_cpu() {
    local cpu_usage
    cpu_usage=$(mpstat 1 1 | awk '$3 ~ /[0-9.]+/ {print 100 - $13}')

    if (( $(echo "$cpu_usage >= $cpu_threshold" | bc -l) )); then
        send_alert "High CPU usage detected: ${cpu_usage}%"
    fi
}

# Function to check memory usage
check_memory() {
    local memory_usage
    memory_usage=$(free | awk '/Mem/ { printf("%.2f"), $3/$2 * 100 }')

    if (( $(echo "$memory_usage >= $memory_threshold" | bc -l) )); then
        send_alert "High memory usage detected: ${memory_usage}%"
    fi
}

# Function to check disk usage
check_disk() {
    local disk_usage
    disk_usage=$(df -h | awk '$NF == "/" {print $5}' | sed 's/%//')

    if (( disk_usage >= disk_threshold )); then
        send_alert "High disk usage detected: ${disk_usage}%"
    fi
}

# Main script

# Check if the script is running with root/superuser privileges
if [ "$(id -u)" -ne 0 ]; then
    echo "This script requires root/superuser privileges to monitor server performance."
    echo "Please run the script as root or use 'sudo'."
    exit 1
fi

# Main loop to monitor server metrics
while true; do
    check_cpu
    check_memory
    check_disk
    sleep 300  # Sleep for 5 minutes before checking again (adjust as needed)
done
