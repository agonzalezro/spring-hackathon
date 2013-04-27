// We always create an Ember application in the first line
Police = Ember.Application.create({
  LOG_TRANSITIONS: true,
});

// Then we define our models which *extend* the Ember object (so we can create instances)
Police.police = Ember.Object.extend({
    name: null,
    latitude: null,
    longitude: null,
    telephone: null,
    email: null
});

Police.Controller = Ember.Object.create({
    policeStation: Ember.A(),
    init: function(){
        var stations = this.get('policeStation')
        $.getJSON('/police?limit=1', function(data) {
            $.each(data, function(index,value){
              createPoint(value);
              stations.addObject(Police.police.create(value));
            });
        });
    },
    createStation: function(name,lat,longitude,phonenumber){
        var stations = this.get('policeStation')
        stations.addObject(Police.police.create({
            name: 'test#1',
            latitude: null,
            longitude: null,
            phonenumber: null,
        }));
    },
    totalStations: function(){
        console.log("pending chats ok")
        return this.get('policeStation').length;
    }.property('policeStation.@each'),
    show: function(event){
      openpopup(event.context);
    }
});
