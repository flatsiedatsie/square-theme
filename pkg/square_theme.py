"""Square Theme API handler."""


import os
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))
import json
import time
from time import sleep
import requests
import threading

try:
    from gateway_addon import APIHandler, APIResponse, Database
    #print("succesfully loaded APIHandler and APIResponse from gateway_addon")
except:
    print("Import APIHandler and APIResponse from gateway_addon failed. Use at least WebThings Gateway version 0.10")
    sys.exit(1)



_TIMEOUT = 3

_CONFIG_PATHS = [
    os.path.join(os.path.expanduser('~'), '.webthings', 'config'),
]

if 'WEBTHINGS_HOME' in os.environ:
    _CONFIG_PATHS.insert(0, os.path.join(os.environ['WEBTHINGS_HOME'], 'config'))




class SquareThemeAPIHandler(APIHandler):
    """Followers API handler."""

    def __init__(self, verbose=False):
        """Initialize the object."""
        #print("INSIDE API HANDLER INIT")
        
        
        self.addon_name = 'square-theme'
        self.running = True

        self.server = 'http://127.0.0.1:8080'
        self.DEBUG = False
            

        
        # LOAD CONFIG
        try:
            self.add_from_config()
        except Exception as ex:
            print("Error loading config: " + str(ex))
        
        #self.DEBUG = True
        
        
        # Paths
        # Get persistent data
        try:
            self.persistence_file_path = os.path.join(self.user_profile['dataDir'], self.addon_name, 'persistence.json')
            if not os.path.isdir(self.persistence_file_path):
                os.mkdir(self.persistence_file_path)
        except:
            try:
                if self.DEBUG:
                    print("setting persistence file path failed, will try older method.")
                self.persistence_file_path = os.path.join(os.path.expanduser('~'), '.webthings', 'data', self.addon_name,'persistence.json')
            except:
                if self.DEBUG:
                    print("Double error making persistence file path")
                self.persistence_file_path = "/home/pi/.webthings/data/" + self.addon_name + "/persistence.json"
        
        if self.DEBUG:
            print("Current working directory: " + str(os.getcwd()))
        
        
        first_run = False
        try:
            with open(self.persistence_file_path) as f:
                self.persistent_data = json.load(f)
                if self.DEBUG:
                    print("Persistence data was loaded succesfully.")
                
        except:
            first_run = True
            print("Could not load persistent data (if you just installed the add-on then this is normal)")
            self.persistent_data = {'items':[]}
            
        if self.DEBUG:
            print("self.persistent_data is now: " + str(self.persistent_data))


        # Is there user profile data?    
        #try:
        #    print(str(self.user_profile))
        #except:
        #    print("no user profile data")

            
        # Intiate extension addon API handler
        
        try:
            manifest_fname = os.path.join(
                os.path.dirname(__file__),
                '..',
                'manifest.json'
            )

            with open(manifest_fname, 'rt') as f:
                manifest = json.load(f)

            APIHandler.__init__(self, manifest['id'])
            self.manager_proxy.add_api_handler(self)
            

            if self.DEBUG:
                print("self.manager_proxy = " + str(self.manager_proxy))
                print("Created new API HANDLER: " + str(manifest['id']))
        
        except Exception as e:
            print("Failed to init UX extension API handler: " + str(e))

        


    # Read the settings from the add-on settings page
    def add_from_config(self):
        """Attempt to read config data."""
        try:
            database = Database(self.addon_name)
            if not database.open():
                print("Could not open settings database")
                return
            
            config = database.load_config()
            database.close()
            
        except Exception as ex:
            print("Error! Failed to open settings database: " + str(ex))
        
        if not config:
            print("Error loading config from database")
            return
        
        
        
        # Api token
        try:
            if 'Authorization token' in config:
                self.token = str(config['Authorization token'])
                print("-Authorization token is present in the config data.")
        except:
            print("Error loading api token from settings")
        

        if 'Debugging' in config:
            self.DEBUG = bool(config['Debugging'])
            if self.DEBUG:
                print("-Debugging preference was in config: " + str(self.DEBUG))






