var call = function(number) {
  // TODO (agonzalezro): remove this for live
  // We don't want to call the police always :D
  number = '+447449601002';

  $('#callModal > .modal-body > input#from').keyup(onModalInputKeyUp);
  $('#callModal > .modal-body > input#to').val(number);

  var button = $("#callModal > .modal-footer > button");
  button.click(onModalButtonClick);

  $('#callModal').modal('show');
};

var onModalInputKeyUp = function (ev) {
  var button = $('#callModal > .modal-footer > button');
  var input = $('#callModal > .modal-body > input#from');

  if (input.val()) {
    button.removeClass('disabled');
  } else {
    if (!button.hasClass('disabled'))
      button.addClass('disabled');
  }
}

var onModalButtonClick = function (ev) {
  $(this).unbind('click');

  var from = $('#callModal > .modal-body > input#from').val();
  var to = $('#callModal > .modal-body > input#to').val();

  $.ajax({
    type: "POST",
    url: '/call',
    data: {
      from: from,
      to: to,
    }
  });
  //console.log(from);
  //console.log(to);
}
