var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var data = JSON.parse(event.body);
    
    var from = data.from;
    var to = data.to;
    
    if(!from || !to)
        return error(callback, 500, "A 'from' and 'to' value are required.");

    createRedirect(from, to).then(function(data) {
        ok(callback);
    }).catch(function(err){
        error(callback, 500, err);
    });
};

function ok(callback, response) {
    var okPayload = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(response)
    };
    callback(null, okPayload);
    
}

function error(callback, status, errMessage) {
    var errPayload = {
        statusCode: status,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(errMessage)
    };
    
    callback(null, errPayload);
}

function createRedirect(short, long, callback){
    var s3 = new AWS.S3();
    var bucketName = "brog.ly"
    var objectKey = decodeURIComponent(short);
    var redirectLocation = decodeURIComponent(long);
    
    objectKey = objectKey.replace(/[^a-zA-Z0-9]/g, "");
    
    var head = s3.headObject({
        Bucket: bucketName,
        Key: objectKey
    }).promise();
    
    var params = {
        Bucket : bucketName,
        Key : objectKey,
        Body : "",
        WebsiteRedirectLocation: redirectLocation,
        ACL: "public-read"
    }
    
    return head.then(function objectFound(data){
        return Promise.reject("Redirect already exsists.");
    }, function noObject(err){
        return s3.putObject(params).promise();
    });
}