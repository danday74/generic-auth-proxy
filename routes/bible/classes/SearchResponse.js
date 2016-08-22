class SearchResponse {
  constructor(results, q) {
    this.type = 'search';
    this.query = q;
    this.results = results;
    Object.seal(this);
  }
}

module.exports = SearchResponse;
