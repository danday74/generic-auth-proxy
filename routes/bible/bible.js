const doSearch = require('./search/doSearch');
const doVerse = require('./verse/doVerse');
const validator = require('./validator');
const VerseInformationFactory = require('./classes/VerseInformationFactory');
const Versions = require('./classes/Versions');

let route = router => {
  router.route('/bible')
    .get(validator, (req, res) => {

      let q = req.query.q.trim();
      let versions = Versions.getVersionsFromQuery(req.query.versions);
      let verseInformation = VerseInformationFactory.getVerseInformation(q);

      if (verseInformation) {
        doVerse(res, q, versions, verseInformation);
      } else {
        doSearch(res, q, versions);
      }

    });
};

module.exports = route;
