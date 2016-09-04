const BibleHelper = require('../classes/BibleHelper');
const Imp = require('../classes/BibleImports');
const SearchResponse = require('./SearchResponse');
const SearchResponseResult = require('./SearchResponseResult');

let doSearch = (res, q, versions) => {

  let urlTemplate = Imp._.template(Imp.config.providers.digitalBibleToolkit.endpoint
    + `/text/search?v=2&key=${Imp.config.providers.digitalBibleToolkit.key}`
    + `&dam_id=<%= damId %>O2&query=${q}`);

  let promises = Imp.Requestor.getRequestPromises(urlTemplate, versions);

  // Handle DBT responses
  Imp.Promise.all(promises).then((dbtResponses) => {

    let results = [];
    let counter = 0;
    for (let dbtResponse of dbtResponses) {

      // noinspection ES6ModulesDependencies, NodeModulesDependencies
      let verseList = JSON.parse(dbtResponse)[1];
      if (verseList.length) {

        let mappedVerseList = verseList.map((verse) => {
          return new SearchResponseResult(versions[counter], verse, q);
        });
        results.push(mappedVerseList);

      }
      counter++;
    }

    results = Imp._.flatten(results);
    BibleHelper.sortVersesInBiblicalOrder(results, versions);

    if (results.length) {
      return res.status(200).send(new SearchResponse(results, q));
    } else {
      return res.status(404).send('Search not found');
    }

  }).catch((err) => {
    if (err.message.includes('ESOCKETTIMEDOUT')) {
      return res.sendStatus(408);
    }
    return res.sendStatus(502);
  });
};

module.exports = doSearch;
