import { sessionToken } from '../../utils/token-generator';
import { authorize } from '../../utils/authorize-resolvers';
import Blogs from '../../models/blog'
import moment from 'moment';
import { UserInputError } from 'apollo-server-express';
import fs from 'fs'
const path = require('path');

const processUpload = async (upload, dirBase) => {
  try {
    const { createReadStream, filename, mimetype, encoding } = await upload;
    const stream = createReadStream()
    let relativePath = await storeFS( stream, filename, dirBase );

    return {
      filename: filename,
      mimetype: mimetype,
      encoding: encoding,
      relativePath: relativePath
    }
  } catch (error) {
    console.log('---: error processUpload Transaction: ', error);
  }
};

const storeFS = ( stream, filename, dirBase) => {
  const id = Date.now();
  const extension = path.parse(filename).ext;
  const relativePath = `/files/${id}${extension}`;
  const _path = `${dirBase}/files/${id}${extension}`; //  /files/supports/1538723417954.png
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated) {
          // Delete the truncated file
          fs.unlinkSync(_path);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(_path))
      .on("error", error => {
        reject(error)
      })
      .on("finish", () => resolve(relativePath))
  );
};

export const Query = {
  
}

export const Mutation = {
  /* 
    singleUpload(file: Upload): File
  */

  singleUpload: authorize([], async (_, { file }, {credentials: { user }, dirBase}) => processUpload(file, dirBase))
}