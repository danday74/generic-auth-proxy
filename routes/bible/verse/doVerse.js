const Imp = require('../classes/BibleImports');
const Osis = require('../classes/Osis');
const VerseResponse = require('./VerseResponse');

let doVerse = (res, q, versions, verseInformation) => {

  // Respond 404 where a bible book cannot be identified
  let osis = new Osis(q);
  if (!osis.object) {
    return res.sendStatus(404);
  }

  let urlTemplate = Imp._.template(Imp.config.providers.digitalBibleToolkit.endpoint
    + `/text/verse?v=2&key=${Imp.config.providers.digitalBibleToolkit.key}`
    + `&dam_id=<%= damId %>${osis.object.testament}2ET&book_id=${osis.object.id}`
    + verseInformation.url);

  let promises = Imp.Requestor.getRequestPromises(urlTemplate, versions);

  // Handle DBT responses
  Imp.Promise.all(promises).then((dbtResponses) => {

    let response;
    let counter = 0;
    for (let dbtResponse of dbtResponses) {

      // noinspection ES6ModulesDependencies, NodeModulesDependencies
      let verseList = JSON.parse(dbtResponse);
      if (verseList.length) {
        if (!response) {
          response = new VerseResponse(verseList[0]);
        }
        response.addResult(versions[counter], verseList);
      }
      counter++;
    }

    if (response && response.results.length) {
      response.setSubTypeAndRefs(verseInformation.type);
      return res.status(200).send(response);
    } else {
      return res.status(404).send('Verse not found');
    }

  }).catch((err) => {
    if (err.message.includes('ESOCKETTIMEDOUT')) {
      return res.sendStatus(408);
    }
    return res.sendStatus(502);
  });
};

module.exports = doVerse;
