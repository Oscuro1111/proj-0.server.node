module.exports.getBucket = ({ DB }) =>(opt=null)=>{
  const { Readable } = require("stream");
  const { connection, mongodb } = DB;
  const { ObjectId } = DB.Schema;
 
  var bucketName = null;

  //if need new bucket
  if (opt) {
    bucketName = opt.bucketName;
  } else {
    //Default bucket for posts
    bucketName = "Posts.Data";
  }

  connection.s = {promiseLibrary:Promise};//fixes package grid-stream bug && using default promise library

  const _bucket = new mongodb.GridFSBucket(connection, {
    bucketName: bucketName,
  });
  return {
    uploadFile: async ({ name, data }) => {
      const readStream = new Readable();
      readStream.push(data);
      readStream.push(null);

      const uploadStream = _bucket.openUploadStream(name);

      const id = uploadStream.id;

      const initUpload = new Promise((resolve, reject) => {
        readStream.pipe(uploadStream);

        uploadStream.on("finish", () => {
          resolve({ status: true, uploadId: id });
        });

        uploadStream.on("error", (err) => {
          if (err) {
            resolve({ status: false, err: err });
          } else {
            resolve({ status: false, err: null });
          }
        });
      }); //End of promise

      return await initUpload;
    },//End of uploadFile
    downloadFile: async (uploadid) => {
      const chunks = []; //data chunks

      const initDownload = new Promise((resolve, reject) => {
        const downloadStream = _bucket.openDownloadStream(
          new ObjectId(uploadid)
        );

        downloadStream.on("error", () => {
          resolve({ err: true });
        });

        downloadStream.on("data", (chunk) => {
          chunks.push(chunk);
        });

        downloadStream.on("end", () => {
          resolve({ data: Buffer.concat(chunks) });
        });
      }); //End of promise

      return await initDownload;
    }, //End of downloadFile function,
  };
};
