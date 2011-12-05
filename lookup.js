PROXY = "http://localhost:8001" // set this to your proxy endpoint

function mendeleyViewModel() {
  this.citations = ko.observableArray([]);
  this.query = ko.observable();
  this.state = ko.observable();
  this.lookup = function() {
    var self = this;
    if(self.query()) {
      self.state("Searching ..");
      var respCitations = [];
      $.ajax({
        url: PROXY,
        data: {query: self.query},
        dataType: "jsonp"
      })
      .success(function(data) {
        if(data && data.documents && data.documents.length) {
          respCitations = data.documents;
          self.state("");
        } else {
          self.state("No results :(");
        }
      })
      .error(function() {
        self.state("Request Error!");
      })
      .always(function() {
        self.citations(respCitations);
        self.query("");
      });
    }
  }
}

ko.applyBindings(new mendeleyViewModel());
