const fakeData = require('../utils/fake-data')
const { init } = require('../chart')
const data = fakeData()

init({ id: '#root', data, lineType: 'angle', initiallyExpanded: [data.id, data.children[0].id] })
