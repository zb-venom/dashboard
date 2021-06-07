const Visits = require("../models/Visits");
const { google } = require("googleapis");

async function getVisit(type) {
  let data = [];
  let temp;
  1;
  switch (type) {
    case "number_of_guests_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            number_of_guests: { $sum: "$guest_count" },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            number_of_guests: "$number_of_guests",
          },
        },
      ]);
      break;
    case "average_visit_summary_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            average_visit_summary: { $avg: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            average_visit_summary: "$average_visit_summary",
          },
        },
      ]);
      break;
    case "visit_summary_per_city":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$city",
            visit_summary: { $sum: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            guest_id: "$_id",
            visit_summary: "$visit_summary",
          },
        },
      ]);
      break;
    case "visit_summary_per_guest":
      data = await Visits.aggregate([
        {
          $group: {
            _id: "$guest_id",
            visit_summary: { $sum: "$visit_sum" },
          },
        },
        {
          $project: {
            _id: 0,
            guest_id: "$_id",
            visit_summary: "$visit_summary",
          },
        },
      ]);
      break;
  }
  return data;
}

exports.getVisits = async (req, res) => {
  let data = [];
  data = await getVisit(req.params.type);
  res.json({
    data,
  });
};

exports.addVisits = async (req, res) => {
  let temp = req.body.data;
  temp = temp.split(",");
  let data = [];
  for (let i = 0; i < temp.length; i += 6) {
    let t = {
      date: temp[i + 1],
      city: temp[i + 2],
      guest_count: temp[i + 3],
      visit_sum: temp[i + 4],
      guest_id: temp[i + 5],
    };
    data.push(t);
    // let visits = new Visits(t);
    // visits.save();
  }
  res.json({ data });
};

exports.exportVisits = async (req, res) => {
  const auth0 = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  const auth = await auth0.getClient();
  const sheets = await google.sheets({ version: "v4", auth });
  const newSheet = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: req.params.type,
      },
    },
    fields: "spreadsheetId",
  });
  const data = await getVisit(req.params.type);
  const range = `Sheet1!A1`;
  const majorDimension = "ROWS";
  let values = [];
  switch (req.params.type) {
    case "number_of_guests_per_city":
      values.push(["город", "кол-во гостей"]);
      break;
    case "average_visit_summary_per_city":
      values.push(["город", "средння сумма"]);
      break;
    case "visit_summary_per_city":
      values.push(["город", "сумма"]);
      break;
    case "visit_summary_per_guest":
      values.push(["гость", "сумма"]);
      break;
  }
  data.forEach((data) => {
    values.push([
      data.city || data.guest_id,
      data.number_of_guests || data.average_visit_summary || data.visit_summary,
    ]);
  });
  const write = await sheets.spreadsheets.values.append({
    spreadsheetId: newSheet.data.spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      majorDimension,
      values,
    },
  });
  const drive = await google.drive({ version: "v3", auth });
  const perm = drive.permissions.create({
    fileId: newSheet.data.spreadsheetId,
    resource: {
      value: null,
      type: "anyone",
      role: "reader",
    },
  });

  res.json({
    url: `https://docs.google.com/spreadsheets/d/${newSheet.data.spreadsheetId}`,
  });
};
