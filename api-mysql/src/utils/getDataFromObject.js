module.exports = function getDataFromObject(data, key) {
	if (!data || !key || typeof data !== 'object') return false
	key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')
	let keys = key.split('.')

	for (var i = 0, n = keys.length; i < n; ++i) {
		var _key = keys[i]
		if (_key in data && data[_key]) {
			data = data[_key]
		} else {
			return false
		}
	}

	return data
}