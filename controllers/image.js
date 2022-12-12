

const USER_ID = 'sofiafaria';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'e0421aebab5a44699c0f0c65f5b76c1a';
const APP_ID = 'face-recognition';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';   

const handleClarifai = (req,res, ClarifaiStub, grpc) =>{

  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key "+ PAT);

  stub.PostModelOutputs(
    {
    user_app_id:{
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    model_id: MODEL_ID,
    version_id: MODEL_VERSION_ID,
    inputs: [
      {
        data: {
          image:{
            url: req.body.input
          }
        }
      }
    ]
  },
  metadata,
  (err, response) =>{
    if(err){
      return res.status(400).json('error accessing api')
    }
    if(response.status.code !==10000){
      return res.status(400).json('Post model failed, status: '+ response.status.description);
    }
    return res.json(response);
  });
}


const handleImage = (req,res, postgres) =>{
    const { id } = req.body;
    postgres('users')
  .where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => res.json(entries[0].entries))
  .catch(err => res.json('Unable to get entries'))
};

module.exports={
    handleImage: handleImage,
    handleClarifai: handleClarifai
}