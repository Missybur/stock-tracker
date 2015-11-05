'use strict';

$(document).ready(() => {

  let apiURL = 'http://dev.markitondemand.com/MODApis/Api/v2/';

  $('#find').click(findCompany);
  $('#query').on('keypress', (e) => {
    if (e.charCode === 13) findCompany();
  }).focus();
  $('#results').on('click', 'a', getQuote)

  function findCompany() {
    let company = $('#query').val();
    $.ajax({
      url: apiURL + 'Lookup/jsonp?input=' + company,
      dataType: 'jsonp'
    })
    .done((data) => {
      let list = data.map((co) => {
        return $('<li>').append($('<a>').text('Symbol: ' + co.Symbol + ', ' +
                                              'Name: ' + (co.Name ? co.Name : '???') + ', ' +
                                              'Exchange: ' + co.Exchange)
                                        .attr('href', '#')
                                        .attr('data-symbol', co.Symbol));
      });
      list.sort(($li1, $li2) => {
        return $li1.find('a').data('symbol') > $li2.find('a').data('symbol');
      });
      $('#results').empty().append(list);
      if (list.length === 0) {
        $('#results').append( $('<p>').text('no matches found').css('color', 'red') );
      }
    })
    .fail((error) => console.log('fail:', error))
  }

  function getQuote() {
    let symbol = $(this).data('symbol');
    $.ajax({
      url: apiURL + 'Quote/jsonp?symbol=' + symbol,
      dataType: 'jsonp'
    })
    .done((data) => {
      // console.log('quote:', data);
      try {
        let time = data.Timestamp.split(' ').slice(1,5).join(' ');
        let name = data.Name ? data.Name : data.Symbol;
        $('#quote').append(name + ': <strong>' + data.LastPrice + '</strong> (' + time + ')<br>');
      } catch (e) {
        console.log('ERROR GETTING QUOTE:', e);
      }
    })
    .fail((error) => console.log('fail:', error))
  }
  
})