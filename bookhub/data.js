var root = typeof exports != 'undefined' && exports !== null ? exports : this;

var base = "";
if (Meteor.isServer) {
	base = process.env.PWD;
}

var FilesFS = new FS.Collection('images', {
  stores: [new FS.Store.FileSystem('images', {
    path: base + '/public/upload-img'
  })]
});

var IconsFS = new FS.Collection('userphoto', {
  stores: [new FS.Store.FileSystem('userphoto', {
    path: base + '/public/userphoto-img'
  })]
});


FilesFS.allow({
  insert: function(userId, party){
    return true;
  },
  update: function(userId, party){
    return true;
  },
  remove: function(userId, party){
    return true;
  },
  download: function(userId, party){
    return true;
  }
});


IconsFS.allow({
  insert: function(userId, party){
    return true;
  },
  update: function(userId, party){
    return true;
  },
  remove: function(userId, party){
    return true;
  },
  download: function(userId, party){
    return true;
  }
});

root.Novel = new Mongo.Collection("Novel");

root.FilesFS = FilesFS;

root.IconsFS = IconsFS;

Meteor.methods({
	'update-userphoto': function() {
    IconsFS.update( {
    	"metadata.authorId": Meteor.userId(),
    }, {$set : { "metadata.iscur": 0 }}, {multi: true});
  }
})