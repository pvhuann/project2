const express = require('express')
const app = express()
const port = 3000;

app.use(express.json({ extended: false }));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId: 'AKIAV3EHL4S6SXNFAOWM',
    secretAccessKey: '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',
    region: 'us-east-1'
});
AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'Paper';
const multer = require('multer');
const upload = multer();

app.get('/', (req, res) => {
    const params = {
        TableName: tableName
    }
    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send(err);
        } else {
            return res.render('index', { Papers: data.Items.sort((a, b) => a.stt - b.stt) })
        }
    });
});

app.post('/', upload.fields([]), (req, res) => {
        const { stt, tenBaiBao, tenTacGia, isbn, soTrang, namXuatBan } = req.body;
        const params = {
            TableName: tableName,
            Item: {
                "stt": stt,
                "tenBaiBao": tenBaiBao,
                "tenTacGia": tenTacGia,
                "isbn": isbn,
                "soTrang": soTrang,
                "namXuatBan": namXuatBan,
            }
        }
        docClient.put(params, (err, data) => {
            if (err) {
                return res.send(err);
            } else {
                return res.redirect("/");
            }
        })
    })
    //chuyen trang them
app.get('/add', (req, res) => {
    res.render('add')
})
app.post('/delete', upload.fields([]), (req, res) => {
    const { stt } = req.body;
    console.log(req.body)
    const params = {
        TableName: tableName,
        Key: {
            stt
        }
    };
    console.log("tao la params" + params)
    docClient.delete(params, (err, data) => {
        if (err) {
            return res.send(err);
        } else {
            return res.redirect("/");
        }
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})