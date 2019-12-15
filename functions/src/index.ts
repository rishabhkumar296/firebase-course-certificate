import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { JSDOM } from 'jsdom';
import * as pdf from 'html-pdf';
import { environment } from './environment';
import { secret } from './secret';

admin.initializeApp();

export const certificate = functions.https.onRequest((request, response) => {
    if(request.method !== "POST"){
        response.status(400).send(environment.invalid_http_request);
        return;
    }
    const userName = request.body.userName;
    const courseName = request.body.courseName;

    const bucket = admin.storage().bucket(secret.bucket_path);
    const file = bucket.file(environment.html_file);

    file.download().then(function(contents) {
        const data = contents[0];
        const { window } = new JSDOM(data.toString());
        const doc = window.document;
        if(doc === null){
            response.status(400).send(environment.invalid_html_file);
        }

        const userElement = doc.getElementById("userName");
        if( typeof(userElement) !== 'undefined' && userElement !== null){
            userElement.innerHTML = userName;
        }

        const courseElement = doc.getElementById("courseName");
        if( typeof(courseElement) !== 'undefined' && courseElement !== null){
          courseElement.innerHTML = courseName;
        }
        console.log(doc.documentElement.outerHTML);
        const filename = userName + '_' + courseName + '.pdf';
        response.setHeader('Content-type', 'application/pdf');
        response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        const config = {
            orientation: 'landscape',
            format: 'A4'
        };

        // @ts-ignore 
        pdf.create(doc.documentElement.outerHTML, config).toStream(function(err, stream){
          stream.pipe(response);
        });
    }, function(err) {
        console.log(err);
        return;
    });
});
