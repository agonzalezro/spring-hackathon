// We always create an Ember application in the first line
Chat = Ember.Application.create({
  LOG_TRANSITIONS: true, 
});

// Then we define our models which *extend* the Ember object (so we can create instances)
Chat.chat = Ember.Object.extend({
    from     : null,
    to       : null,
    msg      : null,
    date     : new Date(),
    xtrainfo : {},
});



Chat.Controller = Ember.Object.create({
    chats: Ember.A(),
    init: function(){
        console.log("Work Ok the init file");
        var messages = this.get('chats')
        messages.addObject(Chat.chat.create({
            from :     'eloy',
            to   :     'conference',
            msg  :     'hello eloy',
            xtrainfo:  {type:'merda'},
        }));
    },
    createChat: function(from,to,msg){
        console.log("createChat work nice in this moment");
        this.get('chats').addObject({from: from, to: to, msg: msg});
        console.log(this.get('chats'));
    },
    pendingChats: function(){
        console.log("pending chats ok")
        return this.get('chats').length;
    }.property('chats.@each'),
});

Chat.CreateChatView = Ember.View.extend({
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


