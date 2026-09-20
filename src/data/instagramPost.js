// Andere posts tonen: vervang `url` door de link van de post (Instagram → ⋯ → Link kopiëren).
// `aspect` = hoogte / breedte van het beeld: staand 4:5 = 1.25, vierkant = 1, reel 9:16 = 1.78.
// `hideLikes: true` als de post het aantal likes verbergt (de embed is dan iets korter).
const instagram = {
  profile: 'https://www.instagram.com/alindastam',
  handle: '@alindastam',
  posts: [
    { url: 'https://www.instagram.com/p/Dc4TiyiEUPJ/', aspect: 1.25 },
    { url: 'https://www.instagram.com/p/Dcbuxt0kTx7/', aspect: 1.25, hideLikes: true },
  ],
}

export default instagram
