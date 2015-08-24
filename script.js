Keen.ready(function(){

  var client = new Keen({
      projectId: "522ea8fca136b00bbe000002",
      writeKey: "bae56e31a8923533abde6e4c22872f61cdbee42aff0e842000a4943ffc1e3d5adb598b1c59eb2f6d9285141f65070c71a90ce3ccb6ce9da9a569a98f6491036109546f47693095ec383def4f9cd82288fcfd5ff84f77bdeeb7b1e5c5c44a485cc8ea71bb5d9f18f454136c595add242d"
    });

  var sessionCookie = Keen.utils.cookie('keen-example-cookie');
  if (!sessionCookie.get('user_id')) {
      sessionCookie.set('user_id', Keen.helpers.getUniqueId());
  }

  var sessionTimer = Keen.utils.timer();
  sessionTimer.start();

  Keen.listenTo({
    'click #more_info': function(e){
        client.recordEvent('click', {
                clickEvent: {
                value: "more_info"
                }
        });
    },
    'click #message': function(e){
        console.log(e);
        client.recordEvent('click', {
              clickEvent: {
              value: "email"
              }
      });
    }
});

  // THE BIG DATA MODEL!
  client.extendEvents(function(){
      return {
          page: {
              title: document.title,
              url: document.location.href
              // info: {} (add-on)
          },
          referrer: {
              url: document.referrer
              // info: {} (add-on)
          },
          tech: {
              browser: Keen.helpers.getBrowserProfile(),
              // info: {} (add-on)
              ip: '${keen.ip}',
              ua: '${keen.user_agent}'
          },
          time: Keen.helpers.getDatetimeIndex(),
          visitor: {
              id: sessionCookie.get('user_id'),
              time_on_page: sessionTimer.value()
          },
          // geo: {} (add-on)
          keen: {
              timestamp: new Date().toISOString(),
              addons: [
                  {
                      name: 'keen:ip_to_geo',
                      input: {
                          ip: 'tech.ip'
                      },
                      output: 'geo'
                  },
                  {
                      name: 'keen:ua_parser',
                      input: {
                          ua_string: 'tech.ua'
                      },
                      output: 'tech.info'
                  },
                  {
                      name: 'keen:url_parser',
                      input: {
                          url: 'page.url'
                      },
                      output: 'page.info'
                  },
                  {
                      name: 'keen:referrer_parser',
                      input: {
                          page_url: 'page.url',
                          referrer_url: 'referrer.url'
                      },
                      output: 'referrer.info'
                  }
              ]
          }
      };
  });

  client.recordEvent('pageview');

});
