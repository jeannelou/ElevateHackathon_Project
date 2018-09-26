const express = require('express');
const router = express.Router();
const path = require('path');

let id = 0;
let parents = [];

// helpers
const helpers = require('../utils/helpers');

router.get('/login', (req, res) => { res.render('login'); })
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
})

router.post('/login', (req, res, next) => {
  const email = req.body.email;

  const user = parents.filter(user => {
    user.email === email;
  })

  if (user[0])
    res.redirect(`/user/${user[0].id}/child`)
  else
    res.status(404).json({ message: "failed Auth" })
})

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  // Validate stuff here

  const ID = id++;

  const new_user = {
    id: ID,
    email: email,
    children: [],
    location: req.body.location || {},
    endpoint: `/user/${ID}`
  };

  parents.push(new_user);

  res.redirect(`/user/${ID}/child`)
})

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  let user = findParent(userId);

  if (user) { res.redirect(user.endpoint) }
  else { res.status(404).json({ message: "failed Auth" }) }

})

router.get('/:userId/child', (req, res) => {
  res.render('child_profile', { endpoint: `/user/${req.params.userId}/child` });
})

router.post('/:userId/child', (req, res, next) => {
  const parent = findParent(req.params.userId);
  const birthday = `${req.body.month} ${req.body.day}, ${req.body.year}`;

  const location = req.body.location;

  if (parent) {
    const child_id = parent.children.length;

    const child = {
      id: child_id,
      name: req.body.name,
      birthday: birthday,
      endpoint: `/user/${parent.id}/child/${child_id}`
    }
    parent.children.push(child);
    console.log(parent)

    res.redirect(child.endpoint + '/recommendation');
  }
  else { res.status(404).json({ message: 'User is not found' }) };
})

// router.get('/:userId/child/:childId', (req, res, next) => {
//   const child = findChild(req.params.userId, req.params.childId);

//   res.status(200).json({ child: { ...child, age: helpers.calcAge(child.birthday) } })
// })

router.get('/:userId/child/:childId/recommendation', (req, res, next) => {
  const child = findChild(req.params.userId, req.params.childId);
  //console.log(helpers.calAge(child.birthday));

  res.render('recommendation');
})

router.get('/:userId/child/:childId/event', (req, res, next) => {
  const child = findChild(req.params.userId, req.params.childId)[0];
  const age = helpers.calAge(child.birthday);

  res.render('event', { events: [] });
})

router.get('/:userId/child/:childId/dental', (req, res, next) => {
  const child = findChild(req.params.userId, req.params.childId)[0];
  const age = helpers.calAge(child.birthday);
})

router.get('/:userId/child/:childId/support', (req, res, next) => {
  const child = findChild(req.params.userId, req.params.childId)[0];
  const age = helpers.calAge(child.birthday);
})




module.exports = router;

// Helpers

const findChild = (parent_id, child_id) => {
  const parent = findParent(parent_id);
  const child = parent.children.filter(child => (child.id == child_id));

  if (child.length == 1)
    return child[0];

  return null;
}

const findParent = (parent_id) => {
  const parent = parents.filter(user => (user.id == parent_id));
  if (parent.length == 1)
    return parent[0];
  return null;
}

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/categories.html'));
// });
// // app.get('/getChildCare', function (req, res) {
// //   res.send(child_care);
// // });
// app.get('/subtype.html', function (req, res){
//   res.sendFile(path.join(__dirname + '/subtype.html'));
// })
// app.get('/event.html', function (req, res){
//   res.sendFile(path.join(__dirname + '/event.html'));
// });
// app.get('/childCare', function (req, res) {
//   res.send(child_care);
// })