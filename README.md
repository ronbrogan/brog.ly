# brog.ly
Brog.ly is a personal link shortener that I made to get accomodated with the AWS "serverless" technologies. Its main component is with S3, which handles the actual redirects. For each shortened URL, an empty object is created in the bucket with the proper metadata to serve the proper HTTP redirect to the client. 

To create a redirect object, I have setup a Lambda/API Gateway back end to handle creation of the S3 object. An `index.html` file lives in the bucket root, which is the front end component for the API. 