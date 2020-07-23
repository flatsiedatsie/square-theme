""" API handler."""


import functools
import json
import os
from time import sleep
import datetime
import subprocess


try:
    from gateway_addon import APIHandler, APIResponse
    #print("succesfully loaded APIHandler and APIResponse from gateway_addon")
except:
    print("Import APIHandler and APIResponse from gateway_addon failed. Use at least WebThings Gateway version 0.10")

print = functools.partial(print, flush=True)


class SquareThemeAPIHandler(APIHandler):
    """Power settings API handler."""

    def __init__(self, verbose=False):
        """Initialize the object."""
        #print("INSIDE API HANDLER INIT")
        try:
            manifest_fname = os.path.join(
                os.path.dirname(__file__),
                '..',
                'manifest.json'
            )            
            #self.adapter = adapter
            #print("ext: self.adapter = " + str(self.adapter))

            with open(manifest_fname, 'rt') as f:
                manifest = json.load(f)

            APIHandler.__init__(self, manifest['id'])
            self.manager_proxy.add_api_handler(self)
            
            self.DEBUG = False
            
            if self.DEBUG:
                print("self.manager_proxy = " + str(self.manager_proxy))
                print("Created new API HANDLER: " + str(manifest['id']))
        except Exception as e:
            print("Failed to init UX extension API handler: " + str(e))
        
        

    def handle_request(self, request):
        """
        Handle a new API request for this handler.

        request -- APIRequest object
        """
        
        try:
        
            if request.method != 'POST':
                return APIResponse(status=404)
            
            if request.path == '/init' or request.path == '/set-time' or request.path == '/set-ntp' or request.path == '/shutdown' or request.path == '/reboot':

                try:
                    if request.path == '/init':
                        response = {}
                        
                        if self.DEBUG:
                            print("Initialising")
                        try:
                            now = datetime.datetime.now()
                            current_ntp_state = True
                        
                            try:
                                for line in run_command("timedatectl show").splitlines():
                                    if self.DEBUG:
                                        print(line)
                                    if line.startswith( 'NTP=no' ):
                                        current_ntp_state = False
                            except Exception as ex:
                                print("Error getting NTP status: " + str(ex))
                            
                            
                            response = {'hours':now.hour,'minutes':now.minute,'ntp':current_ntp_state}
                            if self.DEBUG:
                                print("Init response: " + str(response))
                        except Exception as ex:
                            print("Init error: " + str(ex))
                        
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps(response),
                        )
                        
                    
                    elif request.path == '/set-time':
                        try:
                            self.set_time(str(request.body['hours']),request.body['minutes'])
                            return APIResponse(
                              status=200,
                              content_type='application/json',
                              content=json.dumps("Time set"),
                            )
                        except Exception as ex:
                            print("Error setting time: " + str(ex))
                            return APIResponse(
                              status=200,
                              content_type='application/json',
                              content=json.dumps("Error while setting time: " + str(ex)),
                            )
                            
                        

                        
                    elif request.path == '/set-ntp':
                        print("New NTP state = " + str(request.body['ntp']))
                        self.set_ntp_state(request.body['ntp'])
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps("Changed Network Time state to " + str(request.body['ntp'])),
                        )
                
                    elif request.path == '/shutdown':
                        self.shutdown()
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps("Shutting down"),
                        )
                
                    elif request.path == '/reboot':
                        self.reboot()
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps("Restarting"),
                        )
                        
                except Exception as ex:
                    print(str(ex))
                    
            else:
                return APIResponse(status=404)
                
        except Exception as e:
            print("Failed to handle UX extension API request: " + str(e))
        
        
    def set_time(self, hours, minutes, seconds=0):
        print("Setting the new time")
        
        if hours.isdigit() and minutes.isdigit():
            
            the_date = str(datetime.datetime.now().strftime('%Y-%m-%d'))
        
            time_command = "sudo date --set '" + the_date + " "  + str(hours) + ":" + str(minutes) + ":00'"
            print("new set date command: " + str(time_command))
        
            try:
                os.system(time_command) 
            except Exception as e:
                print("Error setting new time: " + str(e))


    def set_ntp_state(self,new_state):
        print("Setting NTP state")
        try:
            if new_state:
                os.system('sudo timedatectl set-ntp on') 
                print("Network time turned on")
            else:
                os.system('sudo timedatectl set-ntp off') 
                print("Network time turned off")
        except Exception as e:
            print("Error changing NTP state: " + str(e))


    def shutdown(self):
        print("Shutting down gateway")
        try:
            os.system('sudo shutdown now') 
        except Exception as e:
            print("Error shutting down: " + str(e))


    def reboot(self):
        print("Rebooting gateway")
        try:
            os.system('sudo reboot') 
        except Exception as e:
            print("Error rebooting: " + str(e))



    def unload(self):
        if self.DEBUG:
            print("Shutting down adapter")
        os.system('sudo timedatectl set-ntp on') # If add-on is removed or disabled, re-enable network time protocol.



def run_command(cmd, timeout_seconds=60):
    try:
        
        p = subprocess.run(cmd, timeout=timeout_seconds, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, universal_newlines=True)

        if p.returncode == 0:
            return p.stdout  + '\n' + "Command success" #.decode('utf-8')
            #yield("Command success")
        else:
            if p.stderr:
                return "Error: " + str(p.stderr)  + '\n' + "Command failed"   #.decode('utf-8'))

    except Exception as e:
        print("Error running Arduino CLI command: "  + str(e))
        