'use strict';

const re = require('data-uri-regex');
const mime = require('mime');
const through2 = require('through2');
const fs = require('fs');

toFile = (input, path) => {
	return new Promise((resolve, reject) => {
		if (typeof input !== 'string') {
			return reject(new TypeError('Input should be string as base64'));
		}

		let data = re().exec(input);
		if (data) {
			let extension = mime.getExtension(data[2])
			fs.writeFile(path + '.' + extension, data[4], {
				encoding: "base64",
				flag: "w"
			}, (err, done) => {
				if (err) {
					console.log(err)
				}
				return resolve(data ? {
					mimeType: data[2],
					encoding: data[3],
					data: new Buffer(data[4]),
					path: path + '.' + extension,
					extension: extension
				} : undefined);
			})
		}

	});
}

module.exports = toFile;

module.exports.stream = () => {
	return through2.obj((chunk, enc, cb) => {
		let _stream = this;
		toFile(chunk.toString()).then(image => {
			_stream.push(image.data);
			cb();
		}).catch(err => {
			cb(err);
		});
	});
};