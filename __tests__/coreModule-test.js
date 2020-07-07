const glob = { loader: null };

test("loader", () => {
  glob.loader = require("../core/App/pluginLoader/loader");

  expect(glob.loader).not.toBe(undefined);
});

test("Initalizing Database", async () => {
  const Modules = (await glob.loader()).get();

  const dbConnection = Modules["DB"].connection;

  expect(dbConnection.close).not.toBe(undefined);

  glob.dbConnection = dbConnection;
  glob.Modules = Modules;
});

test("Implementing gridFsBucket", async () => {
  glob.Modules[
    "createBucket"
  ] = require("../core/plugins/DB/Bucket/bucket-implementation").getBucket(
    glob.Modules
  );

  expect(glob.Modules.createBucket).not.toBe(undefined);
  const bucket = glob.Modules.createBucket();
  expect(bucket.uploadFile && bucket.downloadFile).not.toBe(undefined);
});

test("implementing Database implementation", async () => {
  glob.Modules["DB"] = require("../core/plugins/DB/DB-Implementation")(
    glob.Modules
  );

  const { DB } = glob.Modules;
  expect(DB.save).not.toBe(undefined);
  expect(DB.update).not.toBe(undefined);
  expect(DB.validateUser).not.toBe(undefined);
  expect(DB.delete).not.toBe(undefined);
  expect(DB.findOne).not.toBe(undefined);
  expect(DB.findAll).not.toBe(undefined);
});

test("DB.save operation",async ()=>{
    const {DB} = glob.Modules;
    const {createUser} = require("../core/App/Entity/User");
     const user = createUser({
         name:"Test-Name",
         email:"testName@mail.com",
         auth:null,
     });
     
     const res = await DB.save(user);
     
     expect(res.err).toBeFalsy();
     expect(res.data).not.toBe(undefined);
     expect(res.data._id).not.toBe(undefined);

});

test("closing Database", async () => {
  try {
    await glob.dbConnection.close();
  } catch (e) {
    throw e;
  }
});