#
#  HANDLE REQUEST
#

    def handle_request(self, request):
        """
        Handle a new API request for this handler.

        request -- APIRequest object
        """
        
        try:
        
            if request.method != 'POST':
                return APIResponse(status=404)
            
            if request.path == '/init' or request.path == '/update_items':

                try:
                    
                    if request.path == '/init':
                        if self.DEBUG:
                            print("Getting the initialisation data")
                            
                        try:
                            state = 'ok'
        
                            # Check if a token is present
                            if self.token == None:
                                state = 'This addon requires an authorization token to work. Visit the settings page of this addon to learn more.'


                            return APIResponse(
                                status=200,
                                content_type='application/json',
                                content=json.dumps({'state' : state, 'items' : self.persistent_data['items']}),
                            )
                        except Exception as ex:
                            print("Error getting init data: " + str(ex))
                            return APIResponse(
                                status=500,
                                content_type='application/json',
                                content=json.dumps({'state' : "Internal error: no thing data", 'items' : []}),
                            )
                            
                    
                    elif request.path == '/update_items':
                        try:
                            self.persistent_data['items'] = request.body['items']
                            
                            self.update_simple_things()
                                
                            # try to get the correct property type (integer/float)
                            try:
                                for item in self.persistent_data['items']:
                                    #print("_item: " + str(item))
                                    if 'thing2' in item and 'property2' in item:
                                        for thing in self.things:
                                            thing_id = str(thing['id'].rsplit('/', 1)[-1])
                                            #print("__id: " + str(thing_id))
                                            if str(item['thing2']) == thing_id:
                                                #print("BINGO. Props:")
                                                #print(str(thing['properties']))
                                                for thing_property_key in thing['properties']:
                                                    
                                                    property_id = thing['properties'][thing_property_key]['links'][0]['href'].rsplit('/', 1)[-1]
                                                    #print("property_id = " + str(property_id))
                                                    if str(item['property2']) == property_id:
                                                        #print("bingo for property: " + str(property_id))
                                                        #print("___type: " + str(thing['properties'][thing_property_key]['type']))

                                                        #self.persistent_data['items'][item]['property2_type'] = str(thing['properties'][thing_property_key]['type'])
                                                        item['property2_type'] = str(thing['properties'][thing_property_key]['type'])

                      
                            except Exception as ex:
                                print("Error finding if property should be int or float: " + str(ex))
                            
                            self.save_persistent_data()    
                                
                            
                            return APIResponse(
                                status=200,
                                content_type='application/json',
                                content=json.dumps({'state' : 'ok'}),
                            )
                        except Exception as ex:
                            if self.DEBUG:
                                print("Error saving updated items: " + str(ex))
                            return APIResponse(
                                status=500,
                                content_type='application/json',
                                content=json.dumps("Error updating items: " + str(ex)),
                            )
                            
                        
                    else:
                        return APIResponse(
                            status=500,
                            content_type='application/json',
                            content=json.dumps("API error"),
                        )
                        
                        
                except Exception as ex:
                    if self.DEBUG:
                        print("Error while handling request: " + str(ex))
                    return APIResponse(
                        status=500,
                        content_type='application/json',
                        content=json.dumps("Error in API handler"),
                    )
                    
            else:
                return APIResponse(status=404)
                
        except Exception as e:
            if self.DEBUG:
                print("Failed to handle UX extension API request: " + str(e))
            return APIResponse(
                status=500,
                content_type='application/json',
                content=json.dumps("API Error"),
            )


    def unload(self):
        self.running = False
        if self.DEBUG:
            print("Followers shutting down")




    def cancel_pairing(self):
        """Cancel the pairing process."""
        #print("END OF PAIRING -----------------------------")




#
#  SAVE TO PERSISTENCE
#

    def save_persistent_data(self):
        #if self.DEBUG:
        #print("Saving to persistence data store at path: " + str(self.persistence_file_path))
            
        try:
            if not os.path.isfile(self.persistence_file_path):
                open(self.persistence_file_path, 'a').close()
                if self.DEBUG:
                    print("Created an empty persistence file")
            #else:
            #    if self.DEBUG:
            #        print("Persistence file existed. Will try to save to it.")


            with open(self.persistence_file_path) as f:
                if self.DEBUG:
                    print("saving persistent data: " + str(self.persistent_data))
                json.dump( self.persistent_data, open( self.persistence_file_path, 'w+' ) )
                return True

        except Exception as ex:
            print("Error: could not store data in persistent store: " + str(ex) )
            return False



    
    
    