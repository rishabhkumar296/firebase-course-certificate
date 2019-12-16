# firebase-course-certificate

Firebase function to generate a certificate in pdf format

Curl request :
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"userName": "ABC", "courseName": "XYZ"}' -o certificate.pdf  https://cloudfunctions.net/certificate
```

Sample `secret.ts` file

```
export const secret = {
    bucket_path: "gs://firbase-course-certificate.appspot.com"
}
```


Sample `test.html` file for certificate schema

```
<html>
  <head>
    <style>
      h1.certificate_heading{
        text-align: center;
        margin-bottom: 100px;
      }
      h2.certificate_body{
        text-align: center
      }
    </style>
  </head>
  <body>
    <h1 class="certificate_heading">Certificate of Completion</h1>
    <h2 class="certificate_body">Congratulations <span id="userName"></span> on successful completion of course on <span id="courseName"></span></h2>
  </body>
</html>
```
