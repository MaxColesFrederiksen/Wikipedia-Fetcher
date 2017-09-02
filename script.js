$(document).ready(function() {
  
   

  (function () {

    var fetcher = {

    
      init: function () {
        
        this.cacheDom();
        this.bindEvents();
        this.render();
      },

      cacheDom: function() {
        this.$window = $(window);
        this.$el = $('.output-wrap');
        this.$box = $('<div><div/>').addClass('output-box');
        this.$input = $('#searchInput');
        this.$button = $('#random-button');
        this.$articleWrap = $('.random-article-wrap');
        this.$diagonal = $('.diagonal-wrap');
   

       
      },

      bindEvents: function () {
        //on typing whe want to fire inputstring function
        this.$input.on('input', this.inputString.bind(this));
        this.$button.on('click', this.randomArticle.bind(this));
        this.$articleWrap.on('hover', this.diagonalAppear.bind(this));
       


      },

      //functions

      inputString: function(e, inputValue) {
        e.preventDefault();
        inputValue = this.$input.val();
        
        
        this.ajaxInit();

       

      },

      randomArticle: function(){

        var randomArticleAjaxCall = $.ajax({
          type: 'GET',
          dataType: 'json',
          url: 'https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&explaintext&exintro=&format=json&',
        });

        var self = this;


        randomArticleAjaxCall.then(function(data){
          self.randomArticleLink(data);

        });




      },


      diagonalAppear: function() {

        this.$diagonal.addClass("visable");

      },



      randomArticleLink: function(data){
        var self= this;
        $.each(data.query.pages, function(k, v) {
          $.getJSON('http://en.wikipedia.org/w/api.php?action=query&prop=info&pageids='+v.pageid+'&inprop=url&explaintext&format=json&callback=?', function(url) {
            $.each(url.query.pages, function(key, page) {
                console.log(page);
                var url = page.fullurl;
                self.$el.empty();
                self.$el.append('<a href="' + page.fullurl + '" target="_blank" class="random-article-wrap"><h1>' + page.title + '</h1><div class="diagonal-wrap"><img src="diagonal.svg"></div></a>');

            });
        });
    });

        
      },

      ajaxInit: function(data){

        var inputValue = this.$input.val();


        var ajaxCall = $.ajax({
          type: 'GET',
          dataType: 'json',
          url: 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&search=' + inputValue + '&limit=8&namespace=0&prop=images&exintro&exlimit=1&explaintext&format=json',
        });

        var self = this;

        ajaxCall.then(function(data){
          console.log(data);
        

          if (data[1].length <= 0) {
            self.noArticles(data);
          } else {

          self.produceBox(data);
        }
        });
    

        },

        noArticles: function() {

          this.$el.empty();
          this.$el.append("<div><p>No Articles Found...<p>");

        },

      produceBox: function(data) {

          var titles = data[1];
          var subTitles = data[2];
          var links = data[3];

          var self = this;

          self.$el.empty();

          $.each(titles, function(value, index){
            self.$el.append('<a id="' + value + '" href="' + links[value] + '" target="_blank"><h1>' + titles[value] +  '</h1><p>' + subTitles[value] + '</p></a><div class="linebreaker">');

          });
      },


      render: function () {

        console.log("Rendered");

      },
    
    };

    fetcher.init();

  })();

}());





// Parameters:

/*

- &explaintext = 'all text content in one giant string without markup'

- &exintro = 'short summary of beginning of text content'

- &prop=extracts = 'display text extract'

- &action=opensearch&search=______ = 'Inputted text will be searched for'

- &limit=_____ = 'Amount of possible responses per search (3, 10, 20 etc.)'

- &titles=_____ = 'The specified article'

*/ 