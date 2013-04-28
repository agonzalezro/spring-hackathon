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

  render: function() {
    // Seriously!? Please, do a pull request for fix this crap
    if (Police.Collection)
      Police.Collection.init();

    if (!$('.dropdown-menu').is(':visible'))
      $('.dropdown-menu').show()
  },

  init: function(){
    var stations = this.get('policeStations');

    $.getJSON('/police?limit=2', function(data) {
      $.each(data, function(index, item){
        createPoint(item);
        station = Police.police.create(item);
        stations.addObject(station);
      });
    });
  },

  search: function() {
    var query = $('.search-query').val();

    var render = this.get('render');
    var stations = this.get('policeStations');

    Police.Collection.content.clear();

    stations.forEach(function (item) {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        Police.Collection.content.push(item);
    });

    render();
  }
});


Police.Collection = Ember.CollectionView.create({
  tagName: 'ul',
  classNames: ['dropdown-menu'],

  content: [],

  templateName: 'station-collection-view',
  itemViewClass:  Ember.View.extend({
    tagName: 'li',
    templateName: 'station-view'
  })
});

Police.Collection.appendTo('.dropdown');


// TODO (agonzalezro): This is a little bit crappy, please, fix
// Probably the application should include this searchbox too
$('.search-query').keypress(function onKeyPress() {
  Police.Controller.search();
});

$('.dropdown').click(function onClick() {
  $('.dropdown-menu').hide();
});
