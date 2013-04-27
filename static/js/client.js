// We always create an Ember application in the first line
Police = Ember.Application.create({
  LOG_TRANSITIONS: true,
});

// Then we define our models which *extend* the Ember object (so we can create instances)
Police.police = Ember.Object.extend({
    name: null,
    latitude: null,
    longitude: null,
    phonenumber: null,
});



Police.Controller = Ember.Object.create({
    policeStation: Ember.A(),
    init: function(){
        console.log("Work Ok the init file");
        var stations = this.get('policeStation')
        stations.addObject(Chat.chat.create({
            name: 'test#1',
            latitude: null,
            longitude: null,
            phonenumber: null,
        }));
    },
    createStation: function(name,lat,longitude,phonenumber){
        var stations = this.get('policeStation')
        stations.addObject(Chat.chat.create({
            name: 'test#1',
            latitude: null,
            longitude: null,
            phonenumber: null,
        }));
    },
    pendingChats: function(){
        console.log("pending chats ok")
        return this.get('policeStation').length;
    }.property('policeStation.@each'),
});

Police.CreateStationView = Ember.View.extend({
    from: 'Merda',
    to: null,
    msg: null,
    delete: function(event){
        // If the button doesn't have submit property you don't need
        //event.preventDefault()
        Chat.Controller.deleteChat(this.get(id));
    },
    submit: function(event){
        //event.preventDefault();
        Chat.Controller.createChat(
                    this.get('from'),
                    this.get('to'),
                    this.get('msg'));
    }
});


