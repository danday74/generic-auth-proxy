const Imp = require('../classes/BibleImports');
const VerseResponse = require('./VerseResponse');
const VerseResponseResult = require('./VerseResponseResult');
const Osis = require('../classes/Osis');

let doVerse = (res, q, versions, verseInformation) => {

  // Respond 404 where a bible book cannot be identified
  let osis = new Osis(q);
  if (!osis.object) {
    return res.sendStatus(404);
  }

  let urlTemplate = Imp._.template(Imp.config.providers.digitalBibleToolkit.endpoint
    + `/verse?v=2&key=${Imp.config.providers.digitalBibleToolkit.key}`
    + `&dam_id=<%= damId %>${osis.object.testament}2ET&book_id=${osis.object.id}`
    + verseInformation.url);

  let promises = Imp.Requestor.getRequestPromises(urlTemplate, versions);



  // Handle DBT responses
  Imp.Promise.all(promises).then((dbtResponses) => {

    let responseObject;
    let counter = 0;
    for (let dbtResponse of dbtResponses) {

      // noinspection ES6ModulesDependencies, NodeModulesDependencies
      let verseList = JSON.parse(dbtResponse);
      if (verseList.length) {

        if (!responseObject) {
          responseObject = new VerseResponse(verseList[0]);
        }
        let result = new VerseResponseResult(versions[counter]);

        let verseCounter = 0;
        for (let verse of verseList) {

          let cleanVerseText = Imp.BibleHelper.cleanText(verse.verse_text);

          if (verseCounter > 0) {
            responseObject.verseEnd = parseInt(verse.verse_id);
          }

          result.text += `${cleanVerseText} `;
          if (verseList.length > 1) {
            result.textEnhanced += `<sup>${verse.verse_id}</sup>${cleanVerseText} `;
          } else {
            result.textEnhanced = result.text;
          }
          result.texts.push(cleanVerseText);
          verseCounter++;
        }

        result.text = result.text.trim();
        result.textEnhanced = result.textEnhanced.trim();

        responseObject.results.push(result);
      }

      counter++;
    }

    if (responseObject && responseObject.results.length) {
      responseObject.setSubTypeAndRefs(verseInformation.type);

      return res.status(200).send(responseObject);
    } else {
      return res.status(404).send('Verse search not found');
    }
  }).catch((err) => {

    if (err.message.includes('ESOCKETTIMEDOUT')) {
      return res.sendStatus(408);
    }
    return res.sendStatus(502);
  });

};

module.exports = doVerse;
