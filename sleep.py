import os
import time

time.sleep(5)
os.system('sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 5050')

