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
  policeStations: Ember.A(),
  filteredSearch: Ember.A(),

  render: function() {
    Police.Collection.render();
  },

  init: function(){
    var render = this.get('render');

    var stations = this.get('policeStations');
    var filtered = this.get('filteredSearch');

    $.getJSON('/police?offset=2000&limit=1500', function(data) {
      $.each(data, function(index, item){
        createPoint(item);
        station = Police.police.create(item);
        stations.addObject(station);
        Police.Collection.content.push(station);
      });

      render();
    });
  },

  search: function() {
    var query = $('.search-query').val();

    var render = this.get('render');
    var stations = this.get('policeStations');
    var filtered = this.get('filteredSearch');

    stations.forEach(function (item) {
      filtered.clear();
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        filtered.addObject(item);
    });

    render();
  }
});


Police.Collection = Ember.CollectionView.create({
  tagName: 'ul',
  classNames: ['dropdown-menu'],
  content: [],

  itemViewClass: Ember.View.extend({
    tagName: 'li',
    templateName: 'station-view'
  })
}).appendTo('.dropdown');


// TODO (agonzalezro): This is a little bit crappy, please, fix
// Probably the application should include this searchbox too
$('.search-query').keypress(function onKeyPress() {
  Police.Controller.search();
});
