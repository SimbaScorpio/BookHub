if (Meteor.isClient) {

  Template.cmptxt.events({
    'click button': function () {
      diffUsingJS();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

function diffUsingJS() {
  var difflib = require('difflib');
  var diffview = require('diffview');
  var base = difflib.stringAsLines($("#baseText").val());
  var newtxt = difflib.stringAsLines($("#newText").val());

  var sm = new difflib.SequenceMatcher(base, newtxt);
  var opcodes = sm.get_opcodes();
  var diffoutputdiv = $(".diffoutput");
  $('.diff').remove();

  diffoutputdiv.append(diffview.buildView({
      baseTextLines: base,
      newTextLines: newtxt,
      opcodes: opcodes,
      baseTextName: "Base Text",
      newTextName: "New Text",
      contextSize: 100,
      viewType: 0
  }));
}