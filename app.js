var express = require("express");
var app = express();
var fs = require("fs");
var moment = require("moment");
app.use(express.json());

const path = "data";
const pathPemasukan = path + "/pemasukan";
const pathPengeluaran = path + "/pengeluaran";
const pathStatus = path + "/status";
const pathChart = path + "/chart";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function checkDir() {
    if (!fs.existsSync(path)) {
        // Do something
        fs.mkdirSync(path);
    }
    if (!fs.existsSync(pathPemasukan)) {
        fs.mkdirSync(pathPemasukan);
    }
    if (!fs.existsSync(pathPengeluaran)) {
        fs.mkdirSync(pathPengeluaran);
    }
    if (!fs.existsSync(pathStatus)) {
        fs.mkdirSync(pathStatus);
    }
    if (!fs.existsSync(pathChart)) {
        fs.mkdirSync(pathChart);
    }
}

app.get("/", function (req, res) {
    res.send("Server is functioning!");
});

let server = app.listen(3003, function () {
    console.log("Express server listening on port " + server.address().port);

    checkDir();
});

app.get("/api/pemasukan", (req, res) => {
    try {
        const today = new Date(req.query["date"]);
        if (
            !fs.existsSync(
                `${pathPemasukan}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`
            )
        ) {
            res.status(200).send([[], { tunai: 0 }]);
        } else {
            var data = fs.readFileSync(
                `${pathPemasukan}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`
            );
            res.status(200).send(JSON.parse(data));
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post("/api/pemasukan", (req, res) => {
    try {
        const today = new Date(req.body["date"]);
        const data = [req.body["data"], { tunai: req.body["tunaiPemasukan"] }];

        if (!fs.existsSync(`${pathPemasukan}/${today.getFullYear()}`)) {
            fs.mkdirSync(`${pathPemasukan}/${today.getFullYear()}`);
        }
        if (
            !fs.existsSync(
                `${pathPemasukan}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }`
            )
        ) {
            fs.mkdirSync(
                `${pathPemasukan}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }`
            );
        }
        fs.writeFileSync(
            `${pathPemasukan}/${today.getFullYear()}/${
                monthNames[today.getMonth()]
            }/${today.getDate()}.json`,
            JSON.stringify(data)
        );
        res.status(201).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/api/pengeluaran", (req, res) => {
    try {
        const today = new Date(req.query["date"]);

        if (
            !fs.existsSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`
            )
        ) {
            res.status(200).send([[], { tunai: 0 }]);
        } else {
            var data = fs.readFileSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`
            );
            res.status(200).send(JSON.parse(data));
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post("/api/pengeluaran", async (req, res) => {
    try {
        let reqData = req.body;
        let today = moment(reqData["tgl"], "DD MMM YYYY").toDate();
        let newData = {};
        newData["nominal"] = reqData["nominal"];
        newData["status"] = false;
        newData["gudang"] = false;
        newData["bank"] = reqData["bank"];
        newData["cek"] = reqData["cek"];
        if (!fs.existsSync(`${pathPengeluaran}/${today.getFullYear()}`)) {
            fs.mkdirSync(`${pathPengeluaran}/${today.getFullYear()}`);
        }
        if (
            !fs.existsSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }`
            )
        ) {
            fs.mkdirSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }`
            );
        }
        if (
            !fs.existsSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`
            )
        ) {
            fs.writeFileSync(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`,
                JSON.stringify([[newData], { tunai: 0 }])
            );
        } else {
            fs.readFile(
                `${pathPengeluaran}/${today.getFullYear()}/${
                    monthNames[today.getMonth()]
                }/${today.getDate()}.json`,
                function (err, data) {
                    var json = JSON.parse(data);
                    for (let x = 0; x < json[0].length; x++) {
                        if (
                            json[0][x]["bank"] == newData["bank"] &&
                            json[0][x]["cek"] == newData["cek"]
                        ) {
                            json[0].splice(x, 1);
                        }
                    }
                    json[0].push(newData);
                    fs.writeFile(
                        `${pathPengeluaran}/${today.getFullYear()}/${
                            monthNames[today.getMonth()]
                        }/${today.getDate()}.json`,
                        JSON.stringify(json),
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            );
        }
        res.status(201).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put("/api/pengeluaran", (req, res) => {
    try {
        const date = req.body["date"];
        const data = req.body["data"];
        const tunai = req.body["tunai"];
        const today = new Date(date);

        fs.writeFileSync(
            `${pathPengeluaran}/${today.getFullYear()}/${
                monthNames[today.getMonth()]
            }/${today.getDate()}.json`,
            JSON.stringify([data, { tunai }])
        );
        res.status(200).send();
    } catch (err) {
        res.send(400).send(err);
    }
});

app.post("/api/status", async (req, res) => {
    try {
        var date = req.body["date"];
        if (!fs.existsSync(pathStatus + "/status.json")) {
            fs.writeFileSync(
                pathStatus + "/status.json",
                JSON.stringify([{ date: date, status: "Tidak Lengkap" }])
            );
        } else {
            fs.readFile(`${pathStatus}/status.json`, function (err, data) {
                var json = JSON.parse(data);
                if (json.filter((item) => item["date"] === date).length === 0) {
                    json.push({ date: date, status: "Tidak Lengkap" });
                    fs.writeFile(
                        `${pathStatus}/status.json`,
                        JSON.stringify(json),
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            });
        }
        res.status(201).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/api/status", (req, res) => {
    try {
        if (!fs.existsSync(`${pathStatus}/status.json`)) {
            res.status(200).send([]);
        } else {
            var data = fs.readFileSync(`${pathStatus}/status.json`);
            res.status(200).send(JSON.parse(data));
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put("/api/status", async (req, res) => {
    try {
        var date = moment(req.body["date"]).format("DD MMM YYYY");
        var status = req.body["status"];
        if (status) {
            fs.readFile(`${pathStatus}/status.json`, function (err, data) {
                var json = JSON.parse(data);
                if (json.filter((item) => item["date"] === date).length !== 0) {
                    json = json.filter((item) => item["date"] !== date);
                    fs.writeFile(
                        `${pathStatus}/status.json`,
                        JSON.stringify(json),
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            });
        } else {
            fs.readFile(`${pathStatus}/status.json`, function (err, data) {
                var json = JSON.parse(data);
                if (json.filter((item) => item["date"] === date).length === 0) {
                    json.push({ date: date, status: "Tidak Lengkap" });
                    fs.writeFile(
                        `${pathStatus}/status.json`,
                        JSON.stringify(json),
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            });
        }
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put("/api/chart", async (req, res) => {
    try {
        var month = monthNames[new Date().getMonth()];
        var year = new Date().getFullYear();
        var newData = req.body["data"];
        if (!fs.existsSync(`${pathChart}/${year}`)) {
            fs.mkdirSync(`${pathChart}/${year}`);
        }
        if (!fs.existsSync(`${pathChart}/${year}/chart.json`)) {
            fs.writeFileSync(
                `${pathChart}/${year}/chart.json`,
                JSON.stringify([{ month: month, profit: newData }])
            );
        } else {
            fs.readFile(
                `${pathChart}/${year}/chart.json`,
                function (err, data) {
                    var json = JSON.parse(data);
                    let found = false;
                    for (let x = 0; x < json.length; x++) {
                        if (json[x]["month"] === month) {
                            json[x]["profit"] += newData;
                            found = true;
                        }
                    }
                    if (!found) {
                        json.push({ month, profit: newData });
                    }
                    fs.writeFile(
                        `${pathChart}/${year}/chart.json`,
                        JSON.stringify(json),
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            );
        }
        res.status(201).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/api/chart", (req, res) => {
    try {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let remaining = 12 - month;
        let remainingData = [];
        if (!fs.existsSync(`${pathChart}/${year}/chart.json`)) {
            res.status(404).send([]);
        } else {
            if (remaining > 0) {
                if (fs.existsSync(`${pathChart}/${year - 1}/chart.json`)) {
                    remainingData = JSON.parse(
                        fs.readFileSync(`${pathChart}/${year - 1}/chart.json`)
                    );
                    remainingData = remainingData.slice(
                        Math.max(remainingData.length - remaining, 0)
                    );
                }
            }
            var data = JSON.parse(
                fs.readFileSync(`${pathChart}/${year}/chart.json`)
            );
            res.status(200).send([...remainingData, ...data]);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = app;
