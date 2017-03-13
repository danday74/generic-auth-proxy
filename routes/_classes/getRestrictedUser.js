let getRestrictedUser = (user) => {

  let properties = ['username', 'email'];
  return Object.keys(user)
    .filter(key => properties.includes(key))
    .reduce((obj, key) => {
      obj[key] = user[key];
      return obj;
    }, {});
};

module.exports = getRestrictedUser;
