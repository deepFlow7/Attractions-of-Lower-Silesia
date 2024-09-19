const accessorNames = [
  'attractions',
  'challenges',
  'comments',
  'favourites',
  'logins',
  'photos',
  'rankings',
  'ratings',
  'toVisit',
  'users'
];

const accessors = {};

accessorNames.forEach(name => {
  const accessorModule = require(`./Accessors/${name}`);
  Object.assign(accessors, accessorModule);
});

module.exports = accessors;