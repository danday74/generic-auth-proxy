const _ = require('lodash');
const Joi = require('joi');
const Promise = require('bluebird');
const rp = require('request-promise');
const validate = require('express-validation');
const Osis = require('./classes/Osis');
const Versions = require('./classes/Versions');
const BibleHelper = require('./classes/BibleHelper');
const VerseResponse = require('./classes/VerseResponse');
const VerseResponseResult = require('./classes/VerseResponseResult');
const SearchResponse = require('./classes/SearchResponse');
const SearchResponseResult = require('./classes/SearchResponseResult');

const config = require('../../server.config');
const VerseInformationFactory = require('./classes/VerseInformationFactory');

let route = router => {
  router.route('/bible')
    .get(validate({
      query: { // params, body, query, headers, cookies
        q: Joi.string().required(),
        versions: Joi.string()
      }
    }), (req, res) => {

      let q = req.query.q.trim();
      let versions = Versions.getVersionsFromQuery(req.query.versions);
      let verseInformation = VerseInformationFactory.getVerseInformation(q);
      let promises = [];
      let results = [];

      if (verseInformation && verseInformation.url) {

        let osis = new Osis(q);
        if (!osis.object) {
          return res.sendStatus(404);
        }

        // verse search
        for (let version of versions) {
          let url = config.providers.digitalBibleToolkit.endpoint
            + `/verse?v=2&key=${config.providers.digitalBibleToolkit.key}`
            + `&dam_id=${version.damId}${osis.object.testament}2ET&book_id=${osis.object.id}`
            + verseInformation.url;
          /* istanbul ignore next */
          config.logging && console.log(url);

          let promise = rp({
            url,
            timeout: config.timeout.upstream
          });
          promises.push(promise);
        }

        Promise.all(promises).then((dbtResponses) => {

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

                let cleanVerseText = BibleHelper.cleanText(verse.verse_text);

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

      } else {

        // free text search
        for (let version of versions) {
          let url = config.providers.digitalBibleToolkit.endpoint + `/search?v=2&key=${config.providers.digitalBibleToolkit.key}&dam_id=${version.damId}O2&query=${q}`;
          /* istanbul ignore next */
          config.logging && console.log(url);

          let promise = rp({
            url,
            timeout: config.timeout.upstream
          });
          promises.push(promise);
        }

        Promise.all(promises).then((dbtResponses) => {

          let counter = 0;
          for (let dbtResponse of dbtResponses) {

            let versesList = JSON.parse(dbtResponse)[1];

            let mappedVersesList = versesList.map((verse) => {
              return new SearchResponseResult(versions[counter], verse, q);
            });

            if (mappedVersesList.length) {
              results.push(mappedVersesList);
            }
            counter++;
          }
          results = _.flatten(results);
          BibleHelper.sortVersesInBiblicalOrder(results, versions);

          if (results.length) {
            return res.status(200).send(new SearchResponse(results, q));
          } else {
            return res.status(404).send('Free text search not found');
          }
        }).catch((err) => {

          if (err.message.includes('ESOCKETTIMEDOUT')) {
            return res.sendStatus(408);
          }
          return res.sendStatus(502);
        });
      }
    });
};

module.exports = route;
